const PublicEvent = require("../models/PublicEvent");

// ✅ Create Public Event (Organizer Only)
exports.createPublicEvent = async (req, res) => {
  try {
    const { event_name, event_date, location, ticket_price,capacity } = req.body;
    const organizer_id = req.organizerId; // Extracted from toke

    console.log("public event",req.file)
    

    if (!req.file) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const imagePath = `/uploads/publicevents/${req.file.filename}`;

    const newEvent = new PublicEvent({
      organizer_id,
      event_name,
      event_date,
      location,
      capacity,
      ticket_price,
      event_image: imagePath, // Save image path in DB
      status: "pending",
    });

    await newEvent.save();
    res.status(201).json({ success: true, message: "Event created, pending approval", event: newEvent });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};


// ✅ Update Public Event (Organizer Only)
exports.updatePublicEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const organizer_id = req.organizerId;

    const updatedEvent = await PublicEvent.findOneAndUpdate(
      { _id: eventId, organizer_id },
      req.body,
      { new: true }
    );

    if (!updatedEvent) return res.status(404).json({ error: "Event not found or not authorized" });

    res.json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete Public Event (Organizer Only)
exports.deletePublicEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const organizer_id = req.organizerId;

    const deletedEvent = await PublicEvent.findOneAndDelete({ _id: eventId, organizer_id });

    if (!deletedEvent) return res.status(404).json({ error: "Event not found or not authorized" });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ List Public Events (For Users - Only Approved Events)
exports.listPublicEvents = async (req, res) => {
  try {
    const events = await PublicEvent.find({ status: "approved" });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Approve/Reject Public Event (Admin Only)
exports.approveRejectEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedEvent = await PublicEvent.findByIdAndUpdate(eventId, { status }, { new: true });

    if (!updatedEvent) return res.status(404).json({ error: "Event not found" });

    res.json({ message: `Event ${status} successfully`, event: updatedEvent });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


// ✅ Get all pending public events
exports.getPendingPublicEvents = async (req, res) => {
  try {
    const pendingEvents = await PublicEvent.find({ status: "pending" }).populate("organizer_id", "name email");
    res.json(pendingEvents);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};



// Get only approved events
 exports.getApprovedPublicEvents = async (req, res) => {
  try {
    const events = await PublicEvent.find({ status: "approved" }); // Fetch approved events only
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
};












