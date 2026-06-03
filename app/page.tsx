import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ClientLogos from "@/components/ClientLogos";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import WhyChooseUs from "@/components/WhyChooseUs";
import Vision from "@/components/Vision";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ClientLogos />
      <Stats />
      <About />
      <Services />
      <Portfolio />
      <WhyChooseUs />
      <Vision />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
