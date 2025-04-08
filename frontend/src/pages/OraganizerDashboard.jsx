import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/organizers/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (err) {
        setError("Failed to fetch events");
      }
    };
    fetchEvents();
  }, []);

  const handleEdit = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleDelete = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/organizers/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((event) => event._id !== eventId));
    } catch (err) {
      setError("Failed to delete event");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Organizer Dashboard</h2>

      <Link to={"/publiceventform"} class="inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
        <span class="w-80 inline-flex justify-center">Create An Event!</span>
      </Link>

      {error && <p className="text-red-500">{error}</p>}
      <div className="w-full overflow-x-auto">
  <table className="w-full max-w-[100vw] table-fixed border-collapse border border-gray-300 text-sm">
    <thead>
      <tr className="bg-gray-200">
        <th className="border p-1 break-words">Event Name</th>
        <th className="border p-1 break-words">Date</th>
        <th className="border p-1 break-words">Location</th>
        <th className="border p-1 break-words">Price</th>
        <th className="border p-1 break-words">Status</th>
        <th className="border p-1 break-words">Actions</th>
      </tr>
    </thead>
    <tbody>
      {events.map((event) => (
        <tr key={event._id} className="text-center">
          <td className="border p-1 break-words">{event.event_name}</td>
          <td className="border p-1 break-words">{new Date(event.event_date).toLocaleDateString()}</td>
          <td className="border p-1 break-words">{event.location}</td>
          <td className="border p-1 break-words">${event.ticket_price}</td>
          <td
            className={`border p-1 break-words ${
              event.status === "approved"
                ? "text-green-500"
                : event.status === "rejected"
                ? "text-red-500"
                : "text-yellow-500"
            }`}
          >
            {event.status}
          </td>
          <td className="border p-1">
            <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
              <button
                onClick={() => handleEdit(event._id)}
                className="bg-blue-500 text-white px-2 py-1 rounded w-full md:w-auto"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="bg-red-500 text-white px-2 py-1 rounded w-full md:w-auto"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


    </div>
  );
};

export default OrganizerDashboard;
