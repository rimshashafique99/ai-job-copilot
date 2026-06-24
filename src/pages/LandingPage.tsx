import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
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
      <Features />
      <CtaBanner />
    </main>
  );
}
