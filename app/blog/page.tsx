import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog | Brandingo India Pvt. Ltd.",
  description: "Insights, tips and trends on branding, digital marketing, design and more from the Brandingo team.",
};

export default function BlogPage() {
  return <BlogClient />;
}
