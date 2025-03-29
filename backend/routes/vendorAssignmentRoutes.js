const express = require("express");
const { assignVendor, updateVendorAssignment, removeVendorAssignment } = require("../controllers/vendorAssignmentController");
const { authenticateUser, authenticateAdmin } = require("../middlewares/authMiddlewares");

const router = express.Router();

// ✅ Assign Vendor (Admin/User)
router.post("/assign", authenticateUser, assignVendor);

// ✅ Update Assigned Vendor Details
router.put("/update/:assignmentId", authenticateUser, updateVendorAssignment);

// ✅ Remove Vendor from an Event
router.delete("/remove/:assignmentId", authenticateUser, removeVendorAssignment);

module.exports = router;
