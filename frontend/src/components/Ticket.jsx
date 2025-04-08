import React from "react";
import { useNavigate } from "react-router-dom";

const Ticket = ({ ticket, onCancel }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/ticket/${ticket._id}`, { state: { ticket } });
  };

  const isExpired = new Date(ticket.event_id.event_date) < new Date();
  return (
    <div className="relative border-2 rounded-lg p-4 w-64 shadow-lg bg-white">
      {/* Clickable heading */}
      <button
        onClick={handleNavigate}
        className="text-lg font-bold text-blue-700 hover:text-blue-900 transition transform hover:scale-105 hover:shadow-blue-300"
      >
        {ticket.event_id.event_name}
      </button>

      <p className="text-gray-600">{new Date(ticket.event_id.event_date).toDateString()}</p>

      {isExpired ? (
        <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-bold py-1 px-2 rounded-full">
          EXPIRED
        </div>
      ) : ticket.status === "Booked" ? (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold py-1 px-2 rounded-full">
          BOOKED
        </div>
      ) : ticket.status === "Cancelled" && (
        <div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-3 rounded">
          CANCELLED
        </div>
      )}



      {ticket.status === "Booked" && !isExpired && (
        <button
          className="mt-2 bg-red-500 text-white px-3 py-1 rounded w-full"
          onClick={() => onCancel(ticket._id)}
        >
          Cancel Ticket
        </button>
      )}

    </div>
  );
};

export default Ticket;

