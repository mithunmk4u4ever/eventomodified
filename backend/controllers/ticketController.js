const Ticket = require("../models/Ticket");
const PublicEvent = require("../models/PublicEvent");
const stripe = require("stripe")("sk_test_51R7CjtQLNT1d5eqJqHI5g9sCuM68XV0i4VXKKZyPdjT7prtUloiz3csicLrjp4lacQoWpdsAG0vYNK02Nyo4U2GD00XLJHjPjg");


// ✅ Book a Ticket for Public Event (User)
// exports.bookTicket = async (req, res) => {
//   try {
//     const { eventId, ticket_count } = req.body;
//     const user_id = req.userId;

//     console.log("user_id",req.body);
    
//     // Check if the event exists
//     const event = await PublicEvent.findById(eventId);
//     if (!event) return res.status(404).json({ error: "Event not found" });

//     if (event.capacity < ticketsToBook) {
//       return res.status(400).json({ message: "Not enough tickets available" });
//     }

//     event.capacity -= ticket_count;
//     await event.save();

//     // Calculate total price (Assuming event has a ticket_price field)
//     const total_price = event.ticket_price * ticket_count;

//     const newTicket = new Ticket({
//       user_id,
//       event_id:eventId,
//       ticket_count,
//       total_price,
//       status: "Booked"
//     });

//     await newTicket.save();
//     res.status(201).json({ message: "Ticket booked successfully", ticket: newTicket });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// };



// exports.bookTicket = async (req, res) => {
//   try {
//     const { eventId, ticket_count } = req.body;
//     const user_id = req.userId;

//     const ticketsToBook = Number(ticket_count);

//     // Validate
//     if (!eventId || !ticketsToBook || ticketsToBook < 1) {
//       return res.status(400).json({ message: "Invalid event ID or ticket count" });
//     }

//     // Check if event exists
//     const event = await PublicEvent.findById(eventId);
//     if (!event) return res.status(404).json({ error: "Event not found" });

//     // Check capacity
//     if (event.capacity < ticketsToBook) {
//       return res.status(400).json({ message: "Not enough tickets available" });
//     }

//     // Update capacity
//     event.capacity -= ticketsToBook;
//     await event.save();

//     // Calculate total price
//     const total_price = event.ticket_price * ticketsToBook;

//     // Create ticket
//     const newTicket = new Ticket({
//       user_id,
//       event_id: eventId,
//       ticket_count: ticketsToBook,
//       total_price,
//       status: "Booked"
//     });

//     await newTicket.save();

//     res.status(201).json({ message: "Ticket booked successfully", ticket: newTicket });
//   } catch (error) {
//     console.error("Booking error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };


// ✅ Cancel a Ticket (User)
const Ticket = require("../models/Ticket");
const PublicEvent = require("../models/PublicEvent");

exports.cancelTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.userId;

    // Find and cancel the ticket
    const ticket = await Ticket.findOneAndUpdate(
      { _id: ticketId, user_id: userId, status: "Booked" },
      { status: "Cancelled" },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found or already cancelled" });
    }

    // The number of tickets being cancelled
    const cancelledSeats = ticket.ticket_count;

    // Update the event's capacity by adding the cancelled seats
    await PublicEvent.findByIdAndUpdate(ticket.event_id, {
      $inc: { capacity: cancelledSeats },
    });

    res.json({ message: "Ticket cancelled successfully", ticket });
  } catch (error) {
    console.error("Ticket cancellation error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// ✅ List Tickets of a User
exports.listUserTickets = async (req, res) => {
  try {
    const user_id = req.userId;
    const tickets = await Ticket.find({ user_id }).populate("event_id", "event_name event_date location");

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


exports.confirmBooking = async (req, res) => {
  try {
    const { session_id, event_id, user_id, ticket_count, total_price } = req.body;

    // Validate required fields
    if (!session_id || !event_id || !user_id || !ticket_count || !total_price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify payment session with Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Save ticket to database
    const newTicket = new Ticket({
      user_id,
      event_id,
      ticket_count,
      total_price,
      booking_date: new Date(),
      status: "Booked",
    });

    await newTicket.save();

    res.status(201).json({ message: "Booking confirmed", ticket: newTicket });
  } catch (error) {
    console.error("Booking confirmation error:", error);
    res.status(500).json({ message: "Booking confirmation failed", error: error.message });
  }
};






