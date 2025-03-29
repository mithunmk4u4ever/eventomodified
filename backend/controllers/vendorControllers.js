const Vendor=require("../models/Vendor")

const createvendor=async (req, res) => {
    try {
      const { name,email,phone,service, event_id } = req.body;

      console.log("vendor",req.body);
      
  
      const newVendor = new Vendor({
        vendor_name:name,
        vendor_service:service,
        contact_details:phone,
        event_id,
      });
  
      await newVendor.save();
      res.status(201).json({ message: "Vendor added successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error adding vendor" });
    }
  }

  const getAllVendors=async (req, res) => {
    try {
      const vendors = await Vendor.find().populate("event_id", "event_type event_date event_location");
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ error: "Error fetching vendors" });
    }
  }

  const getAVendorofAPrivateEvent=async (req, res) => {
    try {
      const vendors = await Vendor.find({ event_id: req.params.eventId });
      res.json(vendors);
    } catch (error) { 
      res.status(500).json({ error: "Error fetching vendors for the event" });
    }
  }

  const updateVendor=async (req, res) => {
    try {
      const { name,email,phone,service, } = req.body;
      await Vendor.findByIdAndUpdate(req.params.vendor_id, { vendor_name:name, vendor_service:service, contact_details:phone });
      res.json({ message: "Vendor details updated" });
    } catch (error) {
      res.status(500).json({ error: "Error updating vendor details" });
    }
  }


  
  // ✅ 5. Delete a Vendor
  const deleteVendor= async (req, res) => {
    try {
      await Vendor.findByIdAndDelete(req.params.vendorId);
      res.json({ message: "Vendor deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting vendor" });
    }
  }

//   const getVendorProfile = async (req, res) => {
//     try {
//       const { vendorId } = req.params;
//       const vendor = await Vendor.findById(vendorId).select("-password");
      
//       if (!vendor) return res.status(404).json({ error: "Vendor not found" });
  
//       res.json(vendor);
//     } catch (error) {
//       res.status(500).json({ error: "Server error" });
//     }
//   };
  
  // ✅ Get All Vendors (Admin Only)
  exports.getAllVendors = async (req, res) => {
    try {
      const vendors = await Vendor.find().select("-password");
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  module.exports={createvendor,getAllVendors,getAVendorofAPrivateEvent,updateVendor,deleteVendor}