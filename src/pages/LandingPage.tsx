import Hero from "../components/sections/Hero";
// import LogoCloud from "../components/sections/LogoCloud";
import HowItWorks from "../components/sections/HowItWorks";
import Features from "../components/sections/Features";
import Stats from "../components/sections/Stats";
import Testimonials from "../components/sections/Testimonials";
import Faq from "../components/sections/Faq";
import CtaBanner from "../components/sections/CtaBanner";

/**
 * LandingPage
 *
 * Root landing page — assembles all marketing sections in order.
 * Navbar and Footer are rendered by the parent layout (PublicLayout),
 * so they're not repeated here.
 */
export default function LandingPage() {
  return (
    <main>
      <Hero />
      {/* <LogoCloud /> */}
      <HowItWorks />
      <Features />
      <Stats />
      <Testimonials />
      <Faq />
      <CtaBanner />
    </main>
  );
}
