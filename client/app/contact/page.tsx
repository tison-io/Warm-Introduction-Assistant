"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  Facebook,
  Instagram,
  Twitter,
  Loader2,
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
  { question: "How do I get startup profiles?", answer: "You copy the submission link usually found in the founder requests page and send that link to founders who want to be matched with investors so that they fill in their details." },
  { question: "How does the AI draft intros?", answer: "Our AI analyzes founder data i.e., startup blurb and matches it against your specific investor preference profiles to create personalized, warm outreach." },
  { question: "Is the double opt-in automated?", answer: "Yes. You send the consent requests mail, it gets delivered to both founder and investor, then the intro mail is delivered to both parties after approvals from the two parties." },
  { question: "Can I customize the intro styles?", answer: "Absolutely. You can set specific templates (email or 3-bullet lines) for each individual investor." },
];

const FAQItem: React.FC<{ 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void; 
}> = ({ question, answer, isOpen, onClick }) => {
  const Icon = isOpen ? ChevronUp : ChevronDown;

  return (
    <div className={`border transition-all duration-300 rounded-xl mb-3 overflow-hidden shadow-sm ${isOpen ? 'border-blue-500/40 bg-white/10' : 'border-white/10 bg-white/5 backdrop-blur-md'}`}>
      <button
        className="flex justify-between items-center w-full p-4 text-left text-white hover:bg-white/5 transition-colors"
        onClick={onClick}
        type="button"
      >
        <span className="flex items-center text-sm font-semibold">
          <span className={`mr-3 text-lg transition-colors ${isOpen ? 'text-white' : 'text-blue-400'}`}>?</span> 
          {question}
        </span>
        <Icon className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'text-white rotate-180' : 'text-blue-400'}`} />
      </button>
      
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="px-5 pb-4 text-slate-400 text-xs border-t border-white/5 bg-black/20">
          <p className="mt-3 leading-relaxed">{answer}</p>
        </div>
      </div>
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
  const [openIndex, setOpenIndex] = useState<number>(-1);

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
    <div className={`relative w-full flex flex-col items-center overflow-x-hidden 
      ${isSection ? "bg-transparent" : "min-h-screen bg-[#010204] pb-20"}`}
    >
      {!isSection && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <div 
            className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full"
            style={{
              background: 'rgba(37, 99, 235, 0.1)',
              filter: 'blur(140px)',
            }}
          />
          <div 
            className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full"
            style={{
              background: 'rgba(132, 86, 201, 0.12)',
              filter: 'blur(130px)',
            }}
          />
        </div>
      )}

      <main className={`mx-auto w-full grid lg:grid-cols-3 gap-10 items-stretch relative z-10 
        ${isSection ? "max-w-none p-0" : "max-w-7xl mt-16 px-8"}`}
      >
        <div className="lg:col-span-1 space-y-8 flex flex-col">
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Connect With Us</h3>
            <div className="space-y-6 text-slate-400 text-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
                </div>
                <div className="pt-1">
                    <p className="text-white font-medium">Global Support</p>
                    <p className="text-slate-500 text-xs font-light">Available for Enterprise COs</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                </div>
                <p className="pt-2 truncate">support@warmintro.ai</p>
              </div>

              <div className="flex space-x-4 pt-6 border-t border-white/5 text-slate-400">
                <Facebook className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                <Instagram className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                <Twitter className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>
          </div>

          <div className="grow">
            <h2 className="text-lg font-bold text-white mb-5 px-2 tracking-tight">Frequently Asked</h2>
            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {faqData.map((item, index) => (
                <FAQItem 
                  key={index} 
                  question={item.question} 
                  answer={item.answer} 
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className={`${isSection ? "bg-transparent border-none p-0" : "bg-slate-900/20 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl"} h-full`}>
            <h3 className="text-3xl font-bold text-white mb-2 tracking-tighter">Let’s scale your community.</h3>
            <p className="text-slate-500 mb-10 font-light text-lg">Send us a message and our team will get back to you shortly.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-400 font-medium text-[10px] uppercase tracking-[0.2em] mb-3 px-1">Full name*</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="bg-white/5 border border-white/10 rounded-2xl w-full p-4 text-white placeholder-slate-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium text-[10px] uppercase tracking-[0.2em] mb-3 px-1">Email address*</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="johndoe@example.com"
                      className="bg-white/5 border border-white/10 rounded-2xl w-full p-4 text-white placeholder-slate-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      required
                    />
                  </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium text-[10px] uppercase tracking-[0.2em] mb-3 px-1">How can we help?*</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell us about your community needs..."
                  className="bg-white/5 border border-white/10 rounded-2xl w-full p-4 text-white placeholder-slate-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-lg disabled:opacity-50"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}