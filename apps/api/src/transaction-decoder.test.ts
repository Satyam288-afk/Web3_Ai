import assert from "node:assert/strict";
import test from "node:test";
import { decodeRawTransaction } from "./transaction-decoder.js";
import { encodeFunctionData, parseAbi } from "viem";

const unlimitedApproval =
  "0x095ea7b3000000000000000000000000000000000000000000000000000000000000deadffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

test("decodes ERC-20 unlimited approval calldata", () => {
  const decoded = decodeRawTransaction({
    to: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    data: unlimitedApproval,
    tokenSymbol: "USDC"
  });

  assert.equal(decoded.kind, "erc20-approve");
  assert.equal(decoded.functionName, "approve");
  assert.equal(decoded.spender?.toLowerCase(), "0x000000000000000000000000000000000000dead");
  assert.equal(decoded.isUnlimitedApproval, true);
});

test("returns unknown for unsupported calldata", () => {
  const decoded = decodeRawTransaction({ data: "0x12345678" });
  assert.equal(decoded.kind, "unknown");
  assert.equal(decoded.isUnlimitedApproval, false);
});

test("decodes Uniswap v2 swap constraints including zero minimum output and recipient", () => {
  const abi = parseAbi(["function swapExactTokensForTokens(uint256 amountIn,uint256 amountOutMin,address[] path,address to,uint256 deadline) returns (uint256[] amounts)"]);
  const data = encodeFunctionData({
    abi,
    functionName: "swapExactTokensForTokens",
    args: [50_000_000n, 0n, ["0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", "0x4200000000000000000000000000000000000006"], "0x000000000000000000000000000000000000dEaD", BigInt(Math.floor(Date.now() / 1000) + 600)]
  });
  const decoded = decodeRawTransaction({ to: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", data });
  assert.equal(decoded.kind, "uniswap-v2-swap");
  assert.equal(decoded.minimumAmountOutRaw, "0");
  assert.equal(decoded.recipient?.toLowerCase(), "0x000000000000000000000000000000000000dead");
  assert.match(decoded.riskNotes.join(" "), /Minimum output is zero/);
});
