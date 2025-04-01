const Payment = require("../models/Payment");
const Ticket = require("../models/Ticket");
const PrivateEvent = require("../models/PrivateEvent");
const stripe = require("stripe")("sk_test_51R7CjtQLNT1d5eqJqHI5g9sCuM68XV0i4VXKKZyPdjT7prtUloiz3csicLrjp4lacQoWpdsAG0vYNK02Nyo4U2GD00XLJHjPjg");
const PublicEvent = require("../models/PublicEvent");

exports.processPayment = async (req, res) => {
  try {
    const { eventId, ticket_count } = req.body;
    const user_id = req.userId; // Extracted from auth middleware
    // Find the event
    const event = await PublicEvent.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    
    const total_price = event.ticket_price * ticket_count;

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: event.event_name },
            unit_amount: event.ticket_price * 100, // Convert to cents
          },
          quantity: ticket_count,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/paymentsuccess?session_id={CHECKOUT_SESSION_ID}&event_id=${eventId}&user_id=${user_id}&ticket_count=${ticket_count}&total_price=${total_price}`,
      cancel_url: `http://localhost:3000/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: "Payment failed", error: error.message });
  }
};




// ✅ Make Payment for Ticket
exports.makeTicketPayment = async (req, res) => {
  try {
    const { ticket_id, payment_method } = req.body;
    const user_id = req.userId;

    const ticket = await Ticket.findOne({ _id: ticket_id, user_id });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    if (ticket.status === "Cancelled") {
      return res.status(400).json({ error: "Cannot pay for a cancelled ticket" });
    }

    const payment = new Payment({
      user_id,
      payment_for: "Ticket",
      reference_id: ticket_id,
      amount: ticket.total_price,
      payment_status: "Completed",
      payment_method
    });

    await payment.save();
    res.status(201).json({ message: "Payment successful", payment });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Make Payment for Private Event
exports.makePrivateEventPayment = async (req, res) => {
  try {
    const { event_id, payment_method, amount } = req.body;
    const user_id = req.userId;

    const event = await PrivateEvent.findOne({ _id: event_id, user_id });
    if (!event) return res.status(404).json({ error: "Event not found" });

    const payment = new Payment({
      user_id,
      payment_for: "PrivateEvent",
      reference_id: event_id,
      amount,
      payment_status: "Completed",
      payment_method
    });

    await payment.save();
    res.status(201).json({ message: "Payment successful", payment });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Check Payment Status
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.refundPayment = async (req, res) => {
    try {
      const { paymentId } = req.params;
  
      // Find payment record
      const payment = await Payment.findById(paymentId);
      if (!payment) return res.status(404).json({ error: "Payment not found" });
  
      // Check if the payment is already refunded
      if (payment.payment_status === "Refunded") {
        return res.status(400).json({ error: "Payment has already been refunded" });
      }
  
      // Only completed payments can be refunded
      if (payment.payment_status !== "Completed") {
        return res.status(400).json({ error: "Only completed payments can be refunded" });
      }
  
      // Update payment status to "Refunded"
      payment.payment_status = "Refunded";
      await payment.save();
  
      // If using a payment gateway, initiate refund request here (optional)
      // Example: initiateRefund(payment)
  
      res.json({ message: "Payment refunded successfully", payment });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
