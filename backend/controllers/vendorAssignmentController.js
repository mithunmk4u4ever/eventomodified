const VendorAssignment = require("../models/VendorAssignment");

// ✅ Assign Vendor to a Private Event (Admin/User)
exports.assignVendor = async (req, res) => {
  try {
    const { event_id, vendor_id, notes } = req.body;

    // Check if the vendor is already assigned
    const existingAssignment = await VendorAssignment.findOne({ event_id, vendor_id });
    if (existingAssignment) return res.status(400).json({ error: "Vendor already assigned to this event" });

    const assignment = new VendorAssignment({
      event_id,
      vendor_id,
      assigned_by: req.userId, // Admin/User assigning the vendor
      notes
    });

    await assignment.save();
    res.status(201).json({ message: "Vendor assigned successfully", assignment });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update Assigned Vendor Details
exports.updateVendorAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { notes } = req.body;

    const assignment = await VendorAssignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    assignment.notes = notes || assignment.notes;
    await assignment.save();

    res.json({ message: "Vendor assignment updated successfully", assignment });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Remove Vendor from an Event
exports.removeVendorAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await VendorAssignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    await assignment.deleteOne();
    res.json({ message: "Vendor removed from event successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
