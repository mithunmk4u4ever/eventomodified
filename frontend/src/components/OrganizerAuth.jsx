import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrganizerAuth = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    organization_name: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? "http://localhost:5000/api/organizers/login" : "http://localhost:5000/api/organizers/register";
      const response = await axios.post(url, formData);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        navigate("/organizer/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">{isLogin ? "Organizer Login" : "Organizer Registration"}</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
              <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
              <input type="text" name="organization_name" placeholder="Organization Name" value={formData.organization_name} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
            </>
          )}
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">{isLogin ? "Login" : "Register"}</button>
        </form>
        <p className="text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"} 
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 underline ml-1">{isLogin ? "Register" : "Login"}</button>
        </p>
      </div>
    </div>
  );
};

export default OrganizerAuth;