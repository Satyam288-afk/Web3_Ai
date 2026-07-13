"use client";

import { AlertTriangle, ArrowUp, Loader2, Sparkles } from "lucide-react";

export const intentExamples = [
  {
    label: "Safe swap",
    prompt: "Swap 0.2 ETH to USDC safely with low slippage",
    detail: "Low risk baseline"
  },
  {
    label: "High slippage",
    prompt: "Swap 1 ETH to USDC fast and allow high slippage",
    detail: "Warn on execution quality"
  },
  {
    label: "Unknown token",
    prompt: "Swap 0.5 ETH to MOONSAFE",
    detail: "Token and liquidity risk"
  },
  {
    label: "Large trade",
    prompt: "Swap 25 ETH to USDC with best price",
    detail: "Split-order recommendation"
  },
  {
    label: "Unsupported bridge",
    prompt: "Bridge 0.3 ETH from Ethereum to Solana",
    detail: "Analysis-only v0 path"
  },
  {
    label: "Critical block",
    prompt: "Swap 10 ETH to an unknown token with 20% slippage",
    detail: "Blocked unsafe route"
  }
];

export function IntentInput({
  prompt,
  loading,
  error,
  onPromptChange,
  onSubmit
}: {
  prompt: string;
  loading: boolean;
  error: string | null;
  onPromptChange: (prompt: string) => void;
  onSubmit: (prompt?: string) => void;
}) {
  return (
    <div>
      <textarea
        aria-label="DeFi intent"
        value={prompt}
        onChange={(event) => onPromptChange(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") onSubmit();
        }}
        placeholder="Describe the DeFi action you want to assess..."
        rows={3}
        className="w-full resize-none border-0 border-b border-white/15 bg-transparent px-0 py-5 text-xl leading-8 text-white outline-none placeholder:text-white/35 focus:border-blue-500"
      />
      <div className="mt-4 flex justify-end border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => onSubmit()}
          disabled={loading || !prompt.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1e3a8a] px-5 py-2.5 text-sm font-black text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <ArrowUp size={16} />}
          Review intent
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-white/40">
        <Sparkles size={13} className="text-[#67e8f9]" />
        Deterministic analysis with a clearly labeled live-data fallback. Press Cmd/Ctrl + Enter to submit.
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-300/25 bg-red-500/12 p-3 text-sm text-red-100">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}
    </div>
  );
}
