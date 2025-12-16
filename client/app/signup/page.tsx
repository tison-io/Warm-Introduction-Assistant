"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeClosed, Loader2 } from "lucide-react";
import { signupFounder } from "../lib/founder-api";
import { useToast } from "../components/Toast";

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [countryCode, setCountryCode] = useState("+1");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!form.name.trim()) { showToast("Please enter your name", "error"); setLoading(false); return; }
    if (!form.email.trim()) { showToast("Please enter your email", "error"); setLoading(false); return; }
    if (!form.phone.trim()) { showToast("Please enter your phone number", "error"); setLoading(false); return; }
    if (form.password.length < 6) { showToast("Password must be at least 6 characters", "error"); setLoading(false); return; }
    if (form.password !== form.confirmPassword) { showToast("Passwords do not match", "error"); setLoading(false); return; }

    try {
      const fullPhone = countryCode + form.phone;
      const result = await signupFounder({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: fullPhone,
      });

      // Show success toast
      showToast(`Account created for ${result.name}. Please login.`, "success");

      // Redirect after short delay
      setTimeout(() => router.push("/login"), 2000);

    } catch (err: any) {
      const errorMsg =
        err.message || err.error || "Network error. Please check your connection.";
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/backeground.jpg')" }}>
      
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-white text-sm hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
      </div>

      {/* Container */}
      <div
        className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-10 max-w-md w-11/12 flex flex-col items-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        {/* Logo */}
        <div className={`mb-3 transition-all duration-1200 ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-50 -translate-y-8"}`}>
          <Image src="/logo.png" width={60} height={48} alt="Warmly Logo" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-1">Create Account</h2>
        <div className="text-gray-600 text-sm sm:text-base mb-4">warm Introduction Assistant</div>

        <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit} data-testid="signup-form">
          <input
            data-testid="signup-name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <input
            data-testid="signup-email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            required
          />

          {/* Phone Field */}
          <div className="flex gap-2 w-full">
            <select
              data-testid="signup-country-code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-20 p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base cursor-pointer"
            >
              <option value="+1">US +1</option>
              <option value="+254">Kenya +254</option>
              <option value="+233">Ghana +233</option>
            </select>
            <input
              data-testid="signup-phone"
              type="tel"
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              data-testid="signup-password"
              type={showPass ? "text" : "password"}
              placeholder="Create Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              data-testid="toggle-password"
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPass(!showPass)}
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? <EyeClosed /> : <Eye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              data-testid="signup-confirm-password"
              type={showConf ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConf(!showConf)}
              aria-label={showConf ? "Hide confirm password" : "Show confirm password"}
            >
              {showConf ? <EyeClosed /> : <Eye />}
            </button>

            <div className="flex items-center mt-2 text-xs text-gray-600">
              <input data-testid="signup-terms" type="checkbox" id="terms" required className="mr-2" />
              <label htmlFor="terms">I have read and agree to the Terms of Service</label>
            </div>
          </div>

          {/* Register Button */}
          <button
            data-testid="signup-submit"
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-semibold text-base transition-colors ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-600 mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 underline hover:text-blue-800">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
