"use client";
import { useState } from "react";

export default function Profile() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    skills: "",
    role: "",
  });
  const [countryCode, setCountryCode] = useState("+1");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile updated:", formData, profileImage);
  };

  return (
    <div className="w-full min-h-screen bg-cover bg-center p-4 sm:p-6 lg:p-10" style={{
      backgroundImage: "url('/backeground.jpg')",
    }}>
      <div className="max-w-sm sm:max-w-md lg:max-w-2xl mx-auto bg-white p-6 sm:p-8 lg:p-10 rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 text-center">
          Profile
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 sm:mb-8 text-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-100 mx-auto mb-4 overflow-hidden border-3 border-gray-300 flex items-center justify-center">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <svg width="40" height="40" className="sm:w-16 sm:h-16" fill="#ccc" viewBox="0 0 20 20">
                  <circle cx="10" cy="7" r="3.5" />
                  <path d="M4 17a6 6 0 0 1 12 0" strokeWidth="1.5" stroke="#ccc" fill="none" />
                </svg>
              )}
            </div>
            <label className="inline-block px-4 py-2 bg-gray-50 border border-gray-300 rounded cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
className="hidden"
              />
            </label>
          </div>
          <div className="mb-4 sm:mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="mb-4 sm:mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="mb-4 sm:mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="flex gap-2 sm:gap-3">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer w-20 sm:w-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="+213">Algeria 🇩🇿 +213</option>
                <option value="+61">Australia 🇦🇺 +61</option>
                <option value="+55">Brazil 🇧🇷 +55</option>
                <option value="+86">China 🇨🇳 +86</option>
                <option value="+20">Egypt 🇪🇬 +20</option>
                <option value="+251">Ethiopia 🇪🇹 +251</option>
                <option value="+33">France 🇫🇷 +33</option>
                <option value="+49">Germany 🇩🇪 +49</option>
                <option value="+233">Ghana 🇬🇭 +233</option>
                <option value="+91">India 🇮🇳 +91</option>
                <option value="+225">Ivory Coast 🇨🇮 +225</option>
                <option value="+39">Italy 🇮🇹 +39</option>
                <option value="+81">Japan 🇯🇵 +81</option>
                <option value="+254">Kenya 🇰🇪 +254</option>
                <option value="+52">Mexico 🇲🇽 +52</option>
                <option value="+212">Morocco 🇲🇦 +212</option>
                <option value="+234">Nigeria 🇳🇬 +234</option>
                <option value="+7">Russia 🇷🇺 +7</option>
                <option value="+250">Rwanda 🇷🇼 +250</option>
                <option value="+221">Senegal 🇸🇳 +221</option>
                <option value="+27">South Africa 🇿🇦 +27</option>
                <option value="+82">South Korea 🇰🇷 +82</option>
                <option value="+34">Spain 🇪🇸 +34</option>
                <option value="+255">Tanzania 🇹🇿 +255</option>
                <option value="+216">Tunisia 🇹🇳 +216</option>
                <option value="+256">Uganda 🇺🇬 +256</option>
                <option value="+44">United Kingdom 🇬🇧 +44</option>
                <option value="+1">United States 🇺🇸 +1</option>
                <option value="+260">Zambia 🇿🇲 +260</option>
                <option value="+263">Zimbabwe 🇿🇼 +263</option>
              </select>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Skills
            </label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="mb-6 sm:mb-8">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 sm:py-4 bg-blue-600 text-white border-none rounded-lg text-sm sm:text-base font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
