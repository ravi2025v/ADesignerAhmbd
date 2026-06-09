export type ServiceSlug = "graphic-designing";

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
];

export function getService(slug: string): ServiceMeta | undefined {
  return services.find(s => s.slug === slug);
}
