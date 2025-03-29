const router=require("express").Router()
const vendorControllers=require("../controllers/vendorControllers")
const { authenticateAdmin } = require("../middlewares/authMiddlewares");


router.post("/add",vendorControllers.createvendor)
router.get("/getvendors",vendorControllers.getAllVendors)
router.get("/getvendor/:eventId",vendorControllers.getAVendorofAPrivateEvent)
router.put("/update/:vendorId",vendorControllers.updateVendor)
router.delete("/delete/:vendorId",vendorControllers.deleteVendor)
// Get Vendor Profile (by vendor ID in query)
// router.get("/profile/:vendorId", vendorControllers.getVendorProfile);

// Get All Vendors (Admin Only)
router.get("/", authenticateAdmin, vendorControllers.getAllVendors);

module.exports = router