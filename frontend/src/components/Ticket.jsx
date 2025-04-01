import React from "react";
import axios from "axios"



const Ticket = ({ ticket,onCancel }) => {
  return (
    <div className="relative border-2 rounded-lg p-4 w-64 shadow-lg bg-white">
      <h3 className="text-lg font-bold">{ticket.event_id.event_name}</h3>
      <p className="text-gray-600">{new Date(ticket.event_id.event_date).toDateString()}</p>

      {/* Seal for Booked Tickets */}
      {ticket.status === "Booked" && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold py-1 px-2 rounded-full">
          BOOKED
        </div>
      )}

      {/* Seal for Cancelled Tickets */}
      {ticket.status === "Cancelled" && (
        <div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-3 rounded">
          CANCELLED
        </div>
      )}

      {/* Cancel Button (only for booked tickets) */}
      {ticket.status === "Booked" && (
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
