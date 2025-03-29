const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  vendor_name: { type: String, required: true },
  vendor_service: { type: String, required: true }, // Example: Catering, Music, etc.
  contact_details: { type: String, required: true },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: "PrivateEvent" },
});

const Vendor = mongoose.model("Vendor", VendorSchema);

module.exports = Vendor;
