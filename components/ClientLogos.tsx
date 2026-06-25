"use client";

import { motion } from "framer-motion";
import { brandLogos } from "./brandLogosData";

const track = [...brandLogos, ...brandLogos, ...brandLogos];

export default function ClientLogos() {
  return (
    <section
      style={{
        background: "#f8f8f8",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "40px 0",
        overflow: "hidden",
      }}
    >
      <p
        style={{
          textAlign: "center",
          color: "#aaa",
          fontSize: "11px",
          letterSpacing: "5px",
          textTransform: "uppercase",
          marginBottom: "28px",
          fontWeight: 600,
        }}
      >
        Trusted By Leading Brands
      </p>

      <div style={{ overflow: "hidden", position: "relative" }}>
        {/* Fade edges */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "100px", background: "linear-gradient(to right, #f8f8f8, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "100px", background: "linear-gradient(to left, #f8f8f8, transparent)", zIndex: 2, pointerEvents: "none" }} />

        <motion.div
          style={{ display: "flex", gap: "80px", width: "max-content", alignItems: "center", paddingRight: "80px" }}
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{
            ease: "linear",
            duration: 85,
            repeat: Infinity,
          }}
        >
          {track.map((logo, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                height: "50px",
                width: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.3s ease",
              }}
              className="hover:scale-105 cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={encodeURI(logo.src)}
                alt={logo.alt}
                style={{
                  maxHeight: "45px",
                  maxWidth: "130px",
                  objectFit: "contain",
                  transition: "all 0.3s ease",
                  ...logo.style,
                }}
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
