"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { ContactFormData } from "../types/contacts";
import { sendContactForm } from "../lib/submissions_api";
import { useToast } from "../components/Toast";

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  message: "",
};

const faqData = [
  { question: "What am I agreeing to?", answer: "By creating an account, you agree to our Terms of Service and Privacy Policy." },
  { question: "Why do I need to accept the Terms?", answer: "Accepting the Terms ensures both parties understand responsibilities." },
  { question: "How is my personal data used?", answer: "Your personal data is used to personalize your experience. We never sell data." },
  { question: "Can I delete my account later?", answer: "Yes. You can delete your account and all associated data anytime in settings." },
];

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = isOpen ? ChevronUp : ChevronDown;

  return (
    <div className="border border-white/10 bg-black/40 rounded-lg mb-2 overflow-hidden transition-all shadow-sm">
      <button
        className="flex justify-between items-center w-full p-3 text-left text-white hover:bg-white/5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center text-sm font-semibold">
          <span className="mr-2 text-blue-400 text-base">?</span> {question}
        </span>
        <Icon className="w-4 h-4 text-blue-400" />
      </button>
      {isOpen && (
        <div className="px-4 pb-3 text-slate-300 text-xs border-t border-white/5 bg-black/40">
          <p className="mt-2 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

interface ContactPageProps {
  isSection?: boolean;
}

export default function ContactPage({ isSection = false }: ContactPageProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState<ContactFormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await sendContactForm(form);
      if (response?.success || response?.message) {
        showToast("Message sent successfully!", "success");
        setForm(initialFormData);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full flex flex-col items-center pb-20 overflow-x-hidden 
      ${isSection ? "" : "min-h-screen bg-linear-to-r from-blue-900 via-slate-800 to-gray-950"}`}
    >
      <main className="max-w-7xl mx-auto w-[92vw] mt-10 grid lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          {/* Darkened Info Card */}
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Get In Touch</h3>
            <div className="space-y-4 text-slate-300 text-sm">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
                <p>22 Kenyatta Avenue, Addis Ababa, Ethiopia</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                <p>+1 111 111 1111</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                <p className="truncate">warmly@gmail.com</p>
              </div>
              <div className="flex space-x-4 pt-4 border-t border-white/10 text-white">
                <Facebook className="w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
                <Instagram className="w-5 h-5 cursor-pointer hover:text-pink-400 transition-colors" />
                <Twitter className="w-5 h-5 cursor-pointer hover:text-blue-300 transition-colors" />
              </div>
            </div>
          </div>

          {/* Darkened FAQ Area */}
          <div className="grow">
            <h2 className="text-lg font-bold text-white mb-4 px-2 tracking-tight">Common Questions</h2>
            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {faqData.map((item, index) => (
                <FAQItem key={index} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Darkened Form */}
        <div className="lg:col-span-2">
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl h-full">
            <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">Have Questions?</h3>
            <p className="text-slate-400 mb-8 font-light">We'd love to hear from you. Send us a message below.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-slate-300 font-medium text-xs uppercase tracking-widest mb-2 px-1">Full name*</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="bg-black/40 border border-white/10 rounded-xl w-full p-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium text-xs uppercase tracking-widest mb-2 px-1">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="johndoe@example.com"
                  className="bg-black/40 border border-white/10 rounded-xl w-full p-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium text-xs uppercase tracking-widest mb-2 px-1">Message*</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us about your needs..."
                  className="bg-black/40 border border-white/10 rounded-xl w-full p-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}