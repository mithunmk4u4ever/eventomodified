const mongoose = require("mongoose");

const publicEventSchema = new mongoose.Schema({
  organizer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organizer", required: true },
  event_name: { type: String, required: true },
  event_date: { type: Date, required: true },
  location: { type: String, required: true },
  ticket_price: { type: Number, required: true },
  event_image: { type: String }, 
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});

const PublicEvent = mongoose.model("PublicEvent", publicEventSchema);
module.exports = PublicEvent;
