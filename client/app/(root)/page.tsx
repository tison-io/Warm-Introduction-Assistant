import { Metadata } from "next";
import Features from "../components/landing-page/Features";
import Footer from "../components/landing-page/Footer";
import Hero from "../components/landing-page/Hero";
import Workflow from "../components/landing-page/Workflow";


export const metadata: Metadata = {
  title: "Warmly Intro Assistant",
  description:
    "Generate tailored, high-quality warm introductions for investors with AI.",
  openGraph: {
    title: "Warmly Intro Assistant",
    description:
      "Generate personalized warm introductions automatically for your startup.",
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
      "Generate personalized warm introductions automatically for your startup.",
    images: [
      "https://warmly-intro-assistant.vercel.app/og-image.jpg",
    ],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
        <Hero />
        <Features />
        <Workflow />
        <Footer />
    </main>
  );
}
