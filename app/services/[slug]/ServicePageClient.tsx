"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ServiceMeta } from "@/lib/services-data";

const A = "#f58220"; // accent orange

/* ── Shared hero ──────────────────────────────────────────────────── */
function ServiceHero({ service }: { service: ServiceMeta }) {
  return (
    <section style={{ position: "relative", height: "440px", display: "flex", alignItems: "flex-end", paddingBottom: "56px", overflow: "hidden" }}>
      <Image src={service.heroImage} alt={service.title} fill style={{ objectFit: "cover", objectPosition: "center 30%" }} priority unoptimized />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(11,60,93,0.88) 0%, rgba(245,130,32,0.82) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="site-wrap" style={{ position: "relative", zIndex: 10 }}>
        <div style={{ display: "inline-block", padding: "5px 14px", background: "rgba(245,130,32,0.25)", border: "1px solid rgba(245,130,32,0.5)", borderRadius: "999px", color: "#fff", fontSize: "12px", fontWeight: 600, marginBottom: "14px" }}>
          Our Services
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "12px" }}>
          {service.title}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", maxWidth: "540px", lineHeight: 1.6, marginBottom: "18px" }}>
          {service.tagline}
        </p>
        <nav style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }} className="hover:text-white">Home</Link>
          <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.4)" }} />
          <Link href="/#services" style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }} className="hover:text-white">Services</Link>
          <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.4)" }} />
          <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>{service.title}</span>
        </nav>
      </div>
    </section>
  );
}

/* ── Shared CTA ───────────────────────────────────────────────────── */
function ServiceCTA() {
  return (
    <section style={{ background: A, padding: "64px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(0,0,0,0.04) 30px,rgba(0,0,0,0.04) 31px)" }} />
      <div className="site-wrap" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, color: "#000", marginBottom: "12px" }}>
          Ready to Get Started?
        </h2>
        <p style={{ color: "rgba(0,0,0,0.6)", fontSize: "16px", marginBottom: "28px", maxWidth: "480px", margin: "0 auto 28px" }}>
          Let&apos;s discuss your project and create something extraordinary together.
        </p>
        <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 36px", background: "#000", color: "#fff", fontWeight: 700, borderRadius: "999px", fontSize: "15px", transition: "background 0.2s" }} className="hover:bg-[#1a1a1a]">
          Get a Free Quote <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   1. GRAPHIC DESIGNING — grid cards + process timeline
