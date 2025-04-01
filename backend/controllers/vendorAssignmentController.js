const VendorAssignment = require("../models/VendorAssignment");
const PrivateEvent=require("../models/PrivateEvent")

// ✅ Assign Vendor to a Private Event (Admin/User)
exports.assignVendor = async (req, res) => {
  try {
    const { event_id, vendor_id, service_type } = req.body;

    // Check if event exists
    const event = await PrivateEvent.findById(event_id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Create new vendor assignment
    const newAssignment = new VendorAssignment({
      event_id,
      vendor_id,
      service_type,
      assigned_by:req.adminId,
      status: "Assigned",
    });

    await newAssignment.save();
    res.status(201).json({ message: "Vendor assigned successfully", assignment: newAssignment });
  } catch (error) {
    console.error(error);
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
