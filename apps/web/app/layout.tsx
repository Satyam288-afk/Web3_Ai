import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SentinelMesh",
  description: "AI transaction firewall for DeFi users and autonomous agents"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen mesh-grid">
            <header className="sticky top-0 z-30 bg-black px-3 py-3 text-white">
              <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black px-4 py-2 sm:px-6">
                <Link href="/" className="flex items-center gap-2.5 text-sm font-bold text-white">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#6956ff]/25 bg-[#5136f5]/12 text-[#9baaff] shadow-[0_0_20px_rgba(81,54,245,0.16)]">
                    <ShieldCheck size={19} />
                  </span>
                  <span>SentinelMesh</span>
                  <span className="hidden rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-semibold text-white/45 sm:inline">TESTNET</span>
                </Link>
                <nav aria-label="Primary navigation" className="flex items-center gap-0.5 text-xs text-white/55 sm:gap-1 sm:text-sm">
                  <Link className="rounded-full px-2.5 py-2 transition hover:bg-white/[0.06] hover:text-white sm:px-3" href="/#how-it-works">How it works</Link>
                  <Link className="rounded-full px-2.5 py-2 transition hover:bg-white/[0.06] hover:text-white sm:px-3" href="/#analysis">Analysis</Link>
                  <Link className="rounded-full px-2.5 py-2 transition hover:bg-white/[0.06] hover:text-white sm:px-3" href="/reports">Reports</Link>
                </nav>
              </div>
            </header>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
