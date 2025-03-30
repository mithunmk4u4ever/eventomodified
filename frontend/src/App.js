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

function App() {
//  localStorage.clear()
  return (
    <div>
      <CalendarFavicon />
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          <Route path="/organizer/auth" element={<OrganizerAuth />} />
          <Route path="/publiceventform" element={<PublicEventForm />} />
          <Route path="/publiceventapproval" element={<PublicEventApproval />} />








        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
