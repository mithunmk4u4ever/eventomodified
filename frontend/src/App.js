import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CalendarFavicon from "./icon/CalendarFavicon";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegister from "./components/AdminRegister";

function App() {
 
  return (
    <div>
      <CalendarFavicon />
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
