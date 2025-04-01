const express = require("express");
const {
  createPrivateEvent,
  updatePrivateEvent,
  deletePrivateEvent,
  listPrivateEvents,
  approveCancelPrivateEvent,
  getApprovedPrivateEvents
} = require("../controllers/privateEventController");

const { authenticateUser, authenticateAdmin } = require("../middlewares/authMiddlewares");

const router = express.Router();

// ✅ Create a Private Event (User Only)
router.post("/", authenticateUser, createPrivateEvent);

// ✅ Update Private Event (User Only)
router.put("/:eventId", authenticateUser, updatePrivateEvent);

// ✅ Delete Private Event (User Only)
router.delete("/:eventId", authenticateUser, deletePrivateEvent);

// ✅ List Private Events (For Admin & Users)
router.get("/", authenticateUser, listPrivateEvents);

// ✅ Approve/Cancel Private Event (Admin Only)
router.put("/status/:eventId", authenticateAdmin, approveCancelPrivateEvent);

router.get("/approved", authenticateUser, getApprovedPrivateEvents);

// router.get("/pending", authenticateUser, getPendingPrivateEvents);

module.exports = router;
