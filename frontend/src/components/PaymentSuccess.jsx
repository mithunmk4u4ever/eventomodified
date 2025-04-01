import { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  const event_id = searchParams.get("event_id");
  const user_id = searchParams.get("user_id");
  const ticket_count = searchParams.get("ticket_count");
  const total_price = searchParams.get("total_price");

  console.log(session_id, event_id, user_id, ticket_count, total_price)

  useEffect(() => {
    const confirmBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:5000/api/tickets/confirmbooking",
          { session_id, event_id, user_id, ticket_count, total_price },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Booking successful!");
      } catch (error) {
        alert("Booking confirmation failed.");
      }
    };

    confirmBooking();
  }, []);

  return <h1>Payment Successful! Your ticket is booked.</h1>;
};

export default PaymentSuccess;
