const express = require("express");
const upload = require("../config/multerConfig");
const {
  createPublicEvent,
  updatePublicEvent,
  deletePublicEvent,
  listPublicEvents,
  approveRejectEvent,
  getPendingPublicEvents,
  getApprovedPublicEvents
} = require("../controllers/publicEventController");

const { authenticateOrganizer, authenticateAdmin } = require("../middlewares/authMiddlewares");

const router = express.Router();

// ✅ Create a Public Event (Organizer Only)
router.post("/", authenticateOrganizer, upload.single("event_image"), createPublicEvent);

// ✅ Update Public Event (Organizer Only)
router.put("/:eventId", authenticateOrganizer, updatePublicEvent);

// ✅ Delete Public Event (Organizer Only)
router.delete("/:eventId", authenticateOrganizer, deletePublicEvent);

// ✅ List Public Events (Users can view all approved events)
router.get("/", listPublicEvents);

// ✅ Approve/Reject Public Event (Admin Only)
router.put("/status/:eventId", authenticateAdmin, approveRejectEvent);

// router.put("/approve-reject/:eventId", approveRejectPublicEvent);
router.get("/pending", getPendingPublicEvents);

router.get("/approved", getApprovedPublicEvents);


module.exports = router;
