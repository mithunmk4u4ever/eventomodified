const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const PublicEvent=require("../models/PublicEvent")
const PrivateEvent=require("../models/PrivateEvent")

const JWT_SECRET_KEY="jwtSecretKey"

// ✅ Admin Registration
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).json({ message: "Admin already exists" });

    admin = new Admin({ name, email, password });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ adminId: admin._id, role: "admin" }, JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Login successful", token,role:"admin" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllEventsForAdmin = async (req, res) => {
  try {
    const privateEvents = await PrivateEvent.find(); // Fetch all events (public & private)
    const publicEvents=await PublicEvent.find()
    const events=[...privateEvents,...publicEvents]

    
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching events for admin" });
  }
};
