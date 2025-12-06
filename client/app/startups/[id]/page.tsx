"use client";

import { useEffect, useState } from "react";
import { getStartupById, deleteStartup } from "../../lib/startup-api";
import { Startup } from "../../types/startup";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, ExternalLink } from "lucide-react";

export default function SingleStartupPage() {
  const [startup, setStartup] = useState<Startup | null>(null);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    getStartupById(id).then(setStartup).catch(console.error);
  }, [id]);

  async function handleDelete() {
    const confirmed = confirm(`Are you sure you want to delete this startup?`);
    if (!confirmed) return;

    try {
      await deleteStartup(id);
      router.push("/startups");
    } catch (error) {
      console.error(error);
    }
  }

  if (!startup) return <p className="p-6 text-gray-300">Loading startup details...</p>;

  return (
    <div
      className="min-h-screen bg-cover bg-center pt-12 pb-12"
      style={{ backgroundImage: "url('/background-img.jpg')" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link href="/startups" className="flex items-center space-x-2 text-gray-300 hover:text-white transition duration-150">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Startups</span>
        </Link>

        <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6">
            <h1 className="text-4xl font-extrabold text-gray-900">{startup.name}</h1>
            <p className="text-lg text-gray-700 leading-relaxed">{startup.blurb}</p>

            {startup.pitchLink && (
              <a
                href={startup.pitchLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 font-semibold hover:underline"
              >
                <span>View Pitch Deck</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <hr className="border-gray-100" />

            <div className="text-sm text-gray-500">
                <div className="flex space-x-10">
                    <div>
                        <p className="font-medium uppercase tracking-wider">Intros Created</p>
                        <p className="text-2xl font-bold text-gray-900">*To do</p>
                    </div>
                </div>
                
                <p className="mt-4 text-xs">Startup Created At: {new Date(startup.createdAt).toLocaleString()}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-100">
                <Link
                    href={`/startups/${startup._id}/edit`}
                    className="flex items-center space-x-1 bg-[#5A5C7F] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#6e7099] transition duration-150"
                >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                </Link>

                <button
                    onClick={handleDelete}
                    className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition duration-150"
                >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Startup</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}