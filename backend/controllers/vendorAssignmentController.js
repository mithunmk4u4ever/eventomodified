const VendorAssignment = require("../models/VendorAssignment");
const PrivateEvent=require("../models/PrivateEvent")

// ✅ Assign Vendor to a Private Event (Admin/User)
// PUT /api/privateEvents/assign-vendors
exports.assignVendors=async (req, res) => {
  try {
    const { event_id, vendor_ids } = req.body;

    if (!Array.isArray(vendor_ids)) {
      return res.status(400).json({ message: "vendor_ids must be an array" });
    }

    const event = await PrivateEvent.findById(event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Merge vendor_ids into existing ones without duplicates
    const uniqueVendorIds = Array.from(new Set([
      ...(event.vendor_ids || []).map(id => id.toString()),
      ...vendor_ids
    ]));

    event.vendor_ids = uniqueVendorIds;

    await event.save();

    return res.status(200).json({ message: "Vendors assigned successfully", event });
  } catch (error) {
    console.error("Error assigning vendors:", error);
    return res.status(500).json({ message: "Server error" });
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
