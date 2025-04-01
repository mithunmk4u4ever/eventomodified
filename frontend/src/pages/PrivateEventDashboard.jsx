import { useEffect, useState } from "react";
import axios from "axios";

const PrivateEventsDashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/privateEvents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">My Private Events</h2>
      {events.length === 0 ? (
        <p>No private events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-lg font-semibold">{event.event_type}</h3>
              <p><strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {event.event_location}</p>
              <p><strong>Guests:</strong> {event.guest_count}</p>
              <p className="font-semibold">Status: <span className={
                event.event_status === "Pending" ? "text-yellow-500" :
                event.event_status === "Approved" ? "text-green-500" : "text-red-500"
              }>{event.event_status}</span></p>
              {event.image && <img src={`http://localhost:5000${event.image}`} alt="Event" className="w-full h-32 object-cover mt-2 rounded-lg" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrivateEventsDashboard;
