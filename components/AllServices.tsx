"use client";

import Image from "next/image";
import { useInView } from "react-intersection-observer";

const services = [
  { img: "https://images.unsplash.com/photo-1626785774573-4b799315345d", title: "Logo Design", desc: "A professional, well-designed logo is the crucial first step in establishing your brand — it creates the first impression of your company and expresses its values all in one." },
  { img: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740", title: "Stationery Design", desc: "Letterheads, envelopes, folders, business cards, invoices and more — well-executed stationery boosts your corporate identity and sets the tone from the very first touch." },
  { img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e", title: "Banner & Standee Design", desc: "One of the most popular ways to market today. Portable stands — fixed, X-style, expandable or retractable — work in any size for any placement and visibility." },
  { img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da", title: "Packaging & Label Design", desc: "The exterior wrap of your product and your first physical interaction with the public — packaging and labels that convey your brand's identity, quality and reputation." },
  { img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0", title: "Menu Design", desc: "Menus that express your eatery's personality, help customers understand your concept and promote profitability — key to any restaurant's marketing plan." },
  { img: "https://images.unsplash.com/photo-1481277542470-605612bd2d61", title: "Invitation Card Design", desc: "Beautifully crafted invitation cards for weddings, events and celebrations — designed to set the tone and make a memorable first impression." },
  { img: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b", title: "Tag Design", desc: "Custom tags that carry your brand — from price and care tags to gift and product tags — designed for clarity, character and a premium feel." },
  { img: "https://images.unsplash.com/photo-1542435503-956c469947f6", title: "Brochure Design", desc: "Brochures extend your customers' knowledge of your business — introducing your company and giving a snapshot of your products, services, features and contact information." },
];

export default function AllServices() {
  const { ref, inView } = useInView({ threshold: 0.04, triggerOnce: true });

  return (
    <section ref={ref} style={{ padding: "100px 0", background: "#ffffff", position: "relative", overflow: "hidden" }}>
      <div className="site-wrap">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "14px" }}>
            <div style={{ width: "32px", height: "2px", background: "#f58220" }} />
            <span style={{ color: "#f58220", fontSize: "12px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>What We Do</span>
            <div style={{ width: "32px", height: "2px", background: "#f58220" }} />
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "#1a1a1a", marginBottom: "14px" }}>
            Our <span style={{ color: "#f58220" }}>Services</span>
          </h2>
          <p style={{ color: "#777", maxWidth: "560px", margin: "0 auto", lineHeight: 1.75 }}>
            Comprehensive design solutions tailored to bring your brand to life — pick what your business needs.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gap: "20px" }} className="sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={s.title}
              style={{
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.07)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.6s ease ${(i % 3) * 0.08 + Math.floor(i / 3) * 0.06}s, transform 0.6s ease ${(i % 3) * 0.08 + Math.floor(i / 3) * 0.06}s`,
              }}
              className="card-hover group"
            >
              <div style={{ position: "relative", width: "100%", height: "190px", overflow: "hidden" }}>
                <Image src={`${s.img}?w=640&q=70`} alt={s.title} fill unoptimized sizes="(max-width: 640px) 100vw, 380px" style={{ objectFit: "cover", transition: "transform 0.5s ease" }} className="group-hover:scale-110" />
              </div>
              <div style={{ padding: "24px 26px 28px" }}>
                <h3 style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "16px", marginBottom: "8px" }} className="group-hover:text-[#f58220]">{s.title}</h3>
                <p style={{ color: "#888", fontSize: "13.5px", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
