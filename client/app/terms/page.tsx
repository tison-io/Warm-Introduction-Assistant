"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    const router = useRouter();

    const BACKGROUND_IMAGE_PATH = "/background-img.jpg";

    return (
        <div
            className="min-h-screen bg-cover bg-center flex flex-col"
            style={{ backgroundImage: `url('${BACKGROUND_IMAGE_PATH}')` }}
        >
            <div className="relative z-10 max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8 shrink-0 w-full">
              <div className="flex justify-center items-center relative py-2">

                <button
                  onClick={() => router.back()}
                  className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-white/80 hover:text-white text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </button>

                <h1 className="text-2xl font-extrabold text-white text-center">
                  Terms of Service
                </h1>
        </div>
      </div>

      <section className="relative z-10 grow max-h-[88vh] overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-2xl border-2 border-indigo-400/50 mb-6">
            
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 text-sm mb-4">
              By accessing or using the Warmly service, you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the service.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-4">
              2. User Accounts
            </h2>
            <p className="text-gray-700 text-sm mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-4">
              3. Privacy Policy
            </h2>
            <p className="text-gray-700 text-sm mb-4">
              Your use of the Service is also governed by our Privacy Policy, which is incorporated by reference into these Terms. By using the Service, you consent to the collection and use of information as outlined therein.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-4">
              4. Termination
            </h2>
            <p className="text-gray-700 text-sm mb-4">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-4">
              5. Governing Law
            </h2>
            <p className="text-gray-700 text-sm mb-4">
              These Terms shall be governed and construed in accordance with the laws of Ethiopia, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-4">
              6. Changes
            </h2>
            <p className="text-gray-700 text-sm">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}