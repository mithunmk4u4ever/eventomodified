import { useEffect, useState } from "react";
import axios from "axios";

const PrivateEventsApproval = () => {
  const [events, setEvents] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchVendors();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/privateEvents",{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const fetchVendors = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/vendors",{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors", error);
    }
  };

  const handleApproval = async (eventId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/privateEvents/status/${eventId}`, { status },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      fetchEvents();
    } catch (error) {
      console.error("Error updating event status", error);
    }
  };

  const assignVendor = async (event_id, vendor_id) => {
    try {
      await axios.put(`http://localhost:5000/api/vendorAssignments/assign`, {event_id, vendor_id },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      fetchEvents();
    } catch (error) {
      console.error("Error assigning vendor", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin - Private Events</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Event Type</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Guest Count</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
            <th className="border p-2">Assign Vendor</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id} className="border">
              <td className="border p-2">{event.event_type}</td>
              <td className="border p-2">{new Date(event.event_date).toLocaleDateString()}</td>
              <td className="border p-2">{event.event_location}</td>
              <td className="border p-2">{event.guest_count}</td>
              <td className="border p-2">{event.event_status}</td>
              <td className="border p-2">
                {event.event_status === "Pending" && (
                  <>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleApproval(event._id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleApproval(event._id, "Rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
              <td className="border p-2">
                {event.event_status === "Approved" && (
                  <select
                    onChange={(e) => assignVendor(event._id, e.target.value)}
                    className="border p-1"
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((vendor) => (
                      <option key={vendor._id} value={vendor._id}>{vendor.vendor_name}</option>
                    ))}
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrivateEventsApproval;
