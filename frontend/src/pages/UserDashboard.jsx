import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaUser, FaShoppingCart, FaCog, FaBars, FaTimes } from "react-icons/fa";
import PublicEventListings from "../components/PublicEventListings";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [approvedEvents, setApprovedEvents] = useState([]); // ✅ State for approved events

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

    const fetchApprovedEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/privateEvents/approved", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApprovedEvents(data);
      } catch (error) {
        console.error("Error fetching approved events", error);
      }
    };

    fetchUser();
    fetchApprovedEvents();
  }, []);


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 bg-gray-900 text-white w-64 p-6 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} transition-transform md:translate-x-0 md:static md:flex md:flex-col`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">User Dashboard</h2>
          <button className="md:hidden text-white" onClick={() => setSidebarOpen(false)}>
            <FaTimes size={20} />
          </button>
        </div>
        <ul className="space-y-4">
          <li>
            <Link to="/user/profile" className="flex items-center p-3 hover:bg-gray-700 rounded cursor-pointer">
              <FaUser className="mr-3" /> Profile
            </Link>
          </li>
          <li>
            <Link to="/user/orders" className="flex items-center p-3 hover:bg-gray-700 rounded cursor-pointer">
              <FaShoppingCart className="mr-3" /> Orders
            </Link>
          </li>
          <li>
            <Link to="/user/settings" className="flex items-center p-3 hover:bg-gray-700 rounded cursor-pointer">
              <FaCog className="mr-3" /> Settings
            </Link>
          </li>
        </ul>

      </div>

      {/* Main Content */}
      <div className="flex-1 py-6 px-6 md:pr-6">
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
        <Link to={"/user/privateevent"} class="inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white mt-5">
          <span class="w-full">Create An Event!</span>
        </Link>
        {/* ✅ Approved Private Events */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Approved Private Events</h2>
          {approvedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedEvents.map((event) => (
                <div key={event._id} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold">{event.event_type}</h3>
                  <p className="text-gray-600">{new Date(event.event_date).toLocaleDateString()}</p>
                  <p className="text-gray-700">Location: {event.event_location}</p>
                  <p className="text-gray-700">Guests: {event.guest_count}</p>
                  <p className="text-green-600 font-bold">Status: {event.event_status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700">No approved private events yet.</p>
          )}
        </div>

        {/* Public Events Listing */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Public Events</h2>
          <PublicEventListings />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
