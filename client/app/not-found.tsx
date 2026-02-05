"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-slate-800 to-gray-950 flex flex-col items-center justify-center px-4">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="bg-gray-900 border border-slate-800 p-10 rounded-3xl shadow-2xl max-w-md backdrop-blur-sm">
          <div className="bg-blue-500/20 p-4 rounded-2xl w-fit mx-auto mb-6">
            <AlertCircle size={48} className="text-blue-400" />
          </div>

          <h1 className="text-7xl font-black text-white tracking-tighter mb-2">
            404
          </h1>
          
          <h2 className="text-xl font-semibold text-slate-200 mb-4">
            Page Not Found
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Ooops. We couldn't find the page you're looking for. 
            We're redirecting you to safety in a few seconds...
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}