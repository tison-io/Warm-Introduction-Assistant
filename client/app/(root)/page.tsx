import { Metadata } from "next";
import Hero from "../components/landing-page/Hero";
import Features from "../components/landing-page/Features";
import Workflow from "../components/landing-page/Workflows"; 
import CTASection from "../components/landing-page/CTA";
import Footer from "../components/landing-page/Footer";


export const metadata: Metadata = {
  title: "Warmly Intro Assistant",
  description:
    "The connector tool for community owners. Generate AI-crafted warm introductions for your investor network.",
  openGraph: {
    title: "Warmly Intro Assistant",
    description:
      "Automate founder-investor introductions for your community with AI.",
    url: "https://warmly-intro-assistant.vercel.app",
    siteName: "Warmly Intro Assistant",
    images: [
      {
        url: "https://warmly-intro-assistant.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Warmly Intro Assistant - AI for investor introductions",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Warmly Intro Assistant",
    description:
      "Automate founder-investor introductions for your community with AI.",
    images: [
      "https://warmly-intro-assistant.vercel.app/og-image.jpg",
    ],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#010204]">
        {/* 1. Main Hook */}
        <Hero />
        
        {/* 2. Grid of features */}
        <section id="features">
          <Features />
        </section>

        {/* 3. Step-by-step process (The new section from your images) */}
        <Workflow />

        {/* 4. Final call to action */}
        <CTASection />
        
        {/* 5. Site footer */}
        <Footer />
    </main>
  );
}