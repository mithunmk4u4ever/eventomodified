import React, { useState, useEffect } from "react";
import axios from "axios";
import Ticket from "../components/Ticket";

const UserOrders = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/tickets/my-tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  const handleCancel = async (ticket) => {
    console.log("ticket",ticket);
    
    // Check if event is within 24 hours
    const eventDate = new Date(ticket.event_date);
    const currentTime = new Date();
    const timeDiff = eventDate - currentTime;
    const hoursLeft = timeDiff / (1000 * 60 * 60); // Convert to hours
  
    if (hoursLeft < 24) {
      alert("Ticket cannot be cancelled as the event starts within 24 hours.");
      return;
    }
  
    // Ask for confirmation before cancelling
    const confirmCancel = window.confirm("Are you sure you want to cancel this ticket?");
    if (!confirmCancel) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/tickets/cancel/${ticket}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Update state to reflect cancelled ticket
      setTickets((prevTickets) =>
        prevTickets.map((t) =>
          t._id === ticket._id ? { ...t, status: "Cancelled" } : t
        )
      );
  
      alert("Your ticket has been cancelled. The amount will be transferred to your account after deducting cancellation charges.");
    } catch (error) {
      console.error("Error cancelling ticket", error);
    }
  };

  return (
    <div className="content-wrapper">
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">My Tickets</h2>

      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <Ticket key={ticket.ticket_id} ticket={ticket} onCancel={handleCancel} />
            
          ))}
        </div>
      ) : (
        <p className="text-gray-700">No tickets issued yet.</p>
      )}
    </div>
    </div>
  );
};

export default UserOrders;
