const User = require("../models/User");
const upload=require("../config/multerConfig")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Ticket = require("../models/Ticket");
const PrivateEvent=require("../models/PrivateEvent")
const JWT_SECRET_KEY="jwtSecretKey"

// ✅ Register User
exports.registerUser =  async (req, res) => {
    try {
      const user = await User.findById(req.user.id); // Assuming user is authenticated
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.profilePicture = `/uploads/${req.file.filename}`; // Save file path
      await user.save();
  
      res.json({ message: "Profile picture updated successfully", profilePicture: user.profilePicture });
    } catch (error) {
      res.status(500).json({ message: "Error uploading profile picture", error });
    }
  }

// ✅ Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    if (user.isBlocked) return res.status(403).json({ error: "Your account is blocked" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET_KEY, { expiresIn: "1d" });
    res.json({ token, user: { name: user.name, email: user.email, phone: user.phone, role: "user" } });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

// ✅ Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    // console.log("userprofile",req.userId, req.role);
    
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user profile" });
  }
};

// ✅ Update User Profile
// exports.updateUserProfile = async (req, res) =>upload.single("profilePicture"), async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     console.log("update user",user)
//     if (!user) return res.status(404).json({ error: "User not found" });

//     Object.assign(user, req.body);
//     await user.save();

//     res.json({ message: "Profile updated successfully!", user });
//   } catch (error) {
//     res.status(500).json({ error: "Error updating profile" });
//   }
// };
exports.updateUserProfile = [
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      console.log("Update user", user);

      if (!user) return res.status(404).json({ error: "User not found" });

      // If a new profile picture was uploaded, update the user document
      if (req.file) {
        user.profilePicture = `/uploads/profilepictures/${req.file.filename}`;
      }

      Object.assign(user, req.body);
      await user.save();

      res.json({ message: "Profile updated successfully!", profilePicture: user.profilePicture, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating profile" });
    }
  },
];



// ✅ Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.role !== "admin") return res.status(403).json({ error: "Admin access required" });

    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};




exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

exports.getUserEvents = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch events where the user is an attendee (approved public events)
    const bookedEvents = await Ticket.find({
      user_id: userId,
     
    });

    // Fetch private events created by the user (even if not approved)
    const privateEvents = await PrivateEvent.find({
      user_id: userId,
    });

    // Combine both event lists
    const userEvents = [...bookedEvents, ...privateEvents];

    res.json(userEvents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user events" });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    console.log("block user req received",user)
    
    user.isBlocked = !user.isBlocked; // Toggle block status
    await user.save();
    res.json({ message: `User ${user.isBlocked ? "Blocked" : "Unblocked"} successfully!` });
  } catch (error) {
    res.status(500).json({ error: "Error updating user status" });
  }
};