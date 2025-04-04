import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PublicEventListings = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/publicEvents/approved");
        setEvents(response.data);
      } catch (err) {
        setError("Failed to fetch events");
      }
    };
    fetchEvents();
  }, []);

  

const handlePurchase = async (eventId) => {
  try {
    const token = localStorage.getItem("token");
    const ticket_count = prompt("Enter number of tickets:");

    if (!ticket_count || isNaN(ticket_count) || ticket_count <= 0) {
      alert("Please enter a valid number of tickets.");
      return;
    }

    const response = await axios.post(
      "http://localhost:5000/api/payment/pay",
      { eventId, ticket_count: Number(ticket_count) },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    window.location.href = response.data.url; // Redirect to Stripe checkout
  } catch (error) {
    alert("Payment failed. Please try again.");
  }
};



  return (
    <div className="p-1">
      <h2 className="text-2xl font-bold mb-4">Available Events</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Event Name</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Price</th>
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
              <td className="border p-2">
                <button onClick={() => handlePurchase(event._id)} className="bg-green-500 text-white px-2 py-1 rounded">Buy Ticket</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PublicEventListings;
