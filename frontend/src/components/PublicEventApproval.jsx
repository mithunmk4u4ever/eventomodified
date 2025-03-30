import { useState, useEffect } from "react";
import axios from "axios";

const PublicEventApproval = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");

    const adminToken = localStorage.getItem("adminToken")

    useEffect(() => {
        fetchPendingEvents();
    }, []);

    const fetchPendingEvents = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/publicEvents/pending", {
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            });
            setEvents(response.data);
        } catch (err) {
            setError("Failed to load events");
        }
    };

    const handleApproval = async (eventId, status) => {
        try {
            await axios.put(`http://localhost:5000/api/publicEvents/status/${eventId}`, { status }, {
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            });
            setEvents(events.filter(event => event._id !== eventId));
        } catch (err) {
            setError("Failed to update event status");
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Public Event Approval</h2>
            {error && <p className="text-red-500">{error}</p>}
            {events.length === 0 ? (
                <p>No pending events</p>
            ) : (
                <ul>
                    {events.map(event => (
                        <li key={event._id} className="border p-4 mb-2">
                            <p><strong>{event.event_name}</strong></p>
                            <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
                            <p>Location: {event.location}</p>
                            <p>Ticket Price: ${event.ticket_price}</p>
                            <div className="mt-2">
                                <button onClick={() => handleApproval(event._id, "approved")} className="bg-green-500 text-white px-4 py-1 mr-2 rounded">Approve</button>
                                <button onClick={() => handleApproval(event._id, "rejected")} className="bg-red-500 text-white px-4 py-1 rounded">Reject</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PublicEventApproval;
