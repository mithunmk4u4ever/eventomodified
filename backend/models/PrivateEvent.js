const mongoose = require("mongoose");

const PrivateEventSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event_type: { type: String, enum: ["Wedding", "Birthday", "Anniversary","Funeral"], required: true },
  event_date: { type: Date, required: true },
  event_location: { type: String, required: true },
  guest_count: { type: Number, required: true },
  event_image: { type: String, required: false},
  event_status: { type: String, enum: ["Pending", "Approved", "Cancelled"], default: "Pending" },
  cost_estimate: { type: Number, required: true },
  suggested_cost: { type: Number },
  vendor_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  created_at: { type: Date, default: Date.now },
});

const PrivateEvent = mongoose.model("PrivateEvent", PrivateEventSchema);

module.exports=PrivateEvent
