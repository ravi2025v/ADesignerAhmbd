import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import SplashCursor from "@/components/SplashCursor";
import ImageProtection from "@/components/ImageProtection";
import "./globals.css";
import { cn } from "@/lib/utils";
import Script from "next/script";

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
        <ImageProtection />
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1988248838720405');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1988248838720405&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
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
