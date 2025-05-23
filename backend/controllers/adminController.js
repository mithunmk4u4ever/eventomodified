const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const PublicEvent=require("../models/PublicEvent")
const PrivateEvent=require("../models/PrivateEvent")
const upload=require("../config/multerConfig")

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

exports.updateAdminProfile=[upload.single("profilePicture"), async (req, res) => {
  try {
    const { name, phone } = req.body;
    let updateData = { name, phone };

    console.log("admindata",req.adminId)

    if (req.file) {
      profilePicture = `/uploads/profilepictures/${req.file.filename}`;
    }

    const admin = await Admin.findByIdAndUpdate(req.adminId, updateData, { new: true });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
}];

exports.consolidatedReport= async (req, res) => {
  try {
    // Fetch both types of events
    const privateEvents = await PrivateEvent.find()
      .populate("user_id", "name email")
      .populate("vendor_ids", "vendor_name");

    const publicEvents = await PublicEvent.find()
      .populate("organizer_id", "name")
     

    const allEvents = [...privateEvents, ...publicEvents];

    const totalEvents = allEvents.length;
    const approvedEvents = allEvents.filter(e => e.event_status === "Approved").length;
    const pendingEvents = allEvents.filter(e => e.event_status === "Pending").length;
    const rejectedEvents = allEvents.filter(e => e.event_status === "Rejected").length;

    // User-wise event count
    const userWiseStats = {};
    allEvents.forEach(event => {
      const userId = event.user_id?._id;
      const userName = event.user_id?.name || "Unknown";
      if (userId) {
        userWiseStats[userId] = userWiseStats[userId] || { name: userName, count: 0 };
        userWiseStats[userId].count += 1;
      }
    });

    // Vendor usage count
    const vendorUsage = {};
    allEvents.forEach(event => {
      event.vendor_ids?.forEach(vendor => {
        const vendorId = vendor._id;
        const vendorName = vendor.vendor_name || "Unknown";
        vendorUsage[vendorId] = vendorUsage[vendorId] || { name: vendorName, count: 0 };
        vendorUsage[vendorId].count += 1;
      });
    });

    // Upcoming events (date >= today)
    const today = new Date();
    const upcomingEvents = allEvents.filter(e => new Date(e.event_date) >= today);

    res.json({
      totalEvents,
      approvedEvents,
      pendingEvents,
      rejectedEvents,
      userWiseStats: Object.values(userWiseStats),
      vendorUsage: Object.values(vendorUsage),
      upcomingEvents,
    });

  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Server error while generating report" });
  }
}



