import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    event_name: "",
    event_date: "",
    location: "",
    ticket_price: "",
    capacity: "",
    event_image: "", // old image URL
  });

  const [newImage, setNewImage] = useState(null); // new image file (if uploaded)
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/publicEvents/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setEventData({
          event_name: data.event_name,
          event_date: data.event_date.split("T")[0],
          location: data.location,
          ticket_price: data.ticket_price,
          capacity: data.capacity,
          event_image: data.event_image || "",
        });
      } catch (err) {
        setError("Failed to fetch event data");
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleCancel = () => {
    navigate(-1); // go back to previous page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("event_name", eventData.event_name);
      formData.append("event_date", eventData.event_date);
      formData.append("location", eventData.location);
      formData.append("ticket_price", eventData.ticket_price);
      formData.append("capacity", eventData.capacity);

      if (newImage) {
        formData.append("event_image", newImage);
      }

      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/publicEvents/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/organizer/dashboard");
    } catch (err) {
      setError("Failed to update event");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Event</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Name */}
        <input
          type="text"
          name="event_name"
          value={eventData.event_name}
          onChange={handleChange}
          placeholder="Event Name"
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Date */}
        <input
          type="date"
          name="event_date"
          value={eventData.event_date}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Location */}
        <input
          type="text"
          name="location"
          value={eventData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Ticket Price */}
        <input
          type="number"
          name="ticket_price"
          value={eventData.ticket_price}
          onChange={handleChange}
          placeholder="Ticket Price"
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Capacity */}
        <input
          type="number"
          name="capacity"
          value={eventData.capacity}
          onChange={handleChange}
          placeholder="Capacity"
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Existing Image Preview */}
        {eventData.event_image && (
          <div>
            <p className="text-sm text-gray-600">Current Image:</p>
            <img
              src={`http://localhost:5000/${eventData.event_image}`}
              alt="Event"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}

        {/* Upload New Image */}
        <div>
          <label className="block font-medium">Change Event Image (optional)</label>
          <input
            type="file"
            name="event_image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Event
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
