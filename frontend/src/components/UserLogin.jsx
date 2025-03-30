import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/users/login", credentials);
      localStorage.setItem("token", data.token); // Store JWT in localStorage
      navigate("/user/dashboard"); // Redirect after login
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-md">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input type="email" name="email" placeholder="Email" className="w-full p-2 border mb-2" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="w-full p-2 border mb-2" onChange={handleChange} required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2">Login</button>
      </form>
    </div>
  );
};

export default UserLogin;
