"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/format";

const navItems = [
  { label: "How it works", href: "/#how-it-works", active: (pathname: string) => pathname === "/" },
  { label: "Analysis", href: "/app", active: (pathname: string) => pathname === "/app" },
  { label: "Reports", href: "/reports", active: (pathname: string) => pathname.startsWith("/reports") }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[#536180]/25 bg-[#050914]/95 px-3 py-3 text-white shadow-[0_12px_38px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[26px] border border-[#566481]/45 bg-[linear-gradient(110deg,rgba(12,19,35,0.96),rgba(10,16,29,0.88))] px-4 py-2.5 shadow-[inset_0_1px_0_rgba(187,203,255,0.06),0_14px_34px_rgba(0,0,0,0.2)] sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-7">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 text-sm font-bold text-white sm:text-base">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7665ff]/55 bg-[#1a1b42] text-[#aeb9ff] shadow-[0_0_22px_rgba(89,79,255,0.4),inset_0_1px_8px_rgba(140,133,255,0.16)]">
              <ShieldCheck size={21} />
            </span>
            <span>SentinelMesh</span>
          </Link>

          <div className="hidden items-center gap-2 rounded-xl border border-[#66738e]/25 bg-black/15 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 md:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-[#635bff] shadow-[0_0_12px_#635bff]" />
            Base Sepolia
            <ChevronDown size={15} className="ml-1 text-white/45" />
          </div>
        </div>

        <nav aria-label="Primary navigation" className="flex items-center gap-0.5 text-xs font-semibold text-white/55 sm:gap-1 sm:text-sm">
          {navItems.map((item) => {
            const isActive = item.active(pathname);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative rounded-xl px-2.5 py-2.5 transition sm:px-4",
                  "after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-[#8b72ff] after:shadow-[0_0_10px_#7658ff] after:transition-all",
                  isActive
                    ? "bg-[linear-gradient(180deg,rgba(102,84,255,0.16),rgba(47,35,112,0.16))] text-[#b8aaff] after:w-3/5"
                    : "hover:bg-white/[0.045] hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
