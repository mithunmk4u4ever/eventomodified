import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const session_id = searchParams.get("session_id");
  const event_id = searchParams.get("event_id");
  const user_id = searchParams.get("user_id");
  const ticket_count = searchParams.get("ticket_count");
  const total_price = searchParams.get("total_price");

  console.log(session_id, event_id, user_id, ticket_count, total_price)

  useEffect(() => {
    const confirmBooking = async () => {
      if (isBookingConfirmed) return; // Prevent duplicate bookings
      
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:5000/api/tickets/confirmbooking",
          { session_id, event_id, user_id, ticket_count, total_price },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsBookingConfirmed(true);
        alert("Booking successful!");
        // Redirect to user orders page after successful booking
        setTimeout(() => {
          navigate("/user/orders");
        }, 2000);
      } catch (error) {
        setError(error.response?.data?.message || "Booking confirmation failed.");
        alert(error.response?.data?.message || "Booking confirmation failed.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session_id && event_id && user_id && ticket_count && total_price) {
      confirmBooking();
    } else {
      setError("Missing booking information");
      setIsLoading(false);
    }
  }, [session_id, event_id, user_id, ticket_count, total_price, isBookingConfirmed, navigate]);

  if (isLoading) {
    return <div className="text-center p-8">Processing your booking...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p className="mb-4">Your ticket has been booked successfully.</p>
      <p className="text-sm text-gray-600">Redirecting to your orders...</p>
    </div>
  );
};

export default PaymentSuccess;
