const express = require("express");
const { assignVendor, updateVendorAssignment, removeVendorAssignment } = require("../controllers/vendorAssignmentController");
const { authenticateUser, authenticateAdmin } = require("../middlewares/authMiddlewares");

const router = express.Router();

// ✅ Assign Vendor (Admin/User)
router.put("/assign", authenticateAdmin, assignVendor);

// ✅ Update Assigned Vendor Details
router.put("/update/:assignmentId", authenticateAdmin, updateVendorAssignment);

// ✅ Remove Vendor from an Event
router.delete("/remove/:assignmentId", authenticateAdmin, removeVendorAssignment);

module.exports = router;
