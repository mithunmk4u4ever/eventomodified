const Ticket = require("../models/Ticket");
const PublicEvent = require("../models/PublicEvent");

// ✅ Book a Ticket for Public Event (User)
exports.bookTicket = async (req, res) => {
  try {
    const { event_id, ticket_count } = req.body;
    const user_id = req.userId;

    // Check if the event exists
    const event = await PublicEvent.findById(event_id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Calculate total price (Assuming event has a ticket_price field)
    const total_price = event.ticket_price * ticket_count;

    const newTicket = new Ticket({
      user_id,
      event_id,
      ticket_count,
      total_price,
      status: "Booked"
    });

    await newTicket.save();
    res.status(201).json({ message: "Ticket booked successfully", ticket: newTicket });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Cancel a Ticket (User)
exports.cancelTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const user_id = req.userId;

    const ticket = await Ticket.findOneAndUpdate(
      { _id: ticketId, user_id, status: "Booked" },
      { status: "Cancelled" },
      { new: true }
    );

    if (!ticket) return res.status(404).json({ error: "Ticket not found or already cancelled" });

    res.json({ message: "Ticket cancelled successfully", ticket });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ List Tickets of a User
exports.listUserTickets = async (req, res) => {
  try {
    const user_id = req.userId;
    const tickets = await Ticket.find({ user_id }).populate("event_id", "event_name event_date");

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
