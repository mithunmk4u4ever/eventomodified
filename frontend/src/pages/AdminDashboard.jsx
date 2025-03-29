import { useState } from "react";
import UserManagement from "../components/UserManagement";
import VendorManagement from "../components/VendorManagement";

const AdminDashboard = () => {
  const [section, setSection] = useState("users");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul>
          <li className="cursor-pointer p-2 hover:bg-gray-700" onClick={() => setSection("users")}>
            User Management
          </li>
          <li className="cursor-pointer p-2 hover:bg-gray-700" onClick={() => setSection("vendors")}>
            Vendor Management
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        {section === "users" && <UserManagement />}
        {section === "vendors" && <VendorManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
