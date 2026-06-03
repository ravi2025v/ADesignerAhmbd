"use client";

const logos = [
  { src: "https://jkbrandingindia.com/wp-content/uploads/2024/10/Vector-Smart-Object2-02-300x79.png", alt: "Client 1" },
  { src: "https://jkbrandingindia.com/wp-content/uploads/2024/10/Vector-Smart-Object2-03-300x79.png", alt: "Client 2" },
  { src: "https://jkbrandingindia.com/wp-content/uploads/2024/10/Vector-Smart-Object2-04-300x79.png", alt: "Client 3" },
  { src: "https://jkbrandingindia.com/wp-content/uploads/2024/10/Vector-Smart-Object2-05-300x79.png", alt: "Client 4" },
  { src: "https://jkbrandingindia.com/wp-content/uploads/2024/10/Vector-Smart-Object2-06-300x79.png", alt: "Client 5" },
  { src: "https://jkbrandingindia.com/wp-content/uploads/2024/10/Vector-Smart-Object2-07-300x79.png", alt: "Client 6" },
  { src: "https://jkbrandingindia.com/wp-content/uploads/2024/10/Vector-Smart-Object2-08-300x79.png", alt: "Client 7" },
];

const track = [...logos, ...logos, ...logos];

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

        <div
          className="animate-marquee"
          style={{ display: "flex", gap: "60px", width: "max-content", alignItems: "center" }}
        >
          {track.map((logo, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                height: "36px",
                width: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.45,
                transition: "opacity 0.3s",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.alt}
                style={{ maxHeight: "34px", maxWidth: "110px", objectFit: "contain" }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
