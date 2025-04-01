import React, { useState, useEffect } from "react";
import axios from "axios";

const LandingPage = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchPublicEvents = async () => {
            try {
                const { data } = await axios.get("http://localhost:5000/api/publicEvents/approved");
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events", error);
            }
        };
        fetchPublicEvents();
    }, []);

    const handlePurchase = async (eventId) => {
        const token = localStorage.getItem("token");
        if(!token){
            return alert("Please login to book the shows!")
        }
      try {
        const ticket_count = prompt("Enter number of tickets:");
    
        if (!ticket_count || isNaN(ticket_count) || ticket_count <= 0) {
          alert("Please enter a valid number of tickets.");
          return;
        }
    
        const response = await axios.post(
          "http://localhost:5000/api/payment/pay",
          { eventId, ticket_count: Number(ticket_count) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
    
        window.location.href = response.data.url; // Redirect to Stripe checkout
      } catch (error) {
        alert("Payment failed. Please try again.");
      }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full h-[400px] flex items-center justify-center text-center bg-cover bg-center" style={{
                backgroundImage: "url('https://source.unsplash.com/1600x900/?party,event')"
            }}>
                <div className="bg-black bg-opacity-50 p-10 rounded-lg">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">Welcome to Our Events</h1>
                    <p className="text-lg text-gray-200 mt-3">Discover amazing events happening around you!</p>
                </div>
            </section>

            {/* Events Section */}
            <section className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Upcoming Public Events</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden" onClick={()=>handlePurchase(event._id)}>
                            <img
  src={event.event_image 
    ? `http://localhost:5000${event.event_image}` 
    : "https://lh5.googleusercontent.com/proxy/U47y8_8HB4T3IGrTq8aLyb7mvbHtMoRG5fgKPx1OnadMmRBGrSUbtLhKQXUE3RondLGoaq13Zn5cFIjWXyDaykiaJe_QbDFpfbEE2hz_itTaOS7alvigY8-WZA"} // Use a proper fallback image
  alt={event.event_name}
  className="w-full h-56 object-cover"
/>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-900">{event.event_name}</h3>
                                    <p className="text-gray-600 mt-2">{new Date(event.event_date).toLocaleDateString()}</p>
                                    <p className="text-gray-700 mt-1">📍 {event.location}</p>
                                    <p className="text-gray-700 mt-2 line-clamp-3">{event.description}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-700">No public events available.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
