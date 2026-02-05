"use client";
import React, { useState, useEffect } from "react";
import { getFounderProfile, updateFounderProfile, updateFounderPassword } from "../lib/founder-api";
import { getInvoices } from "../lib/payments-api";
import { FounderUpdateInput } from "../types/founder";
import { Invoice } from "../types/invoice";
import { useToast } from "../components/Toast"; 
import { Eye, EyeClosed, ExternalLink, Crown, CreditCard, Download, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<"personal" | "billing" | "security">("personal");
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState<FounderUpdateInput & { tier?: string }>({
    name: "",
    email: "",
    phone: "",
    tier: "trial"
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFounderProfile();
        setProfile({ 
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
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
      // Password is no longer part of this payload
      const { name, email, phone } = profile;
      await updateFounderProfile({ name, email, phone });
      showToast("Profile updated successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
        return showToast("New passwords do not match", "error");
    }
    setLoading(true);
    try {
      await updateFounderPassword(passwordData);
      showToast("Password updated successfully!", "success");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      showToast(err.message || "Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-slate-800 to-gray-950 p-6 md:p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-gray-400 mb-8">Manage your profile and preferences</p>

        {/* Tabs */}
        <div className="inline-flex items-center p-1 bg-gray-900 rounded-xl mb-8 border border-gray-800 overflow-x-auto max-w-full">
          {["personal", "security", "billing"].map((t) => (
            <button
              key={t}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                tab === t 
                ? "bg-linear-to-r from-[#4f46e5] to-[#7c3aed] text-white shadow-lg" 
                : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setTab(t as any)}
            >
              {t === "billing" && <CreditCard className="w-4 h-4" />}
              {t === "security" && <ShieldCheck className="w-4 h-4" />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {tab === "personal" && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">
              <div className="flex flex-col gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Full Name</label>
                  <input className="bg-[#161b22] border border-gray-800 text-white rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Email</label>
                  <input className="bg-[#161b22] border border-gray-800 text-white rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Phone</label>
                  <input className="bg-[#161b22] border border-gray-800 text-white rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <button className="mt-4 bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-xl transition shadow-lg active:scale-[0.98]" disabled={loading} onClick={handleSaveProfile}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {tab === "security" && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-400" /> Change Password
              </h3>
              <div className="flex flex-col gap-5">
                {[
                    { label: "Current Password", key: "oldPassword", viewKey: "old" },
                    { label: "New Password", key: "newPassword", viewKey: "new" },
                    { label: "Confirm New Password", key: "confirmPassword", viewKey: "confirm" }
                ].map((field) => (
                    <div key={field.key} className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">{field.label}</label>
                        <div className="relative">
                            <input 
                                className="bg-[#161b22] border border-gray-800 text-white rounded-lg px-4 py-2.5 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" 
                                type={showPass[field.viewKey as keyof typeof showPass] ? "text" : "password"} 
                                value={passwordData[field.key as keyof typeof passwordData]} 
                                onChange={e => setPasswordData(p => ({ ...p, [field.key]: e.target.value }))} 
                            />
                            <button 
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300" 
                                onClick={() => setShowPass(p => ({ ...p, [field.viewKey]: !p[field.viewKey as keyof typeof showPass] }))}
                            >
                                {showPass[field.viewKey as keyof typeof showPass] ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                ))}
                <button className="mt-4 bg-indigo-600 text-white hover:bg-indigo-500 font-bold py-3 rounded-xl transition shadow-lg active:scale-[0.98]" disabled={loading} onClick={handleUpdatePassword}>
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          )}


          {tab === "billing" && (
            <div className="flex flex-col gap-6">
              <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold flex items-center gap-2">
                        {profile.tier === 'lifetime' ? 'Lifetime Access Plan' : 'Trial Plan'}
                        {profile.tier === 'lifetime' && <Crown className="w-5 h-5 text-yellow-500" />}
                      </h3>
                    </div>
                  </div>
                  {profile.tier === 'trial'? 
                    <Link href="/pricing" className="bg-[#1c2128] hover:bg-[#2d333b] text-white border border-gray-700 px-6 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 self-start md:self-center">
                      Change Plan <ExternalLink className="w-4 h-4" />
                    </Link> : ''
                  }
                </div>
              </div>

              <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-6 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    Payment History
                  </h3>
                  <p className="text-gray-400 text-sm">Download your past history</p>
                </div>
                {invoices.length === 0 ? (
                  <div className="text-center py-10 bg-[#0a0c10] rounded-xl border border-dashed border-gray-800">
                    <p className="text-gray-500">No invoices found yet.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {invoices.map((inv) => (
                      <div key={inv._id} className="flex items-center justify-between p-4 rounded-xl bg-[#161b22] transition group">
                        <div className="flex items-center gap-8">
                          <span className="text-sm font-medium text-gray-400 w-16">INV-001</span>
                          <span className="text-sm text-gray-400">{new Date(inv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="font-bold text-gray-200">${(inv.amount / 100).toFixed(2)}</span>
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-md uppercase tracking-wider border border-emerald-500/20">{inv.status}</span>
                          <button className="text-gray-500 hover:text-white transition"><Download className="w-4 h-4" /></button>
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