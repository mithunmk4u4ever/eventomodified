import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, Home, LogIn, LogOut } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false); // Update state
    window.location.reload(); // Optional: Refresh page
  };

  return (
    <nav className="bg-gray-900 text-white">
      {/* Desktop Navbar */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
          Evento
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-gray-400">Home</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hover:text-gray-400">Profile</Link>
                <button onClick={handleLogout} className="hover:text-gray-400">Logout</button>
              </>
            ) : (
              <Link to="/user/login" className="hover:text-gray-400">Login</Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navbar (Bottom) */}
      <div className={`fixed bottom-0 left-0 w-full bg-gray-900 text-white p-3 flex justify-around md:hidden transition-all duration-300 ${isOpen ? "block" : "hidden"}`}>
        <Link to="/" className="flex flex-col items-center"><Home size={24} /><span>Home</span></Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="flex flex-col items-center"><User size={24} /><span>Profile</span></Link>
            <button onClick={handleLogout} className="flex flex-col items-center">
              <LogOut size={24} /><span>Logout</span>
            </button>
          </>
        ) : (
          <Link to="/user/login" className="flex flex-col items-center"><LogIn size={24} /><span>Login</span></Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
