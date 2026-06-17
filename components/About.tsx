"use client";

import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { CheckCircle2, Eye, Target, Heart } from "lucide-react";

const highlights = [
  "A Decade of Excellence: 10 years of proven experience in design, print, and brand strategy.",
  "Founded on Trust: Led by the Patel & Sharma brothers with a dedicated team of creatives.",
  'The "WoW" Factor: Driven by a singular mission to exceed client expectations every single time.',
  "Strategic & Result-Driven: We don't just design logos; we build legal, trademark-ready brand identities that drive business growth.",
];

export default function About({ showValues = true }: { showValues?: boolean }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      id="about"
      ref={ref}
      style={{ padding: "100px 0", background: "#f9fafb", position: "relative", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-120px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(11,60,93,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* --- GEOMETRIC / TRIGONOMETRIC BACKGROUND --- */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {/* Repeating Triangular Grid Pattern (Isometric Mesh) */}
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='103.92' viewBox='0 0 60 103.92' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230b3c5d' stroke-width='0.5' stroke-opacity='0.08'%3E%3Cpath d='M0 103.92L60 0M60 103.92L0 0M0 51.96h60'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 103.92px",
          opacity: 1
        }} />
        
        {/* Floating Abstract Trigonometric Shapes */}
        <svg style={{ position: "absolute", top: "5%", left: "-2%", width: "350px", height: "350px", opacity: 0.15, transform: "rotate(15deg)" }} viewBox="0 0 100 100">
          <polygon points="50,5 95,80 5,80" fill="none" stroke="#f58220" strokeWidth="1.5" />
          <circle cx="50" cy="55" r="25" fill="none" stroke="#0b3c5d" strokeWidth="0.5" />
          <line x1="50" y1="5" x2="50" y2="80" stroke="#f58220" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>
        <svg style={{ position: "absolute", bottom: "-5%", right: "-2%", width: "450px", height: "450px", opacity: 0.08, transform: "rotate(-10deg)" }} viewBox="0 0 100 100">
          <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="#0b3c5d" strokeWidth="1" />
          <polygon points="50,5 95,75 5,75" fill="none" stroke="#f58220" strokeWidth="0.5" />
          <polygon points="50,95 95,25 5,25" fill="none" stroke="#f58220" strokeWidth="0.5" />
        </svg>
        <svg style={{ position: "absolute", top: "35%", left: "45%", width: "180px", height: "180px", opacity: 0.15, transform: "rotate(45deg)" }} viewBox="0 0 100 100">
          <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="#f58220" strokeWidth="1.5" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="#0b3c5d" strokeWidth="0.5" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="#0b3c5d" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="site-wrap" style={{ position: "relative", zIndex: 10 }}>
        {/* ── Desktop layout: image left, text right ── */}
        <div className="hidden lg:grid grid-cols-2 gap-16 items-center">
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(-40px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "-12px",
                  right: "12px",
                  bottom: "12px",
                  borderRadius: "0",
                  border: "2px solid rgba(245,130,32,0.3)",
                }}
              />
              <div
                style={{
                  borderRadius: "0",
                  overflow: "hidden",
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.07)",
                  position: "relative",
                  width: "100%",
                  height: "380px",
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80"
                  alt="The Brandingo team collaborating"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  right: "-20px",
                  background: "#f58220",
                  borderRadius: "0",
                  padding: "18px 22px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>10+</div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#fff",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginTop: "2px",
                  }}
                >
                  Years Experience
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(40px)",
              transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "32px", height: "2px", background: "#f58220" }} />
              <span style={{ color: "#f58220", fontSize: "12px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>
                Who We Are
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "#1a1a1a", lineHeight: 1.2, marginBottom: "20px" }}>
              Crafting Your Vision, <span style={{ color: "#f58220" }}>Building Your Success</span>
            </h2>
            <p style={{ color: "#555", fontSize: "1rem", lineHeight: 1.8, marginBottom: "16px" }}>
              Established in 2016, Brandingo was built on a foundation of over a decade of expertise in Designing, Printing, and Brand Development. Founded by the Patel &amp; Sharma brothers, we bring a unique blend of global vision and local expertise to help transform emerging businesses into unforgettable brands.
            </p>
            <p style={{ color: "#777", lineHeight: 1.8, marginBottom: "28px", fontSize: "0.95rem" }}>
              Our objective is simple yet powerful: to make every customer feel &quot;WoW.&quot; By blending
              strategic thinking with flawless creative execution, we deliver result-driven branding
              solutions that truly resonate with your audience and elevate your market presence.
            </p>
            <div style={{ marginBottom: "18px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#1a1a1a" }}>Why Choose Us?</h3>
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "36px" }}>
              {highlights.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <CheckCircle2 size={17} style={{ color: "#f58220", flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ color: "#555", fontSize: "14px", lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Mobile / tablet layout: centered intro, photo + text row, centered why-choose ── */}
        <div
          className="lg:hidden"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          {/* Eyebrow — centered */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "14px" }}>
            <div style={{ width: "28px", height: "2px", background: "#f58220" }} />
            <span style={{ color: "#f58220", fontSize: "12px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>
              Who We Are
            </span>
            <div style={{ width: "28px", height: "2px", background: "#f58220" }} />
          </div>

          {/* Heading — centered */}
          <h2 style={{ fontSize: "clamp(1.4rem, 6vw, 2rem)", fontWeight: 800, color: "#1a1a1a", lineHeight: 1.25, marginBottom: "16px", textAlign: "center" }}>
            Crafting Your Vision, <span style={{ color: "#f58220" }}>Building Your Success</span>
          </h2>

          {/* Intro paragraphs — full width, centered */}
          <p style={{ color: "#555", fontSize: "14px", lineHeight: 1.8, marginBottom: "16px", textAlign: "center" }}>
            Established in 2016, Brandingo was built on a foundation of over a decade of expertise in Designing, Printing, and Brand Development. Founded by the Patel &amp; Sharma brothers, we bring a unique blend of global vision and local expertise to help transform emerging businesses into unforgettable brands.
          </p>
          <p style={{ color: "#777", fontSize: "13.5px", lineHeight: 1.8, marginBottom: "32px", textAlign: "center" }}>
            Our objective is simple yet powerful: to make every customer feel &quot;WoW.&quot; By blending strategic thinking with flawless creative execution, we deliver result-driven branding solutions that truly resonate with your audience and elevate your market presence.
          </p>

          {/* Photo — full width, below the paragraphs */}
          <div style={{ position: "relative", width: "100%", height: "240px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.07)", marginBottom: "36px" }}>
            <Image
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80"
              alt="The Brandingo team collaborating"
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, background: "#f58220", padding: "10px 16px", textAlign: "center" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>10+</div>
              <div style={{ fontSize: "9px", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>Years Experience</div>
            </div>
          </div>

          {/* Why Choose Us — centered */}
          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1a1a1a", textAlign: "center", marginBottom: "16px" }}>Why Choose Us?</h3>
          <ul style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "440px", margin: "0 auto" }}>
            {highlights.map((item) => (
              <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <CheckCircle2 size={15} style={{ color: "#f58220", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ color: "#555", fontSize: "13px", lineHeight: 1.6 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showValues && (
      <div className="site-wrap" style={{ marginTop: "100px" }}>
        <div
          style={{
            display: "grid",
            gap: "30px",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
          }}
          className="grid-cols-1 md:grid-cols-3"
        >
          {/* Vision */}
          <div
            style={{
              background: "#fff",
              padding: "40px 30px",
              borderRadius: "0",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "rgba(245,130,32,0.05)",
                border: "1px solid rgba(245,130,32,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <Eye size={28} color="#f58220" strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a1a1a", marginBottom: "16px" }}>
              Our Vision
            </h3>
            <p style={{ color: "#555", fontSize: "0.95rem", lineHeight: 1.7 }}>
              To be a global leader in the branding industry, recognized for our creativity,
              strategic thinking, and commitment to excellence.
            </p>
          </div>

          {/* Mission */}
          <div
            style={{
              background: "#fff",
              padding: "40px 30px",
              borderRadius: "0",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "rgba(245,130,32,0.05)",
                border: "1px solid rgba(245,130,32,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <Target size={28} color="#f58220" strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a1a1a", marginBottom: "16px" }}>
              Our Mission
            </h3>
            <p style={{ color: "#555", fontSize: "0.95rem", lineHeight: 1.7 }}>
              To deliver innovative, result-driven branding solutions that transform businesses into
              iconic brands, making every customer feel WoW.
            </p>
          </div>

          {/* Values */}
          <div
            style={{
              background: "#fff",
              padding: "40px 30px",
              borderRadius: "0",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "rgba(245,130,32,0.05)",
                border: "1px solid rgba(245,130,32,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <Heart size={28} color="#f58220" strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a1a1a", marginBottom: "16px" }}>
              Our Values
            </h3>
            <p style={{ color: "#555", fontSize: "0.95rem", lineHeight: 1.7 }}>
              Creativity, Integrity, Excellence, and a Client-First approach form the cornerstone
              of everything we do at Brandingo.
            </p>
          </div>
        </div>
      </div>
      )}
    </section>
  );
}
