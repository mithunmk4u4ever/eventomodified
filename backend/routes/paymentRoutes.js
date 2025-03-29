const express = require("express");
const { makeTicketPayment, makePrivateEventPayment, checkPaymentStatus,refundPayment } = require("../controllers/paymentController");
const { authenticateUser,authenticateAdmin } = require("../middlewares/authMiddlewares");

const router = express.Router();

// ✅ Make Payment for Ticket
router.post("/ticket", authenticateUser, makeTicketPayment);

// ✅ Make Payment for Private Event
router.post("/private-event", authenticateUser, makePrivateEventPayment);

// ✅ Check Payment Status
router.get("/:paymentId", authenticateUser, checkPaymentStatus);

// ✅ Refund Payment (Admin Only)
router.put("/refund/:paymentId", authenticateAdmin, refundPayment);

module.exports = router;
