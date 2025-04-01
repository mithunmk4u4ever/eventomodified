const PrivateEvent = require("../models/PrivateEvent");
const upload=require("../config/multerConfig")

// ✅ Create Private Event (User Only)
exports.createPrivateEvent = [
  upload.single("eventImage"),
  async (req, res) => {
    try {
      const { event_type, event_date, event_location, guest_count, cost_estimate } = req.body;
      const user_id = req.userId; // Extracted from token
      console.log("private",req.userId);
      
      const eventImage = req.file ? `/uploads/privateevents/${req.file.filename}` : null;

      const newEvent = new PrivateEvent({
        user_id,
        event_type,
        event_date,
        event_location,
        guest_count,
        cost_estimate,
        event_image: eventImage,
        event_status: "Pending",
        created_at: new Date(),
      });

      await newEvent.save();
      res.status(201).json({ message: "Private event created, pending approval", event: newEvent });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },
];

// ✅ Update Private Event (User Only)
exports.updatePrivateEvent = [
  upload.single("eventImage"),
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const user_id = req.userId;

      let updateData = { ...req.body };

      if (req.file) {
        updateData.event_image = `/uploads/privateevents/${req.file.filename}`;
      }

      const updatedEvent = await PrivateEvent.findOneAndUpdate(
        { _id: eventId, user_id },
        updateData,
        { new: true }
      );

      if (!updatedEvent) return res.status(404).json({ error: "Event not found or not authorized" });

      res.json({ message: "Private event updated successfully", event: updatedEvent });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },
];

// ✅ Delete Private Event (User Only)
exports.deletePrivateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const user_id = req.userId;

    const deletedEvent = await PrivateEvent.findOneAndDelete({ _id: eventId, user_id });

    if (!deletedEvent) return res.status(404).json({ error: "Event not found or not authorized" });

    res.json({ message: "Private event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ List Private Events (For Admin & Users)
// exports.listPrivateEvents = async (req, res) => {
//   try {
//     let filter = {};
//     if (req.userRole !== "admin") {
//       filter = { user_id: req.userId };
//     }

//     const events = await PrivateEvent.find(filter);
//     res.json(events);
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// };

exports.listPrivateEvents = async (req, res) => {
  try {
    if (req.role === "admin") {
      // Admin: Fetch all events for approval
      const events = await PrivateEvent.find().populate("user_id", "name email");
      return res.json(events);
    } else {
      // User: Fetch only their own events
      const events = await PrivateEvent.find({ user_id: req.user._id });
      return res.json(events);
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


// ✅ Approve/Cancel Private Event (Admin Only)
exports.approveCancelPrivateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event_status = req.body.status; // 'Approved' or 'Cancelled'

    if (!["Approved", "Cancelled"].includes(event_status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedEvent = await PrivateEvent.findByIdAndUpdate(eventId, { event_status }, { new: true });

    if (!updatedEvent) return res.status(404).json({ error: "Event not found" });

    res.json({ message: `Private event ${event_status} successfully`, event: updatedEvent });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getApprovedPrivateEvents = async (req, res) => {
  try {
    const userId = req.userId; // Get user ID from authenticated request

    const approvedEvents = await PrivateEvent.find({
      user_id: userId,
      event_status: "Approved", // Only approved events
    });

    res.json(approvedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
