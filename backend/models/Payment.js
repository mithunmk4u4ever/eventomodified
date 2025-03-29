const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  payment_for: { type: String, enum: ["Ticket", "PrivateEvent"], required: true },
  reference_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Ticket ID or Private Event ID
  amount: { type: Number, required: true },
  payment_status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  payment_date: { type: Date, default: Date.now },
  payment_method: { type: String, enum: ["Card", "UPI", "Cash"], required: true }
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
