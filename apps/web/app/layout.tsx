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
                <nav className="flex items-center gap-1 text-sm text-white/50">
                  <Link className="hidden rounded-md px-3 py-2 hover:text-white md:inline-flex" href="/#how-it-works">How it works</Link>
                  <Link className="hidden rounded-md px-3 py-2 hover:text-white md:inline-flex" href="/#analysis">Analysis</Link>
                  <Link className="hidden rounded-md px-3 py-2 hover:text-white md:inline-flex" href="/reports">Reports</Link>
                  <Link className="ml-2 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-cyan-50 sm:px-5" href="/app">Open app</Link>
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
