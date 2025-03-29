const mongoose = require("mongoose");

const vendorAssignmentSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: "PrivateEvent", required: true },
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin or User
  assigned_at: { type: Date, default: Date.now },
  notes: { type: String } // Optional field for additional details
});

module.exports = mongoose.model("VendorAssignment", vendorAssignmentSchema);
