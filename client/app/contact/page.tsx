"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Users,
  BarChart3,
  CheckCircle,
  Facebook,
  Instagram,
  X,
  Twitter,
} from "lucide-react";
import { ContactFormData } from "../types/contacts";

const sendContactForm = async (data: ContactFormData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true };
};

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  message: "",
};

// FAQ content
const faqData = [
  {
    question: "What am I agreeing to?",
    answer:
      "By creating an account, you agree to our Terms of Service and Privacy Policy.",
  },
  {
    question: "Why do I need to accept the Terms?",
    answer:
      "Accepting the Terms ensures both parties understand responsibilities when using the Warmly platform.",
  },
  {
    question: "How is my personal data used?",
    answer:
      "Your personal data is used to personalize your experience and provide support. We never sell data.",
  },
  {
    question: "Can I delete my account later?",
    answer:
      "Yes. You can delete your account and all associated data anytime in settings.",
  },
];

// FAQ UI
const FAQItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = isOpen ? ChevronUp : ChevronDown;

  return (
    <div className="border border-gray-700/40 bg-white rounded-lg mb-1 overflow-hidden">
      <button
        className="flex justify-between items-center w-full p-2 text-left text-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center text-sm font-semibold">
          <span className="mr-2 text-indigo-400 text-base">?</span> {question}
        </span>
        <Icon className="w-4 h-4 text-indigo-400" />
      </button>

      {isOpen && (
        <div className="px-2 pb-2 text-black text-xs border-t border-gray-700/40">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default function ContactPage() {
  const router = useRouter();
  const [form, setForm] = useState<ContactFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const BACKGROUND_IMAGE_PATH = "/background-img.jpg";

  // FIXED handleChange
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Send to backend
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      await sendContactForm(form);

      setSuccess("Message sent successfully!");
      setForm(initialFormData);

      setTimeout(() => setSuccess(null), 7000);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Oops! Something went wrong. Please try again later.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url('${BACKGROUND_IMAGE_PATH}')` }}
    >
      {/* Top Section */}
      <div className="relative z-10 max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8 shrink-0 w-full"> 
        <div className="flex justify-center items-center relative py-2"> 
          <button
            onClick={() => router.back()}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-white/80 hover:text-white text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>

          <h1 className="text-2xl font-extrabold text-white text-center pb-5">
            Contact Us
          </h1>
        </div>
      </div>

      {/* Main Grid*/}
      <section className="relative z-10 grow max-h-[88vh] overflow-y-auto"> 
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-4 px-4 sm:px-6 lg:px-8 h-full items-start">
          {/* LEFT COLUMN: Contact Details & FAQ */}
          <div className="lg:col-span-1 flex flex-col h-full"> 
            <div className="bg-white rounded-xl p-4 shadow-xl shrink-0 mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Get In Touch
              </h3>

              <div className="space-y-2 text-gray-700 text-xs">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3 text-indigo-600 shrink-0" />
                  <p>22 Kenyatta Avenue, Addis Ababa, Ethiopia</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3 text-indigo-600 shrink-0" />
                  <p>+1 111 111 1111</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="w-3 h-3 text-indigo-600 shrink-0" />
                  <p className="truncate">warmly@gmail.com</p>
                </div>

                <div className="flex space-x-3 pt-2 text-gray-800">
                  <Facebook className="w-4 h-4 hover:text-gray-600" />
                  <Instagram className="w-4 h-4 hover:text-gray-600" />
                  <Twitter className="w-4 h-4 hover:text-gray-600" />

                </div>
              </div>
            </div>

            <div className="grow min-h-0 overflow-y-auto pr-2">
              <h2 className="text-lg font-bold text-white mb-2"> 
                Frequently Asked Questions
              </h2>
              <div className="space-y-1"> 
                {faqData.map((item, index) => (
                  <FAQItem
                    key={index}
                    question={item.question}
                    answer={item.answer}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 h-full">
            <div className="bg-white rounded-xl p-5 md:p-6 shadow-2xl border-2 border-indigo-400/50 flex flex-col h-full overflow-y-auto"> {/* Compact padding, flex-col h-full, and overflow-y-auto */}
              <h3 className="text-xl font-bold text-gray-900 mb-0">
                Have Questions?
              </h3>
              <p className="text-gray-700 text-sm mb-3">
                We'd love to hear from you.
              </p>

              <form onSubmit={handleSubmit} className="space-y-2 flex flex-col grow">
                <label className="block text-gray-700 font-medium text-xs">
                  Full name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="text-black w-full p-2 border border-gray-300 rounded-lg text-sm shrink-0"
                  required
                />

                <label className="block text-gray-700 font-medium text-xs">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="johndoe@example.com"
                  className="text-black w-full p-2 border border-gray-300 rounded-lg text-sm shrink-0"
                  required
                />

                <label className="block text-gray-700 font-medium text-xs">
                  Message*
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your needs..."
                  className="text-black w-full p-2 border border-gray-300 rounded-lg text-sm resize-none grow min-h-[50px]" 
                  required
                />

                {error && (
                  <p className="text-red-500 text-xs mt-1 shrink-0">{error}</p>
                )}
                
                {/* Toaster Notification */}
                {success && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 animate-fadeIn">
                    <div className="bg-white px-6 py-5 rounded-xl shadow-2xl border-4 border-indigo-600 text-center max-w-xs w-full mx-4">
                      
                      
                      <div className="flex justify-center mb-2">
                        <div className="bg-green-100 p-2 rounded-full">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                      </div>

                      <h2 className="text-base font-bold text-gray-900 mb-3">
                        Your Message Sent Successfully.
                      </h2>

                      <button
                        onClick={() => setSuccess(null)}
                        className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-indigo-700 transition text-sm"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 text-sm font-semibold shrink-0"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}