import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaShoppingCart, FaCog, FaBars, FaTimes } from "react-icons/fa";
import PublicEventListings from "../components/PublicEventListings"; // Import the component

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 bg-gray-900 text-white w-64 p-6 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} transition-transform md:translate-x-0 md:static md:flex md:flex-col`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">User Dashboard</h2>
          <button className="md:hidden text-white" onClick={() => setSidebarOpen(false)}>
            <FaTimes size={20} />
          </button>
        </div>
        <ul className="space-y-4">
          <li className="flex items-center p-3 hover:bg-gray-700 rounded cursor-pointer">
            <FaUser className="mr-3" /> Profile
          </li>
          <li className="flex items-center p-3 hover:bg-gray-700 rounded cursor-pointer">
            <FaShoppingCart className="mr-3" /> Orders
          </li>
          <li className="flex items-center p-3 hover:bg-gray-700 rounded cursor-pointer">
            <FaCog className="mr-3" /> Settings
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-64">
        {/* Mobile Menu Button */}
        <button className="md:hidden p-4 text-gray-900" onClick={() => setSidebarOpen(true)}>
          <FaBars size={24} />
        </button>

        {user ? (
          <div className="max-w-lg mx-auto bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">{user.name}'s Profile</h1>
            <div className="flex items-center space-x-4">
              <img
                src={user.profilePicture ? `http://localhost:5000${user.profilePicture}` : "https://via.placeholder.com/100"}
                alt="Profile"
                className="w-20 h-20 rounded-full border"
              />

              <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-gray-200">{user.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-700">Loading user data...</p>
        )}

        {/* Public Events Listing */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <PublicEventListings />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
