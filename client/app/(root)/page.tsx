import { Metadata } from "next";
import Hero from "../components/landing-page/Hero";
import Features from "../components/landing-page/Features";
import Workflow from "../components/landing-page/Workflows"; 
import CTASection from "../components/landing-page/CTA";
import Footer from "../components/landing-page/Footer";


export const metadata: Metadata = {
  metadataBase: new URL("https://warmly-intro-assistant.vercel.app"),
  title: "Warmly Intro Assistant",
  description: "The connector tool for community owners. Generate AI-crafted warm introductions for your investor network.",
  verification: {
    google: "omVhXD5rWFuxIqh7lY5rNhE9Xi3-nz5ZPWT5f1F0uZo",
  },
  openGraph: {
    title: "Warmly Intro Assistant",
    description:
      "Reduce time spent on making manual introductions to investors.",
    url: "https://warmly-intro-assistant.vercel.app",
    siteName: "Warmly Intro Assistant",
    images: [
      {
        url: "https://warmly-intro-assistant.vercel.app/og-image.png",
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
      "https://warmly-intro-assistant.vercel.app/og-image.png",
    ],
  },
  alternates: {
    canonical: "https://warmly-intro-assistant.vercel.app",
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Warmly Intro Assistant",
    "operatingSystem": "WEB",
    "applicationCategory": "BusinessApplication",
    "description": "Generate AI-crafted warm introductions for your investor network.",
  };

  return (
    <main className="min-h-screen bg-[#010204]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Hero />
        <section id="features">
          <Features />
        </section>
        <Workflow />
        <CTASection />
        <Footer />
    </main>
  );
}