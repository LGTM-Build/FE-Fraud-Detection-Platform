import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";

export default function HomePage() {
  return (
    <>
      <div className="bg-grid" />
      <div className="blob blob1" />
      <div className="blob blob2" />
      <div className="blob blob3" />
      <Navbar />
      <main style={{ position: "relative", zIndex: 1 }}>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </>
  );
}
 