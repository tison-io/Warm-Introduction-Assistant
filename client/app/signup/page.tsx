"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupFounder } from "../lib/founder-api";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({
       name: "",
       email: "",
       password: "",
    });

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    async function handleSubmit(e:React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try{
            const result = await signupFounder(form);
            setMsg(`Account created successfully for ${result.name}.`);
            setTimeout(() => router.push('/login'), 1500);
        } catch (err:any) {
            setMsg(err.message || "An error occured. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
            >
                <h2 className="text-2xl font-semibold text-center">Get started for free!</h2>

                {msg && <p className="text-center text-sm text-green-700 mt-2">{msg}</p>}

               <input
                    type="text"
                    placeholder="Full Name  "
                    className="w-full p-2 border rounded"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                /> 

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                /> 

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                /> 

                <button 
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                    disabled={loading}
                >
                    {loading ? "Signing up...": "Sign Up"}
                </button>

            </form>
        </div>
    )
}