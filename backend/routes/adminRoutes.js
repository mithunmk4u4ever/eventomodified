const express = require("express");
const { registerAdmin, loginAdmin, getAdminProfile,getAllEventsForAdmin, updateAdminProfile, consolidatedReport } = require("../controllers/adminController");
const { authenticateAdmin } = require("../middlewares/authMiddlewares");

const router = express.Router();

// ✅ Admin Registration
router.post("/register", registerAdmin);

// ✅ Admin Login
router.post("/login", loginAdmin);

// ✅ Get Admin Profile (Protected)
router.get("/profile", authenticateAdmin, getAdminProfile);
router.get("/allevents", authenticateAdmin, getAllEventsForAdmin);  // Admin Calendar API
router.put("/profile",authenticateAdmin,updateAdminProfile)
router.get("/report",consolidatedReport)



module.exports = router;
