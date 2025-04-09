const mongoose = require("mongoose");

const OrganizerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, 
  phone: { type: String, required: true },
  organization_name: { type: String, required: true },
  isBlocked: { type: Boolean, default: false }, // ✅ Add this
});

const Organizer = mongoose.model("Organizer", OrganizerSchema);

module.exports = Organizer;