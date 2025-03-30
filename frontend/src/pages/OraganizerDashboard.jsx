import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Event Name</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id} className="text-center">
              <td className="border p-2">{event.event_name}</td>
              <td className="border p-2">{new Date(event.event_date).toLocaleDateString()}</td>
              <td className="border p-2">{event.location}</td>
              <td className="border p-2">${event.ticket_price}</td>
              <td className={`border p-2 ${event.status === "approved" ? "text-green-500" : event.status === "rejected" ? "text-red-500" : "text-yellow-500"}`}>
                {event.status}
              </td>
              <td className="border p-2">
                <button onClick={() => handleEdit(event._id)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(event._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrganizerDashboard;
