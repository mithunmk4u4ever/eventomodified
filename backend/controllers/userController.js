const User = require("../models/User");
const upload=require("../config/profileUploadConfig")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET_KEY, { expiresIn: "1d" });
    res.json({ token, user: { name: user.name, email: user.email, phone: user.phone, role: user.role } });
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
        user.profilePicture = `/uploads/${req.file.filename}`;
      }

      Object.assign(user, req.body);
      await user.save();

      res.json({ message: "Profile updated successfully!", user });
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
