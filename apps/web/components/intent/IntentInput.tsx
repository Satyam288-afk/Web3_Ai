"use client";

import { AlertTriangle, Loader2, Send } from "lucide-react";

export const intentExamples = [
  "Swap 0.2 ETH to USDC safely with low slippage",
  "Swap 10 ETH to PEPE as fast as possible with high slippage",
  "Bridge 1 ETH from Ethereum to Base",
  "Analyze risk of swapping 2 ETH to DAI",
  "Stake 100 USDC for yield"
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
    <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
      <textarea
        value={prompt}
        onChange={(event) => onPromptChange(event.target.value)}
        rows={3}
        className="w-full resize-none rounded-md border border-white/10 bg-panel2 p-3 text-sm text-white outline-none focus:border-teal/70"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {intentExamples.map((item, index) => (
            <button
              key={item}
              onClick={() => onSubmit(item)}
              disabled={loading}
              className="rounded-md border border-white/10 px-3 py-2 text-xs text-slate-300 hover:border-teal/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Example {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => onSubmit()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-teal px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          Parse Intent
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-rose-200">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}
    </div>
  );
}
