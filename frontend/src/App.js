import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CalendarFavicon from "./icon/CalendarFavicon";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegister from "./components/AdminRegister";
import UserRegister from "./components/UserRegister";
import UserLogin from "./components/UserLogin";
import Navbar from "./components/Navbar";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./components/UserProfile";
import OrganizerDashboard from "./pages/OraganizerDashboard";
import OrganizerAuth from "./components/OrganizerAuth";
import PublicEventForm from "./components/PublicEventForm";
import PublicEventApproval from "./components/PublicEventApproval";
import PaymentSuccess from "./components/PaymentSuccess";
import CreatePrivateEvent from "./components/CreatePrivateEvent";
import PrivateEventsDashboard from "./pages/PrivateEventDashboard";
import LandingPage from "./pages/LandingPage";
import UserOrders from "./pages/UserOrders";
import OrganizerProfile from "./components/OrganizerProfile";
import WeatherApp from "./components/WeatherApp";
import OrganizerCalendar from "./pages/OrganizerCalendar";
import AdminCalendar from "./pages/AdminCalendar";
import UserCalendar from "./pages/UserCalendar";
import AdminProfile from "./components/AdminProfile";

function App() {
  //  localStorage.clear()
  return (
    <div>
      <CalendarFavicon />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user/orders" element={<UserOrders />} />
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          <Route path="/organizer/auth" element={<OrganizerAuth />} />
          <Route path="/organizer/profile" element={<OrganizerProfile />} />
          <Route path="/publiceventform" element={<PublicEventForm />} />
          <Route path="/publiceventapproval" element={<PublicEventApproval />} />
          <Route path="/paymentsuccess" element={<PaymentSuccess />} />
          <Route path="/user/privateevent" element={<CreatePrivateEvent />} />
          {/* <Route path="/privateeventdash" element={<PrivateEventsDashboard />} /> */}
          <Route path="/user/calendar" element={<UserCalendar />} />
          <Route path="/organizer/calendar" element={<OrganizerCalendar />} />
          <Route path="/admin/calendar" element={<AdminCalendar />} />
          <Route path="/admin/profile" element={<AdminProfile />} />












        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
