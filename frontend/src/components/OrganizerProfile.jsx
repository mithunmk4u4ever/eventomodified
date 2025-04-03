import { useEffect, useState } from "react";
import axios from "axios";

const OrganizerProfile = () => {
  const [organizer, setOrganizer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", contact: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrganizerProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/organizers/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrganizer(data);
        setFormData({ name: data.name, email: data.email, contact: data.contact || "" });
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching profile");
      }
    };

    fetchOrganizerProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put("http://localhost:5000/api/organizers/update-profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(data.message);
      setIsEditing(false);
      setOrganizer({ ...organizer, ...formData });
    } catch (err) {
      setError(err.response?.data?.error || "Error updating profile");
    }
  };

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!organizer) return <p className="text-gray-500 text-center">Loading profile...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg p-6 rounded-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Organizer Profile</h2>
      
      {message && <p className="text-green-500">{message}</p>}

      {isEditing ? (
        <>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
            placeholder="Email"
          />
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
            placeholder="Contact"
          />

          <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mr-2">
            Save Changes
          </button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
            Cancel
          </button>
        </>
      ) : (
        <>
          <div className="mb-4">
            <strong className="text-gray-700">Name:</strong> <span className="text-gray-900">{organizer.name}</span>
          </div>
          <div className="mb-4">
            <strong className="text-gray-700">Email:</strong> <span className="text-gray-900">{organizer.email}</span>
          </div>
          <div className="mb-4">
            <strong className="text-gray-700">Contact:</strong> <span className="text-gray-900">{organizer.contact || "N/A"}</span>
          </div>

          <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
};

export default OrganizerProfile;
