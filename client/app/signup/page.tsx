"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { initiateGoogleLogin, signupFounder } from "../lib/founder-api";
import { useToast } from "../components/Toast";

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
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

  const handlePhoneChange = (value: string, country: any) => {
    const dialCode = country.dialCode;
    const localPart = value.slice(dialCode.length);
    let cleanValue = value;
    if (localPart.startsWith("0")) {
      cleanValue = dialCode + localPart.substring(1);
    }
    setForm({ ...form, phone: cleanValue });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!form.name.trim()) { showToast("Please enter your name", "error"); setLoading(false); return; }
    if (!form.email.trim()) { showToast("Please enter your email", "error"); setLoading(false); return; }
    if (!form.phone.trim()) { showToast("Please enter your phone number", "error"); setLoading(false); return; }
    if (form.password.length < 6) { showToast("Password must be at least 6 characters", "error"); setLoading(false); return; }
    if (form.password !== form.confirmPassword) { showToast("Passwords do not match", "error"); setLoading(false); return; }

    try {
      const fullPhone = `+${form.phone}`;
      const result = await signupFounder({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: fullPhone,
      });

      showToast(`Account created for ${result.name}. Redirecting to login.`, "success");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      showToast(err.message || "Network error.", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = () => {
    setLoading(true);
    initiateGoogleLogin();
  };

  return (
    <div className="relative min-h-screen w-full bg-linear-to-br from-blue-900 via-slate-800 to-gray-900 flex items-center justify-center font-sans p-4">
      
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-white hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      <div
        className={`bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-6 sm:p-10 max-w-md w-full flex flex-col items-center transition-all duration-1000 overflow-y-auto max-h-[95vh] sm:max-h-none ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Image src="/logo.png" width={50} height={40} alt="Warmly Logo" className="mb-2" />
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Create account</h2>
          <p className="text-gray-400 text-xs sm:text-sm">warm Introduction Assistant</p>
        </div>

        <form className="w-full flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-300 text-xs sm:text-sm font-medium ml-1">Full name</label>
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2.5 sm:p-3 bg-gray-400/20 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-gray-500 transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-300 text-xs sm:text-sm font-medium ml-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2.5 sm:p-3 bg-gray-400/20 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-gray-500 transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-300 text-xs sm:text-sm font-medium ml-1">Phone</label>
            <div className="dark-phone-input">
              <PhoneInput
                country={"ke"}
                value={form.phone}
                onChange={handlePhoneChange}
                containerClass="!w-full"
                inputClass="!w-full !h-[44px] sm:!h-[50px] !bg-gray-400/20 !text-white !border-gray-600 !rounded-lg !text-sm sm:!text-base"
                buttonClass="!bg-transparent !border-gray-600 !rounded-l-lg"
                dropdownClass="!bg-slate-800 !text-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-300 text-xs sm:text-sm font-medium ml-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                placeholder="Password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full p-2.5 sm:p-3 bg-gray-400/20 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-300 text-xs sm:text-sm font-medium ml-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConf ? "text" : "password"}
                value={form.confirmPassword}
                placeholder="Password"
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full p-2.5 sm:p-3 bg-gray-400/20 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                onClick={() => setShowConf(!showConf)}
              >
                {showConf ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 sm:py-3 bg-blue-700 hover:bg-blue-600 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign up"}
          </button>

          <div className="flex items-center my-1 sm:my-2">
            <div className="grow border-t border-gray-700"></div>
            <span className="px-3 text-gray-500 text-[10px] sm:text-xs uppercase">or continue with</span>
            <div className="grow border-t border-gray-700"></div>
          </div>

          <button
            data-testid="login-google"
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg border border-gray-600 text-gray-300 font-medium text-sm sm:text-base transition-colors hover:bg-white/5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Image src="/google.svg" width={18} height={18} alt="Google" />
            Sign up with Google
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-400 mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}