import { baseSepolia, sepolia } from "viem/chains";

export const sentinelReportRegistryAbi = [
  {
    type: "function",
    name: "createReport",
    stateMutability: "nonpayable",
    inputs: [
      { name: "reportHash", type: "bytes32" },
      { name: "riskScore", type: "uint256" },
      { name: "recommendation", type: "string" },
      { name: "reportURI", type: "string" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "getUserReports",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "user", type: "address" },
          { name: "reportHash", type: "bytes32" },
          { name: "riskScore", type: "uint256" },
          { name: "recommendation", type: "string" },
          { name: "reportURI", type: "string" },
          { name: "timestamp", type: "uint256" }
        ]
      }
    ]
  },
  {
    type: "event",
    name: "ReportCreated",
    anonymous: false,
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "reportHash", type: "bytes32", indexed: true },
      { name: "riskScore", type: "uint256", indexed: false },
      { name: "recommendation", type: "string", indexed: false },
      { name: "reportURI", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false }
    ]
  }
] as const;

export const supportedChains = [baseSepolia, sepolia] as const;

export function getExplorerTxUrl(txHash?: string, baseUrl = "https://sepolia.basescan.org"): string | undefined {
  if (!txHash) return undefined;
  return `${baseUrl.replace(/\/$/, "")}/tx/${txHash}`;
}
