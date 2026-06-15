import { ReportsList } from "@/components/reports-list";

export default function ReportsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Report History</h1>
        <p className="mt-2 text-sm text-slate-400">Saved SentinelMesh reports with risk score, route recommendation, and verification state.</p>
      </div>
      <ReportsList />
    </main>
  );
}
