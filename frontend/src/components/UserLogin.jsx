import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
      console.log(data)
      localStorage.setItem("token", data.token); // Store JWT in localStorage
      localStorage.setItem("role",data.user.role);
      navigate("/"); // Redirect after login
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">User Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          className="w-full p-2 border mb-2 rounded" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          className="w-full p-2 border mb-4 rounded" 
          onChange={handleChange} 
          required 
        />
        
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>

        {/* Register & Organizer Login Links */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/user/register" className="text-blue-500 font-semibold">
              Register here
            </Link>
          </p>
          <p className="text-sm mt-2">
            Are you an organizer?{" "}
            <Link to="/organizer/auth" className="text-blue-500 font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default UserLogin;
