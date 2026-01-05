'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
        router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
    }, [router]);

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4 bg-cover bg-center relative"
            style={{ backgroundImage: "url('/background-img.jpg')" }}
        >
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
                <h1 className="text-6xl font-bold text-white">404</h1>

                <p className="mt-2 text-gray-200 text-lg">
                    Ooops. We couldn't find the page you're looking for. Redirecting you...
                </p>
            </div>
        </div>
    );
}
