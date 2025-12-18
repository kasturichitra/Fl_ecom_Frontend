import { useState } from "react";
import { useCreateContactInfo } from "../hooks/useContactInfo";
// import { useCreateContactInfo } from "../hooks/useCreateContactInfo";

const ContactInfoForm = () => {
  const { mutateAsync: createContactInfo, isLoading } =
    useCreateContactInfo();

  const [form, setForm] = useState({
    email: "",
    phone_number: "",
    address: "",
    instagram_link: "",
    facebook_link: "",
    twitter_link: "",
    about_us: "",
    terms_and_conditions: "",
    privacy_policy: "",
  });

  const [logoImage, setLogoImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (logoImage) {
      formData.append("logo_image", logoImage);
    }

    await createContactInfo(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-6 rounded-xl border space-y-4"
    >
      <h2 className="text-xl font-semibold">Contact Information</h2>

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Support Email"
        className="w-full p-2 border rounded"
      />

      <input
        name="phone_number"
        value={form.phone_number}
        onChange={handleChange}
        placeholder="Phone Number"
        className="w-full p-2 border rounded"
      />

      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        className="w-full p-2 border rounded"
      />

      <input
        name="instagram_link"
        value={form.instagram_link}
        onChange={handleChange}
        placeholder="Instagram Link"
        className="w-full p-2 border rounded"
      />

      <input
        name="facebook_link"
        value={form.facebook_link}
        onChange={handleChange}
        placeholder="Facebook Link"
        className="w-full p-2 border rounded"
      />

      <input
        name="twitter_link"
        value={form.twitter_link}
        onChange={handleChange}
        placeholder="Twitter / X Link"
        className="w-full p-2 border rounded"
      />
      <input
        name="navbar_banner_text"
        value={form.navbar_banner_text}
        onChange={handleChange}
        placeholder="Navbar Banner Text"
        className="w-full p-2 border rounded"
      />

      <textarea
        name="about_us"
        value={form.about_us}
        onChange={handleChange}
        placeholder="About Us"
        className="w-full p-2 border rounded"
      />

      <textarea
        name="terms_and_conditions"
        value={form.terms_and_conditions}
        onChange={handleChange}
        placeholder="Terms & Conditions"
        className="w-full p-2 border rounded"
      />

      <textarea
        name="privacy_policy"
        value={form.privacy_policy}
        onChange={handleChange}
        placeholder="Privacy Policy"
        className="w-full p-2 border rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setLogoImage(e.target.files[0])}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="bg-[#7CB518] text-white px-6 py-2 rounded"
      >
        {isLoading ? "Saving..." : "Save Contact Info"}
      </button>
    </form>
  );
};

export default ContactInfoForm;
