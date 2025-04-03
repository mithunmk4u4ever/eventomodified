const router=require("express").Router()
const { authenticateOrganizer, authenticateAdmin } = require("../middlewares/authMiddlewares");
const organizerController=require("../controllers/organizerController")

router.post("/register",organizerController.registerOrganizer)
router.post("/login",organizerController.loginOrganizer)
router.get("/profile", authenticateOrganizer, organizerController.getOrganizerProfile); // Organizer Profile
router.get("/", authenticateAdmin, organizerController.getAllOrganizers); // All Organizers (Admin Only)
router.get("/events", authenticateOrganizer,organizerController.getOrganizerEvents);
router.put("/update-profile", authenticateOrganizer, organizerController.updateOrganizerProfile); 


module.exports=router