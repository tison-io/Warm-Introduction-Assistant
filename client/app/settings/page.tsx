"use client";
import React, { useState, useEffect } from "react";
import { getFounderProfile, updateFounderProfile } from "../lib/founder-api";
import { getInvoices } from "../lib/payments-api";
import { FounderUpdateInput } from "../types/founder";
import { Invoice } from "../types/invoice";
import { useToast } from "../components/Toast"; 
import { Loader2, Eye, EyeClosed, Receipt, ExternalLink, Crown } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<"personal" | "startup" | "billing">("personal");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [profile, setProfile] = useState<FounderUpdateInput & { tier?: string }>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFounderProfile();
        setProfile({ 
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          password: "",
          tier: data.tier || "trial"
        });

        if (tab === "billing") {
          const invData = await getInvoices();
          setInvoices(invData);
        }
      } catch (err: any) {
        showToast(err.message || "Failed to load data", "error");
      }
    };
    fetchData();
  }, [showToast, tab]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateFounderProfile(profile);
      showToast("Profile updated successfully!", "success");
      setProfile(p => ({ ...p, password: "" }));
    } catch (err: any) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-6 md:p-8" style={{ backgroundImage: "url('/background-img.jpg')" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
        <p className="text-gray-200 mb-6">Manage your profile and preferences</p>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto">
          {["personal", "startup", "billing"].map((t) => (
            <button
              key={t}
              className={`px-6 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                tab === t ? "bg-white text-gray-900" : "bg-gray-300/80 text-gray-700"
              }`}
              onClick={() => setTab(t as any)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)} {t === "billing" ? "History" : "Details"}
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          {tab === "personal" && (
             <div className="flex flex-col gap-4">
               <label className="font-medium">Full Name</label>
               <input className="border border-gray-300 rounded-lg px-4 py-2 w-full" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
               <label className="font-medium">Email</label>
               <input className="border border-gray-300 rounded-lg px-4 py-2 w-full" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
               <label className="font-medium">Phone</label>
               <input className="border border-gray-300 rounded-lg px-4 py-2 w-full" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
               <label className="font-medium">Password</label>
               <div className="relative">
                 <input className="border border-gray-300 rounded-lg px-4 py-2 w-full pr-10" type={showPassword ? "text" : "password"} value={profile.password} onChange={e => setProfile(p => ({ ...p, password: e.target.value }))} />
                 <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                   {showPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                 </button>
               </div>
               <button className="mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg" disabled={loading} onClick={handleSaveProfile}>
                 {loading ? "Saving..." : "Save Changes"}
               </button>
             </div>
          )}

          {tab === "startup" && (
            <div className="flex flex-col gap-4">
              <label className="font-medium">Startup Name</label>
              <input className="border border-gray-300 rounded-lg px-4 py-2 w-full" defaultValue="MyStartup" />
              <button className="mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg">Save Changes</button>
            </div>
          )}

          {tab === "billing" && (
            <div className="flex flex-col gap-8">
              {/* Plan Overview */}
              <div className="flex items-center justify-between p-6 bg-blue-50 border border-blue-100 rounded-xl">
                <div>
                  <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                    Current Plan: <span className="capitalize">{profile.tier}</span>
                    {profile.tier === 'lifetime' && <Crown className="w-5 h-5 text-yellow-500" />}
                  </h3>
                  <p className="text-blue-700 text-sm">
                    {profile.tier === "trial" 
                      ? "Your trial period allows limited access to AI features." 
                      : "You have full lifetime access to all features."}
                  </p>
                </div>
                {profile.tier === "trial" && (
                  <Link href="/pricing" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition">
                    Upgrade Now
                  </Link>
                )}
              </div>

              {/* Invoices Section */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5" /> Payment History
                </h3>
                
                {invoices.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No invoices found yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {invoices.map((inv) => (
                      <div key={inv._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">
                            ${(inv.amount / 100).toFixed(2)} {inv.currency.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(inv.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}