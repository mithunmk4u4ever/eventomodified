const Organizer = require("../models/Organizer")
const PublicEvent = require("../models/PublicEvent")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JWT_SECRET_KEY = "jwtSecretKey"


const registerOrganizer = async (req, res) => {
  try {
    const { name, email, password, phone, organization_name } = req.body;

    console.log("orgreg", req.body);


    const existingOrganizer = await Organizer.findOne({ email });
    if (existingOrganizer) return res.status(400).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOrganizer = new Organizer({ name, email, password: hashedPassword, phone, organization_name });
    await newOrganizer.save();

    res.status(201).json({ success: true, message: "Organizer registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering organizer" });
  }
}

const loginOrganizer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const organizer = await Organizer.findOne({ email });

    if (!organizer) return res.status(400).json({ error: "Invalid credentials" });

    if (organizer.isBlocked) {
      return res.status(403).json({ success: false, blocked: true, message: "Organizer has been blocked by admin" });
    }

    const isMatch = await bcrypt.compare(password, organizer.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ organizerId: organizer._id, role: "organizer" }, JWT_SECRET_KEY, { expiresIn: "7d" });

    res.json({ success: true, token, organizerId: organizer._id, role: "organizer" });
  } catch (error) {
    res.status(500).json({ error: "Error logging in organizer" });
  }
}

const getOrganizerProfile = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.organizerId).select("-password");
    if (!organizer) return res.status(404).json({ error: "Organizer not found" });

    res.json(organizer);
  } catch (error) {
    res.status(500).json({ error: "Error fetching organizer profile" });
  }
};

// ✅ Get All Organizers (Admin Only)
const getAllOrganizers = async (req, res) => {
  try {
    if (req.role !== "admin") return res.status(403).json({ error: "Admin access required" });

    const organizers = await Organizer.find().select("-password");
    res.json(organizers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching organizers" });
  }
};

const getOrganizerEvents = async (req, res) => {
  try {
    const organizerId = req.organizerId; // Extracted from token
    console.log("getallorgevents", organizerId);

    const events = await PublicEvent.find({ organizer_id: organizerId });

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const updateOrganizerProfile = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.organizerId);
    if (!organizer) return res.status(404).json({ error: "Organizer not found" });

    // Update fields if provided
    organizer.name = req.body.name || organizer.name;
    organizer.email = req.body.email || organizer.email;
    organizer.contact = req.body.contact || organizer.contact;

    await organizer.save();
    res.json({ message: "Profile updated successfully", organizer });
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
};

const deleteOrganizer = async (req, res) => {
  try {
    const organizer = await Organizer.findByIdAndDelete(req.params.id);
    if (!organizer) return res.status(404).json({ error: "Organizer not found" });

    res.json({ message: "Organizer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting organizer" });
  }
}

const handleBlockUnblockOrganizer=async(req,res)=>{
  try {
    console.log("blockorganizer",req.params.id);
    
    const organizer = await Organizer.findById(req.params.id);
    if (!organizer) return res.status(404).json({ message: "Organizer not found" });

    organizer.isBlocked = !organizer.isBlocked;
    await organizer.save();

    res.json({ message: `Organizer has been ${organizer.isBlocked ? "blocked" : "unblocked"}` });
  } catch (error) {
    res.status(500).json({ message: "Error updating organizer status" });
  }
};



module.exports = {
  registerOrganizer,
  loginOrganizer,
  getOrganizerProfile,
  getAllOrganizers,
  getOrganizerEvents,
  updateOrganizerProfile,
  deleteOrganizer,
  handleBlockUnblockOrganizer
}