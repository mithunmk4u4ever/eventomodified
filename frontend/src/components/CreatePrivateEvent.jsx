import { useState } from "react";
import axios from "axios";

const CreatePrivateEvent = () => {
  const [formData, setFormData] = useState({
    event_type: "",
    event_date: "",
    event_location: "",
    guest_count: "",
    cost_estimate: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (selectedFile) {
        formDataToSend.append("eventImage", selectedFile);
      }

      const { data } = await axios.post("http://localhost:5000/api/privateEvents", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Private Event Created!");
      console.log("Event Created:", data);
    } catch (error) {
      console.error("Error creating event", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 max-w-md mx-auto rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Private Event</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Type */}
        <label className="block">
          <span className="text-gray-700">Event Type</span>
          <select
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select</option>
            <option value="Wedding">Wedding</option>
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Funeral">Funeral</option>

          </select>
        </label>

        {/* Event Date */}
        <label className="block">
          <span className="text-gray-700">Event Date</span>
          <input
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>

        {/* Event Location */}
        <label className="block">
          <span className="text-gray-700">Event Location</span>
          <input
            type="text"
            name="event_location"
            value={formData.event_location}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>

        {/* Guest Count */}
        <label className="block">
          <span className="text-gray-700">Guest Count</span>
          <input
            type="number"
            name="guest_count"
            value={formData.guest_count}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>

        {/* Cost Estimate */}
        <label className="block">
          <span className="text-gray-700">Cost Estimate</span>
          <input
            type="number"
            name="cost_estimate"
            value={formData.cost_estimate}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>

        {/* Upload Event Image */}
        <label className="block">
          <span className="text-gray-700">Event Image</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full" />
        </label>

        {/* Image Preview */}
        {preview && (
          <div className="mt-2">
            <img src={preview} alt="Preview" className="w-32 h-32 rounded-lg object-cover border" />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreatePrivateEvent;
