import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SentinelMesh",
  description: "Multi-agent DeFi risk copilot with verifiable report registry"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <div className="min-h-screen mesh-grid">
            <header className="sticky top-0 z-30 border-b border-white/10 bg-background/82 backdrop-blur">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-teal/30 bg-teal/10 text-teal">
                    <ShieldCheck size={19} />
                  </span>
                  SentinelMesh
                </Link>
                <nav className="flex items-center gap-1 text-sm text-slate-300">
                  <Link className="rounded-md px-3 py-2 hover:bg-white/8 hover:text-white" href="/app">
                    App
                  </Link>
                  <Link className="rounded-md px-3 py-2 hover:bg-white/8 hover:text-white" href="/reports">
                    Reports
                  </Link>
                  <Link className="rounded-md px-3 py-2 hover:bg-white/8 hover:text-white" href="/settings">
                    Settings
                  </Link>
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
