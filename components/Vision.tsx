"use client";

import { useInView } from "react-intersection-observer";
import { Eye, Target, Heart } from "lucide-react";

const pillars = [
  { icon: Eye,    title: "Our Vision",  text: "To be a global leader in the branding industry, recognized for our creativity, strategic thinking, and commitment to excellence." },
  { icon: Target, title: "Our Mission", text: "To deliver innovative, result-driven branding solutions that transform businesses into iconic brands, making every customer feel WoW." },
  { icon: Heart,  title: "Our Values",  text: "Creativity, Integrity, Excellence, and a Client-First approach form the cornerstone of everything we do at JK Branding." },
];

export default function Vision() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      ref={ref}
      style={{ padding: "80px 0", background: "#fffbeb", borderTop: "1px solid rgba(232,180,0,0.15)", borderBottom: "1px solid rgba(232,180,0,0.15)" }}
    >
      <div className="site-wrap">
        <div style={{ display: "grid", gap: "32px" }} className="md:grid-cols-3">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              style={{
                textAlign: "center",
                padding: "40px 28px",
                borderRadius: "0",
                background: "#fff",
                border: "1px solid rgba(232,180,0,0.2)", opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`,
              }}
            >
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "50%", background: "#fef3c7", border: "2px solid rgba(232,180,0,0.3)", marginBottom: "20px" }}>
                <p.icon size={26} style={{ color: "#e8b400" }} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "12px" }}>{p.title}</h3>
              <p style={{ color: "#777", fontSize: "14px", lineHeight: 1.75, maxWidth: "280px", margin: "0 auto" }}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
