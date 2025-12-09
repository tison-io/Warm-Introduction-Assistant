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
    <div style={{
      width: "100%",
      minHeight: "100vh",
      backgroundImage: "url('/backeground.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "40px 20px",
    }}>
      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "30px", color: "#333" }}>
          Profile
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "30px", textAlign: "center" }}>
            <div style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              margin: "0 auto 15px",
              overflow: "hidden",
              border: "3px solid #ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <svg width="60" height="60" fill="#ccc" viewBox="0 0 20 20">
                  <circle cx="10" cy="7" r="3.5" />
                  <path d="M4 17a6 6 0 0 1 12 0" strokeWidth="1.5" stroke="#ccc" fill="none" />
                </svg>
              )}
            </div>
            <label style={{
              display: "inline-block",
              padding: "8px 16px",
              backgroundColor: "#f8f9fa",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              color: "#333",
            }}>
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
              Phone Number
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                style={{
                  padding: "12px 8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  background: "#fff",
                  cursor: "pointer",
                  width: "90px",
                }}
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
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
              Skills
            </label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              rows={3}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
              Role
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
