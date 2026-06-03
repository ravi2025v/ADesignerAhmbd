import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | JK Branding India Pvt. Ltd.",
  description: "Get in touch with JK Branding India. Reach us at our Rajkot, Jamnagar, or Ahmedabad offices.",
};

export default function ContactPage() {
  return <ContactClient />;
}
