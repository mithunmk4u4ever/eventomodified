import { useEffect, useState } from "react";
import axios from "axios";

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [vendorData, setVendorData] = useState({ name: "", phone: "", service: "" });
  const [editVendor, setEditVendor] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/vendors/getvendors");
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors", error);
    }
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/vendors/add", vendorData);
      setVendorData({ name: "", phone: "", service: "" });
      fetchVendors();
    } catch (error) {
      console.error("Error adding vendor", error);
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/vendors/delete/${vendorId}`);
      fetchVendors();
    } catch (error) {
      console.error("Error deleting vendor", error);
    }
  };

  const handleEditVendor = (vendor) => {
    setEditVendor(vendor);
    setVendorData({
      name: vendor.vendor_name,
      phone: vendor.contact_details,
      service: vendor.vendor_service,
    });
  };

  const handleUpdateVendor = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/vendors/update/${editVendor._id}`, vendorData);
      setEditVendor(null);
      setVendorData({ name: "", phone: "", service: "" });
      fetchVendors();
    } catch (error) {
      console.error("Error updating vendor", error);
    }
  };

  const handleCancelEdit=()=>{
    setEditVendor(null)
    setVendorData({ name: "", phone: "", service: "" });
  }

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Vendor Management</h2>

      {/* Add or Edit Vendor Form */}
      <form onSubmit={editVendor ? handleUpdateVendor : handleAddVendor} className="bg-white p-4 shadow rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">{editVendor ? "Edit Vendor" : "Add Vendor"}</h3>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Vendor Name"
            className="w-full p-2 border rounded-lg"
            value={vendorData.name}
            onChange={(e) => setVendorData({ ...vendorData, name: e.target.value })}
            required
          />
        </div>
       
        <div className="mb-2">
          <input
            type="text"
            placeholder="Vendor Phone"
            className="w-full p-2 border rounded-lg"
            value={vendorData.phone}
            onChange={(e) => setVendorData({ ...vendorData, phone: e.target.value })}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Vendor Service"
            className="w-full p-2 border rounded-lg"
            value={vendorData.service}
            onChange={(e) => setVendorData({ ...vendorData, service: e.target.value })}
            required
          />
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            {editVendor ? "Update Vendor" : "Add Vendor"}
          </button>
          {editVendor && (
            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Vendor List */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Vendor List</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Service</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id} className="border-b">
                <td className="p-2">{vendor.vendor_name}</td>
                <td className="p-2">{vendor.contact_details}</td>
                <td className="p-2">{vendor.vendor_service}</td>
                <td className="p-2 text-center flex space-x-2">
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                    onClick={() => handleEditVendor(vendor)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    onClick={() => handleDeleteVendor(vendor._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorManagement;