══════════════════════════════════════════════════════════════════ */
function GraphicDesigning() {
  const offerings = [
    { img: "https://images.unsplash.com/photo-1626785774573-4b799315345d", title: "Logo Design", desc: "A professional, well-designed logo is the crucial first step in establishing your brand — it creates the first impression of your company and expresses its values all in one." },
    { img: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740", title: "Stationery Design", desc: "Letterheads, envelopes, folders, business cards, invoices and more — well-executed stationery boosts your corporate identity and sets the tone from the very first touch." },
    { img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e", title: "Banner & Standee Design", desc: "One of the most popular ways to market today. Portable stands — fixed, X-style, expandable or retractable — work in any size for any placement and visibility." },
    { img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da", title: "Packaging & Label Design", desc: "The exterior wrap of your product and your first physical interaction with the public — packaging and labels that convey your brand's identity, quality and reputation." },
    { img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0", title: "Menu Design", desc: "Menus that express your eatery's personality, help customers understand your concept and promote profitability — key to any restaurant's marketing plan." },
    { img: "https://images.unsplash.com/photo-1481277542470-605612bd2d61", title: "Invitation Card Design", desc: "Beautifully crafted invitation cards for weddings, events and celebrations — designed to set the tone and make a memorable first impression." },
    { img: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b", title: "Tag Design", desc: "Custom tags that carry your brand — from price and care tags to gift and product tags — designed for clarity, character and a premium feel." },
    { img: "https://images.unsplash.com/photo-1542435503-956c469947f6", title: "Brochure Design", desc: "Brochures extend your customers' knowledge of your business — introducing your company and giving a snapshot of your products, services, features and contact information." },
  ];
  const steps = [
    { n: "01", title: "Discovery", desc: "We learn your brand, audience, and goals through an in-depth brief." },
    { n: "02", title: "Concept", desc: "Our designers develop 2–3 distinct creative directions for your review." },
    { n: "03", title: "Refinement", desc: "We refine the chosen concept based on your feedback — up to 3 revision rounds." },
    { n: "04", title: "Delivery", desc: "Final files delivered in all formats: print-ready, web, and social media sizes." },
  ];
  return (
    <>
      {/* Intro */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div className="site-wrap">
          <div style={{ display: "grid", gap: "60px", alignItems: "center" }} className="lg:grid-cols-2">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{ width: "32px", height: "2px", background: A }} />
                <span style={{ color: A, fontSize: "12px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>Creative Studio</span>
              </div>
              <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", fontWeight: 800, color: "#1a1a1a", marginBottom: "16px", lineHeight: 1.25 }}>
                Design that drives <span style={{ color: A }}>recognition</span> and results
              </h2>
              <p style={{ color: "#666", lineHeight: 1.8, marginBottom: "16px" }}>
                Great design is the foundation of every strong brand. Our team of senior graphic designers brings 17+ years of collective experience to every project — from brand-new identity systems to revitalising established brands.
              </p>
              <p style={{ color: "#666", lineHeight: 1.8, marginBottom: "28px" }}>
                We believe design should solve problems, not just look pretty. Every creative decision we make is intentional and aligned with your business objectives.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {["Brand Identity", "Logo Design", "Print", "Packaging", "Stationery", "Branding"].map(t => (
                  <span key={t} style={{ padding: "6px 14px", background: "#fff5eb", color: A, fontWeight: 600, fontSize: "12px", borderRadius: "999px", border: `1px solid ${A}33` }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[{ v: "500+", l: "Projects Delivered" }, { v: "17+", l: "Years of Expertise" }, { v: "100%", l: "Client Satisfaction" }, { v: "48h", l: "Avg First Draft" }].map(s => (
                <div key={s.l} style={{ padding: "28px 20px", border: "1px solid rgba(0,0,0,0.07)", textAlign: "center", background: "#fafafa" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 900, color: A }}>{s.v}</div>
                  <div style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Offerings grid */}
      <section style={{ padding: "80px 0", background: "#f8f9fb" }}>
        <div className="site-wrap">
          <h2 style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 800, color: "#1a1a1a", textAlign: "center", marginBottom: "48px" }}>
            What We <span style={{ color: A }}>Design</span>
          </h2>
          <div style={{ display: "grid", gap: "20px" }} className="sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map(o => (
              <div key={o.title} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color 0.2s, transform 0.2s" }} className="card-hover group">
                <div style={{ position: "relative", width: "100%", height: "190px", overflow: "hidden" }}>
                  <Image src={`${o.img}?w=640&q=70`} alt={o.title} fill unoptimized sizes="(max-width: 640px) 100vw, 380px" style={{ objectFit: "cover", transition: "transform 0.5s ease" }} className="group-hover:scale-110" />
                </div>
                <div style={{ padding: "24px 26px 28px" }}>
                  <h3 style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "16px", marginBottom: "8px" }} className="group-hover:text-[#f58220]">{o.title}</h3>
                  <p style={{ color: "#888", fontSize: "13.5px", lineHeight: 1.7 }}>{o.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div className="site-wrap">
          <h2 style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 800, color: "#1a1a1a", textAlign: "center", marginBottom: "56px" }}>
            Our <span style={{ color: A }}>Design Process</span>
          </h2>
          <div style={{ display: "grid", gap: "0", position: "relative" }} className="sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.n} style={{ padding: "32px 24px", position: "relative", borderTop: `3px solid ${i === 0 ? A : "#e5e7eb"}`, background: "#fff" }}>
                <div style={{ fontSize: "3rem", fontWeight: 900, color: i === 0 ? A : "#e5e7eb", lineHeight: 1, marginBottom: "12px" }}>{s.n}</div>
                <h3 style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "16px", marginBottom: "8px" }}>{s.title}</h3>
                <p style={{ color: "#888", fontSize: "13.5px", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Route → Layout map ───────────────────────────────────────── */
const LAYOUTS: Record<string, React.FC> = {
  "graphic-designing":           GraphicDesigning,
};

/* ── Page shell ───────────────────────────────────────────────── */
export default function ServicePageClient({ service }: { service: ServiceMeta }) {
  const Layout = LAYOUTS[service.slug];
  return (
    <>
      <Navbar />
      <ServiceHero service={service} />
      {Layout ? <Layout /> : null}
      <ServiceCTA />
      <Footer />
    </>
  );
}
