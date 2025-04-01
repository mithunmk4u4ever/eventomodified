import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token
      const { data } = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
      
      // Update preview path to match the multer configuration
      setPreview(data.profilePicture ? `http://localhost:5000/public/uploads/profilepictures/${data.profilePicture}` : "");
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file)); // Preview the selected file
  };

  const handleUpload = async (userId) => {
    console.log("Uploading", userId);

    if (!selectedFile) return alert("Please select an image first");

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);
    console.log("file", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(`http://localhost:5000/api/users/profile/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile picture updated!");
      setUser((prev) => ({ ...prev, profilePicture: data.profilePicture }));

      // Ensure the preview matches the new multer path
      setPreview(`http://localhost:5000/public/uploads/profilepictures/${data.profilePicture}`);
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  console.log("user profile", user);

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Profile Management</h2>

      {user ? (
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Welcome, {user.name}</h3>
          <p>Email: {user.email}</p>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <div className="flex items-center gap-4 mt-2">
              <img
                src={preview || "/default-avatar.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full border"
              />
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={() => handleUpload(user._id)}
          >
            Upload
          </button>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      <div class = "bg-white p-4 py-6 shadow rounded-lg">
      <Link to={"/user/orders"}>My Orders</Link>
      </div>
    </div>
  );
};

export default UserProfile;
