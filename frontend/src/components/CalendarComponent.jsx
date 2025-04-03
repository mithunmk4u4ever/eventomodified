import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ apiUrl }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      console.log("Fetching events from:", apiUrl);

      const { data } = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", data);

      // Convert events to calendar format
      setEvents(
        data.map((event) => {
          if (event.event_type) {
            // Private Event
            return {
              title: `${event.event_type} (Private)`,
              start: new Date(event.event_date),
              end: new Date(event.event_date),
              status: event.event_status,
              type: "private",
              location: event.event_location,
              guestCount: event.guest_count,
              costEstimate: event.cost_estimate,
            };
          } else if (event.event_name) {
            // Public Event
            return {
              title: `${event.event_name} (Public)`,
              start: new Date(event.event_date),
              end: new Date(event.event_date),
              status: event.status,
              type: "public",
              location: event.location,
              ticketPrice: event.ticket_price,
            };
          } else {
            // Booked Public Event (from Ticket schema)
            return {
              title: `Booked Event`,
              start: new Date(event.booking_date),
              end: new Date(event.booking_date),
              status: event.status,
              type: "booked",
              ticketCount: event.ticket_count,
              totalPrice: event.total_price,
            };
          }
        })
      );
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg">
      <h2 className="text-xl font-bold mb-4">Event Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default CalendarComponent;
