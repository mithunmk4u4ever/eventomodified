const PrivateEvent = require("../models/PrivateEvent");

// ✅ Create Private Event (User Only)
exports.createPrivateEvent = async (req, res) => {
  try {
    const { event_type, event_date, event_location, guest_count, cost_estimate } = req.body;
    const user_id = req.userId; // Extracted from token

    const newEvent = new PrivateEvent({
      user_id,
      event_type,
      event_date,
      event_location,
      guest_count,
      cost_estimate,
      event_status: "Pending",
      created_at: new Date(),
    });

    await newEvent.save();
    res.status(201).json({ message: "Private event created, pending approval", event: newEvent });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update Private Event (User Only)
exports.updatePrivateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const user_id = req.userId;

    const updatedEvent = await PrivateEvent.findOneAndUpdate(
      { _id: eventId, user_id },
      req.body,
      { new: true }
    );

    if (!updatedEvent) return res.status(404).json({ error: "Event not found or not authorized" });

    res.json({ message: "Private event updated successfully", event: updatedEvent });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

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
exports.listPrivateEvents = async (req, res) => {
  try {
    let filter = {};
    if (req.userRole !== "admin") {
      filter = { user_id: req.userId };
    }

    const events = await PrivateEvent.find(filter);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Approve/Cancel Private Event (Admin Only)
exports.approveCancelPrivateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { event_status } = req.body; // 'Approved' or 'Cancelled'

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
