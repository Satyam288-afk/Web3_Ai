import { decodeFunctionData, isAddress, parseAbi, type Hex } from "viem";
import type { DecodedTransaction, RawTransactionInput } from "@sentinelmesh/shared";

const erc20Abi = parseAbi([
  "function approve(address spender,uint256 amount)",
  "function transfer(address to,uint256 amount)",
  "function transferFrom(address from,address to,uint256 amount)"
]);
const uniswapV2Abi = parseAbi([
  "function swapExactTokensForTokens(uint256 amountIn,uint256 amountOutMin,address[] path,address to,uint256 deadline) returns (uint256[] amounts)",
  "function swapExactETHForTokens(uint256 amountOutMin,address[] path,address to,uint256 deadline) payable returns (uint256[] amounts)",
  "function swapExactTokensForETH(uint256 amountIn,uint256 amountOutMin,address[] path,address to,uint256 deadline) returns (uint256[] amounts)"
]);
const uniswapV3Abi = parseAbi([
  "function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 deadline,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96) params) payable returns (uint256 amountOut)"
]);

const UINT256_MAX = (1n << 256n) - 1n;

export function decodeRawTransaction(transaction: RawTransactionInput): DecodedTransaction {
  const contractAddress = transaction.to && isAddress(transaction.to) ? transaction.to : undefined;
  const base = {
    contractAddress,
    isUnlimitedApproval: false,
    riskNotes: [] as string[]
  };

  if (!transaction.data || transaction.data === "0x") {
    return {
      ...base,
      kind: "unknown",
      functionName: "native-transfer-or-empty-call",
      riskNotes: ["No calldata was supplied, so SentinelMesh cannot decode contract intent."]
    };
  }

  try {
    const decoded = decodeFunctionData({
      abi: erc20Abi,
      data: transaction.data as Hex
    });

    if (decoded.functionName === "approve") {
      const [spender, amount] = decoded.args;
      const isUnlimitedApproval = amount === UINT256_MAX;
      return {
        ...base,
        kind: "erc20-approve",
        functionName: "approve",
        spender,
        amountRaw: amount.toString(),
        isUnlimitedApproval,
        riskNotes: [
          `ERC-20 approval grants ${spender} permission to spend ${transaction.tokenSymbol ?? "this token"}.`,
          isUnlimitedApproval
            ? "Allowance equals uint256.max, which is treated as unlimited approval risk."
            : "Allowance is finite, but spender trust should still be reviewed."
        ]
      };
    }

    if (decoded.functionName === "transfer") {
      const [recipient, amount] = decoded.args;
      return {
        ...base,
        kind: "erc20-transfer",
        functionName: "transfer",
        recipient,
        amountRaw: amount.toString(),
        isUnlimitedApproval: false,
        riskNotes: [`ERC-20 transfer sends tokens directly to ${recipient}.`]
      };
    }

    const [owner, recipient, amount] = decoded.args;
    return {
      ...base,
      kind: "erc20-transfer-from",
      functionName: "transferFrom",
      owner,
      recipient,
      amountRaw: amount.toString(),
      isUnlimitedApproval: false,
      riskNotes: ["transferFrom spends from another owner allowance; verify caller authorization and allowance scope."]
    };
  } catch {
    // Continue through supported router decoders.
  }

  try {
    const decoded = decodeFunctionData({ abi: uniswapV2Abi, data: transaction.data as Hex });
    if (decoded.functionName === "swapExactTokensForTokens" || decoded.functionName === "swapExactTokensForETH") {
      const [amountIn, amountOutMin, path, recipient, deadline] = decoded.args;
      return { ...base, kind: "uniswap-v2-swap", functionName: decoded.functionName, recipient, amountRaw: amountIn.toString(), minimumAmountOutRaw: amountOutMin.toString(), tokenPath: [...path], deadline: deadline.toString(), riskNotes: routerNotes(amountOutMin, deadline) };
    }
    const [amountOutMin, path, recipient, deadline] = decoded.args;
    return { ...base, kind: "uniswap-v2-swap", functionName: decoded.functionName, recipient, amountRaw: transaction.valueWei, minimumAmountOutRaw: amountOutMin.toString(), tokenPath: [...path], deadline: deadline.toString(), riskNotes: routerNotes(amountOutMin, deadline) };
  } catch {
    // Continue to Uniswap v3.
  }

  try {
    const decoded = decodeFunctionData({ abi: uniswapV3Abi, data: transaction.data as Hex });
    const [params] = decoded.args;
    return {
      ...base,
      kind: "uniswap-v3-swap",
      functionName: "exactInputSingle",
      recipient: params.recipient,
      amountRaw: params.amountIn.toString(),
      minimumAmountOutRaw: params.amountOutMinimum.toString(),
      tokenPath: [params.tokenIn, params.tokenOut],
      deadline: params.deadline.toString(),
      riskNotes: routerNotes(params.amountOutMinimum, params.deadline)
    };
  } catch {
    return { ...base, kind: "unknown", functionName: "unknown", riskNotes: ["Calldata did not match the supported ERC-20, Uniswap v2, or Uniswap v3 decoder allowlist."] };
  }
}

export function decodedAction(decoded: DecodedTransaction, tokenSymbol?: string) {
  if (decoded.kind === "erc20-approve") {
    return `Approve ${decoded.spender ?? "spender"} to spend ${tokenSymbol ?? "token"}${decoded.isUnlimitedApproval ? " with unlimited allowance" : ""}`;
  }
  if (decoded.kind === "erc20-transfer") {
    return `Transfer ${tokenSymbol ?? "token"} to ${decoded.recipient ?? "recipient"}`;
  }
  if (decoded.kind === "erc20-transfer-from") {
    return `Transfer ${tokenSymbol ?? "token"} from ${decoded.owner ?? "owner"} to ${decoded.recipient ?? "recipient"}`;
  }
  if (decoded.kind === "uniswap-v2-swap" || decoded.kind === "uniswap-v3-swap") {
    return `Swap through ${decoded.functionName} with minimum output ${decoded.minimumAmountOutRaw ?? "unknown"} to ${decoded.recipient ?? "unknown recipient"}`;
  }
  return "Unknown contract call";
}

function routerNotes(minimumAmountOut: bigint, deadline: bigint) {
  return [
    minimumAmountOut === 0n ? "Minimum output is zero, allowing unrestricted execution loss." : "A non-zero minimum output is encoded in calldata.",
    deadline * 1000n <= BigInt(Date.now()) ? "Swap deadline has expired." : "Swap deadline is still valid at decode time."
  ];
}
