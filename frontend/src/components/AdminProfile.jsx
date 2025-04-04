import { useState, useEffect } from "react";
import axios from "axios";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", profilePicture: null });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const { data } = await axios.get("http://localhost:5000/api/admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin(data);
      setFormData({ name: data.name, phone: data.phone });
    } catch (error) {
      console.error("Error fetching admin profile", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profilePicture: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      if (formData.profilePicture) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }

      const { data } = await axios.put("http://localhost:5000/api/admin/profile", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      setAdmin(data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-center">Admin Profile</h2>
      {admin && (
        <div className="flex flex-col items-center">
          <img
            src={previewImage || admin.profilePicture || "/default-profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mt-3"
          />
          <p className="mt-2 font-semibold">{admin.name}</p>
          <p className="text-gray-600">{admin.email}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <label className="block font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        <label className="block font-medium">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        <label className="block font-medium">Profile Picture</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="mb-3" />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default AdminProfile;
