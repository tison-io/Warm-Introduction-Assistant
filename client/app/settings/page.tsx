'use client';
import React, { useState, useEffect } from "react";
import { getFounderProfile, updateFounderProfile } from "../lib/founder-api";
import { FounderUpdateInput } from "../types/founder";
import { useToast } from "../components/Toast"; // <-- import toast hook
import { Loader2, Eye, EyeClosed } from "lucide-react";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<"personal" | "startup">("personal");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState<FounderUpdateInput>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [startup, setStartup] = useState({
    name: "MyStartup",
    blurb: "We help SaaS companies reduce churn...",
    link: "https://abc.com",
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getFounderProfile();
        setProfile({ 
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          password: "",
        });
      } catch (err: any) {
        showToast(err.message || "Failed to load profile", "error");
      }
    };
    fetchProfile();
  }, [showToast]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateFounderProfile(profile);
      showToast("Profile updated successfully!", "success");
      setProfile(p => ({ ...p, password: "" })); // clear password input
    } catch (err: any) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStartup = async () => {
    setLoading(true);
    try {
      // Implement startup save API call if available
      // await updateStartup(startup);
      showToast("Startup details updated successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update startup details", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6 md:p-8"
      style={{ backgroundImage: "url('/background-img.jpg')" }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
        <p className="text-gray-200 mb-6">Manage your profile and preferences</p>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-lg font-medium transition ${
              tab === "personal" ? "bg-white text-gray-900" : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setTab("personal")}
          >
            Personal Profile
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-medium transition ${
              tab === "startup" ? "bg-white text-gray-900" : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setTab("startup")}
          >
            Startup Details
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          {tab === "personal" ? (
            <div className="flex flex-col gap-4">
              <label className="font-medium">Full Name</label>
              <input
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                type="text"
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              />

              <label className="font-medium">Email</label>
              <input
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                type="email"
                value={profile.email}
                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
              />

              <label className="font-medium">Phone</label>
              <input
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                type="tel"
                value={profile.phone}
                onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
              />

              <label className="font-medium">Password</label>
              <div className="relative w-full">
                <input
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full pr-10"
                  type={showPassword ? "text" : "password"}
                  value={profile.password}
                  onChange={e => setProfile(p => ({ ...p, password: e.target.value }))}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                className={`mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center`}
                disabled={loading}
                onClick={handleSaveProfile}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <label className="font-medium">Startup Name</label>
              <input
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                type="text"
                value={startup.name}
                onChange={e => setStartup(s => ({ ...s, name: e.target.value }))}
              />

              <label className="font-medium">Blurb</label>
              <input
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                type="text"
                value={startup.blurb}
                onChange={e => setStartup(s => ({ ...s, blurb: e.target.value }))}
              />

              <label className="font-medium">Pitch Link</label>
              <input
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                type="text"
                value={startup.link}
                onChange={e => setStartup(s => ({ ...s, link: e.target.value }))}
              />

              <button
                className={`mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center`}
                disabled={loading}
                onClick={handleSaveStartup}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
