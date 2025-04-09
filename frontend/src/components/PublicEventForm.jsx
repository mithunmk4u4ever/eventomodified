import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PublicEventForm = () => {
  const [formData, setFormData] = useState({
    event_name: "",
    event_date: "",
    location: "",
    capacity: "",
    ticket_price: "",
    event_image: null,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, event_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    formDataToSend.append("event_name", formData.event_name);
    formDataToSend.append("event_date", formData.event_date);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("ticket_price", Number(formData.ticket_price));
    formDataToSend.append("capacity", Number(formData.capacity));
    formDataToSend.append("event_image", formData.event_image);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/publicEvents",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        navigate("/organizer/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Event creation failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Public Event</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="event_name"
            placeholder="Event Name"
            value={formData.event_name}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="number"
            name="capacity"
            placeholder="Seating Capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
            min={1}
          />
          <input
            type="number"
            name="ticket_price"
            placeholder="Ticket Price"
            value={formData.ticket_price}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
            min={1}
          />

          {formData.event_image && (
            <img
              src={URL.createObjectURL(formData.event_image)}
              alt="Preview"
              className="w-full h-40 object-cover mb-2 rounded"
            />
          )}
          <input
            type="file"
            name="event_image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicEventForm;
