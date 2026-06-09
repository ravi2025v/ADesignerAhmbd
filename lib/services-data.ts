export type ServiceSlug =
  | "graphic-designing"
  | "website-development"
  | "search-engine-optimization"
  | "digital-marketing";

export interface ServiceMeta {
  slug: ServiceSlug;
  title: string;
  tagline: string;
  description: string;
  heroImage: string;
  icon: string;
}

export const services: ServiceMeta[] = [
  {
    slug: "graphic-designing",
    title: "Graphic Designing",
    tagline: "Visuals that speak louder than words.",
    description: "We craft stunning visual identities — logos, brochures, social media creatives and more — that make your brand unforgettable.",
    heroImage: "https://jkbrandingindia.com/wp-content/uploads/2024/10/Team-8.jpg",
    icon: "✏️",
  },
  {
    slug: "website-development",
    title: "Website Development",
    tagline: "Websites that turn visitors into customers.",
    description: "Fast, responsive, SEO-ready websites — from business sites and landing pages to full e-commerce stores — built to grow your brand online.",
    heroImage: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1600&q=70",
    icon: "💻",
  },
  {
    slug: "search-engine-optimization",
    title: "Search Engine Optimization",
    tagline: "Rank higher. Get found. Grow organically.",
    description: "Data-driven SEO that lifts your rankings, drives qualified traffic and keeps your brand on the first page where customers are searching.",
    heroImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1600&q=70",
    icon: "📈",
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    tagline: "Reach the right audience at the right time.",
    description: "Full-funnel digital marketing — social media, paid ads, content and email — that builds awareness, engagement and measurable growth.",
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=70",
    icon: "🚀",
  },
];

export function getService(slug: string): ServiceMeta | undefined {
  return services.find(s => s.slug === slug);
}
