'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { approveIntro } from "../../lib/intro-api";

export default function ApproveIntroClient() {
  const searchParams = useSearchParams();
  const introId = searchParams.get("introId"); 

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing approval...");

  useEffect(() => {
    async function run() {
      if (!introId) {
        setStatus("error");
        setMessage("Invalid or missing approval link.");
        return;
      }

      try {
        const result = await approveIntro(introId);
        if (result.message?.includes("already approved")) {
          setStatus("error");
          setMessage("This intro has already been approved or processed.");
        } else {
          setStatus("success");
          setMessage("Intro successfully approved!");
        }
      } catch (err: any) {
        setStatus("error");
        setMessage("Failed to approve intro. Link may have expired.");
      }
    }

    run();
  }, [introId]);

  return (
    <main
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-6"
      style={{ backgroundImage: "url('/background-img.jpg')" }}
    >
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold mb-4">{message}</h1>
        {status === "loading" && <p className="text-gray-600">Please wait...</p>}
        {status === "success" && <p className="text-green-600">You can close this window now.</p>}
        {status === "error" && (
          <p className="text-red-600">
            Try contacting the founder if you believe this is a mistake.
          </p>
        )}
      </div>
    </main>
  );
}
