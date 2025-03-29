const Organizer=require("../models/Organizer")

const registerOrganizer =async (req, res) => {
    try {
      const { name, email, password, phone, organization_name } = req.body;
  
      const existingOrganizer = await Organizer.findOne({ email });
      if (existingOrganizer) return res.status(400).json({ error: "Email already in use" });
  
      const newOrganizer = new Organizer({ name, email, password, phone, organization_name });
      await newOrganizer.save();
      
      res.status(201).json({ message: "Organizer registered successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error registering organizer" });
    }
  }

  const loginOrganizer = async (req, res) => {
    try {
      const { email, password } = req.body;
      const organizer = await Organizer.findOne({ email });
  
      if (!organizer) return res.status(400).json({ error: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, organizer.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
  
      const token = jwt.sign({ organizerId: organizer._id }, "secret_key", { expiresIn: "7d" });
  
      res.json({ token, organizerId: organizer._id });
    } catch (error) {
      res.status(500).json({ error: "Error logging in organizer" });
    }
  }

  const getOrganizerProfile = async (req, res) => {
    try {
      const organizer = await Organizer.findById(req.userId).select("-password");
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

  module.exports={registerOrganizer,loginOrganizer,getOrganizerProfile,getAllOrganizers}