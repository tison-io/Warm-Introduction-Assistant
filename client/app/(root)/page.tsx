import Features from "../components/landing-page/Features";
import Footer from "../components/landing-page/Footer";
import Hero from "../components/landing-page/Hero";
import Workflow from "../components/landing-page/Workflow";


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
