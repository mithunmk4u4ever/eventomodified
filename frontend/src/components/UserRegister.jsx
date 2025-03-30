import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "",phone:"" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", user);
      navigate("/user/login"); // Redirect to login page after registration
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-md">
        <h2 className="text-xl font-bold mb-4"> User Registration</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input type="text" name="name" placeholder="Name" className="w-full p-2 border mb-2" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="w-full p-2 border mb-2" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="w-full p-2 border mb-2" onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="phone no." className="w-full p-2 border mb-2" onChange={handleChange} required />

        <button type="submit" className="w-full bg-blue-500 text-white p-2">Register</button>
      </form>
    </div>
  );
};

export default UserRegister;
