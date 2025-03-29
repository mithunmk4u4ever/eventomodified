const express = require("express");
const { bookTicket, cancelTicket, listUserTickets } = require("../controllers/ticketController");
const { authenticateUser } = require("../middlewares/authMiddlewares");

const router = express.Router();

// ✅ Book a Ticket (User)
router.post("/book", authenticateUser, bookTicket);

// ✅ Cancel a Ticket (User)
router.put("/cancel/:ticketId", authenticateUser, cancelTicket);

// ✅ List Tickets of a User
router.get("/my-tickets", authenticateUser, listUserTickets);

module.exports = router;
