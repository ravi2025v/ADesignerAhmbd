import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import SplashCursor from "@/components/SplashCursor";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Brandingo | Build Your Brand's Journey",
  description:
    "Brandingo - expert graphic design services: logo, stationery, banner & standee, packaging & label, menu, invitation card, tag, and brochure design.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body suppressHydrationWarning>
        <SplashCursor
          DENSITY_DISSIPATION={10}
          VELOCITY_DISSIPATION={2.5}
          PRESSURE={0.35}
          CURL={45}
          SPLAT_RADIUS={0.57}
          SPLAT_FORCE={4000}
          SHADING={true}
          RAINBOW_MODE={false}
          COLOR="#004563"
        />
        {children}
      </body>
    </html>
  );
}
