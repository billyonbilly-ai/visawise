import HomeNavbar from "@/components/ui/HomeNavbar";
import HeroSection from "@/components/sections/HeroSection";
import DemoSection from "@/components/sections/DemoSection";
import HowItWorks from "@/components/sections/HowItWorks";
import FAQ from "@/components/sections/FAQ";
import Mission from "@/components/sections/Mission";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div>
      <HomeNavbar />
      <HeroSection />
      <DemoSection />
      <HowItWorks />
      <FAQ />
      <Mission />
      <Footer />
    </div>
  );
}
