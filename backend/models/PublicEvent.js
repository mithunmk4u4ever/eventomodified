const mongoose = require("mongoose");

const PublicEventSchema = new mongoose.Schema({
  organizer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organizer", required: true },
  event_name: { type: String, required: true },
  event_date: { type: Date, required: true },
  location: { type: String, required: true },
  ticket_price: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});

const PublicEvent = mongoose.model("PublicEvent", PublicEventSchema);

module.exports=PublicEvent
