const router=require("express").Router()
const { authenticateOrganizer, authenticateAdmin } = require("../middlewares/authMiddlewares");
const organizerController=require("../controllers/organizerController")

router.post("/register",organizerController.registerOrganizer)
router.get("/login",organizerController.loginOrganizer)
router.get("/profile", authenticateOrganizer, organizerController.getOrganizerProfile); // Organizer Profile
router.get("/", authenticateAdmin, organizerController.getAllOrganizers); // All Organizers (Admin Only)

module.exports=router