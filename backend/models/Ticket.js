const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: "PublicEvent", required: true },
  booking_date: { type: Date, default: Date.now },
  ticket_count: { type: Number, required: true, min: 1 },
  total_price: { type: Number, required: true },
  status: { type: String, enum: ["Booked", "Cancelled"], default: "Booked" }
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports=Ticket
