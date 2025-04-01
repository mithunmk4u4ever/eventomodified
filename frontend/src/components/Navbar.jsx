import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Home, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import "./Navbar.css";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token") || !!localStorage.getItem("adminToken"));
  const location = useLocation(); // Detects route changes

  useEffect(() => {
    // Check authentication status on page load and when route changes
    setIsAuthenticated(!!localStorage.getItem("token") || !!localStorage.getItem("adminToken"));
  }, [location]); // Runs every time the route changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    window.location.reload();
  };

  const role = localStorage.getItem("role"); // Get role from localStorage

  // Define routes based on role
  let profileRoute = "/user/profile"; // Default to user profile
  let dashboardRoute = "/user/dashboard"; // Default to user dashboard
  let loginRoute = "/user/login";

  if (role === "admin") {
    profileRoute = "/admin/profile";
    dashboardRoute = "/admin/dashboard";
    loginRoute = "/admin/login";
  } // Redirect admin
  if (role === "organizer") {
    profileRoute = "/organizer/profile";
    dashboardRoute = "/organizer/dashboard";
    loginRoute = "/organizer/auth";
  } // Redirect organizer

  return (
    <nav className="bg-gray-900 text-white" style={{ position: "sticky", top: 0, zIndex: 1000 }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">Evento</Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-gray-400">Home</Link>
            
            {isAuthenticated ? (
              <>
                <Link to={dashboardRoute} className="hover:text-gray-400">Dashboard</Link>
                <Link to={profileRoute} className="hover:text-gray-400">Profile</Link>
                <button onClick={handleLogout} className="hover:text-gray-400">Logout</button>
              </>
            ) : (
              <Link to={loginRoute} className="hover:text-gray-400">Login</Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navbar (Bottom) */}
      <div className="fixed-bottom-navbar">
      <div className={`fixed bottom-0 left-0 w-full bg-gray-900 text-white p-3 flex justify-around md:hidden transition-all duration-300 ${isOpen ? "block" : "hidden"}`}>
        <Link to="/" className="flex flex-col items-center"><Home size={24} /><span>Home</span></Link>
        {isAuthenticated ? (
          <>
            <Link to={dashboardRoute} className="flex flex-col items-center"><LayoutDashboard size={24} /><span>Dashboard</span></Link>
            <Link to={profileRoute} className="flex flex-col items-center"><User size={24} /><span>Profile</span></Link>
            <button onClick={handleLogout} className="flex flex-col items-center">
              <LogOut size={24} /><span>Logout</span>
            </button>
          </>
        ) : (
          <Link to={loginRoute} className="flex flex-col items-center"><LogIn size={24} /><span>Login</span></Link>
        )}
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
