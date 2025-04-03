const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  isBlocked: { type: Boolean, default: false } // Add this field
});

const User = mongoose.model("User", UserSchema);

module.exports = User;