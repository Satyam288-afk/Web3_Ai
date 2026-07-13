import type { Metadata } from "next";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/site-header";
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
            <SiteHeader />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
