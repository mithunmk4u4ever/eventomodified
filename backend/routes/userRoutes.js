const express=require("express")
const router=express.Router()
const { authenticateUser, authenticateAdmin } = require("../middlewares/authMiddlewares");
const userControllers=require("../controllers/userController")

router.post("/register",userControllers.registerUser)
router.post("/login",userControllers.loginUser)
router.get("/profile", authenticateUser, userControllers.getUserProfile); // Get User Profile
router.put("/profile", authenticateUser,userControllers.updateUserProfile); // Update User Profile
router.get("/", authenticateAdmin, userControllers.getAllUsers); // Get All Users (Admin Only)

module.exports=router