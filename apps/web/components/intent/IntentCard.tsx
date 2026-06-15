"use client";

import type { DeFiAction, DeFiIntent, DeFiPriority, RiskTolerance } from "@sentinelmesh/shared";

const actions: DeFiAction[] = ["swap", "bridge", "stake", "analyze", "unsupported"];
const priorities: DeFiPriority[] = ["safety", "speed", "cost", "yield"];
const riskTolerances: Array<RiskTolerance | ""> = ["", "low", "medium", "high"];

export function IntentCard({ intent, onChange }: { intent: DeFiIntent | null; onChange: (updatedIntent: DeFiIntent) => void }) {
  if (!intent) {
    return (
      <div className="rounded-lg border border-white/10 bg-panel/92 p-5">
        <h2 className="font-semibold text-white">Parsed Intent</h2>
        <p className="mt-3 text-sm text-slate-400">Submit a DeFi prompt to fill the editable intent card.</p>
      </div>
    );
  }

  const currentIntent = intent;

  function update<K extends keyof DeFiIntent>(key: K, value: DeFiIntent[K]) {
    onChange({ ...currentIntent, [key]: value } as DeFiIntent);
  }

  function updateConstraint<K extends keyof DeFiIntent["constraints"]>(key: K, value: DeFiIntent["constraints"][K] | "") {
    onChange({
      ...currentIntent,
      constraints: {
        ...currentIntent.constraints,
        [key]: value || undefined
      }
    });
  }

  return (
    <div className="rounded-lg border border-white/10 bg-panel/92 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-white">Editable Intent</h2>
          <p className="mt-1 text-xs text-slate-400">Review and correct the structured parse before the next agent step.</p>
        </div>
        {intent.action === "unsupported" && (
          <span className="rounded-md border border-warning/30 bg-warning/10 px-2 py-1 text-xs text-warning">unsupported</span>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <SelectField label="Action" value={intent.action} options={actions} onChange={(value) => update("action", value as DeFiAction)} />
        <TextField label="Amount" value={intent.amount ?? ""} onChange={(value) => update("amount", value || undefined)} />
        <TextField label="Token In" value={intent.tokenIn ?? ""} onChange={(value) => update("tokenIn", value ? value.toUpperCase() : undefined)} />
        <TextField label="Token Out" value={intent.tokenOut ?? ""} onChange={(value) => update("tokenOut", value ? value.toUpperCase() : undefined)} />
        <TextField label="Chain" value={intent.chain ?? ""} onChange={(value) => update("chain", value || undefined)} />
        <SelectField label="Priority" value={intent.priority} options={priorities} onChange={(value) => update("priority", value as DeFiPriority)} />
        <TextField
          label="Max Slippage"
          value={intent.constraints.maxSlippage ?? ""}
          onChange={(value) => updateConstraint("maxSlippage", value)}
        />
        <SelectField
          label="Risk Tolerance"
          value={intent.constraints.riskTolerance ?? ""}
          options={riskTolerances}
          emptyLabel="Not specified"
          onChange={(value) => updateConstraint("riskTolerance", value as RiskTolerance | "")}
        />
      </div>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs text-slate-400">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-white/10 bg-panel2 p-2.5 text-sm text-white outline-none focus:border-teal/60"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  emptyLabel,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  emptyLabel?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-xs text-slate-400">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-white/10 bg-panel2 p-2.5 text-sm text-white outline-none focus:border-teal/60"
      >
        {options.map((option) => (
          <option key={option || "empty"} value={option}>
            {option || emptyLabel || "None"}
          </option>
        ))}
      </select>
    </label>
  );
}
