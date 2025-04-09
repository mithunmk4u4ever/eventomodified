import { useEffect, useState } from "react";
import axios from "axios";

const PrivateEventsApproval = () => {
  const [events, setEvents] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState({});
  const [vendors, setVendors] = useState([]);
  const [suggestedAmounts, setSuggestedAmounts] = useState({}); // eventId: amount

  useEffect(() => {
    fetchEvents();
    fetchVendors();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/privateEvents", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const fetchVendors = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/vendors", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors", error);
    }
  };

  const handleApproval = async (eventId, status) => {
    const suggested_cost = suggestedAmounts[eventId] || null;

    try {
      await axios.put(
        `http://localhost:5000/api/privateEvents/status/${eventId}`,
        { status, suggested_cost },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        }
      );
      fetchEvents();
    } catch (error) {
      console.error("Error updating event status", error);
    }
  };

  const assignVendors = async (eventId, vendorIds) => {
    try {
      await axios.put("http://localhost:5000/api/vendorAssignments/assign", {
        event_id: eventId,
        vendor_ids: vendorIds
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      fetchEvents();
    } catch (error) {
      console.error("Error assigning vendors", error);
    }
  };


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin - Private Events</h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Event Type</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Guests</th>
              <th className="border p-2">Estimate</th>
              <th className="border p-2">Suggested</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
              <th className="border p-2">Assign Vendor</th>
              <th className="border p-2">Assigned Vendors</th>

            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="border">
                <td className="border p-2">{event.event_type}</td>
                <td className="border p-2">{new Date(event.event_date).toLocaleDateString()}</td>
                <td className="border p-2">{event.event_location}</td>
                <td className="border p-2">{event.guest_count}</td>
                <td className="border p-2">₹{event.cost_estimate}</td>
                <td className="border p-2">
                  {event.event_status === "Pending" ? (
                    <input
                      type="number"
                      placeholder="Suggest ₹"
                      value={suggestedAmounts[event._id] || ""}
                      onChange={(e) =>
                        setSuggestedAmounts((prev) => ({
                          ...prev,
                          [event._id]: e.target.value,
                        }))
                      }
                      className="w-full border px-2 py-1"
                    />
                  ) : (
                    <span>₹{event.suggested_cost || "-"}</span>
                  )}
                </td>
                <td className="border p-2">{event.event_status}</td>
                <td className="border p-2">
                  {event.event_status === "Pending" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
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
                    </div>
                  )}
                </td>
                <td className="border p-2">
                  {event.event_status === "Approved" && (
                    <select
                      multiple
                      value={selectedVendors[event._id] || []}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                        setSelectedVendors(prev => ({
                          ...prev,
                          [event._id]: selected,
                        }));
                      }}
                      className="border p-1 w-full"
                    >
                      {vendors.map((vendor) => (
                        <option key={vendor._id} value={vendor._id}>
                          {vendor.vendor_name}
                        </option>
                      ))}
                    </select>


                  )}
                  <button
                    className="mt-2 bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => assignVendors(event._id, selectedVendors[event._id] || [])}
                  >
                    Assign Vendors
                  </button>


                </td>
                <td className="border p-2">
                  {event.vendor_ids?.map((id) => {
                    const vendor = vendors.find((v) => v._id === id);
                    return (
                      <span key={id} className="block text-sm">
                        {vendor?.vendor_name || "Unknown"}
                      </span>
                    );
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrivateEventsApproval;
