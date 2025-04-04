import { useState } from "react";
import UserManagement from "../components/UserManagement";
import VendorManagement from "../components/VendorManagement";
import PrivateEventsApproval from "../components/PrivateEventsApproval";
import PublicEventApproval from "../components/PublicEventApproval";
import { FaBars, FaTimes, FaUser, FaStore, FaCalendarCheck, FaCalendar } from "react-icons/fa";

const AdminDashboard = () => {
  const [section, setSection] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-12 left-0 bg-gray-900 text-white w-64 p-6 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform md:translate-x-0 md:static md:flex md:flex-col`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button
            className="text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <ul className="mt-6 space-y-4">
          <li className="cursor-pointer p-3 hover:bg-gray-700 rounded flex items-center" onClick={() => setSection("users")}>
            <FaUser className="mr-3" /> User Management
          </li>
          <li className="cursor-pointer p-3 hover:bg-gray-700 rounded flex items-center" onClick={() => setSection("vendors")}>
            <FaStore className="mr-3" /> Vendor Management
          </li>
          <li className="cursor-pointer p-3 hover:bg-gray-700 rounded flex items-center" onClick={() => setSection("privateEvents")}>
            <FaCalendarCheck className="mr-3" /> Private Events
          </li>
          <li className="cursor-pointer p-3 hover:bg-gray-700 rounded flex items-center" onClick={() => setSection("publicEvents")}>
            <FaCalendar className="mr-3" /> Public Events
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-2 md:pr-6">
        {/* Mobile Menu Button */}
        {!sidebarOpen && (
          <button className="md:hidden p-4 text-gray-900" onClick={() => setSidebarOpen(true)}>
            <FaBars size={24} />
          </button>
        )}
        {section === "users" && <UserManagement />}
        {section === "vendors" && <VendorManagement />}
        {section === "privateEvents" && <PrivateEventsApproval />}
        {section === "publicEvents" && <PublicEventApproval />}
      </div>
    </div>
  );
};

export default AdminDashboard;
