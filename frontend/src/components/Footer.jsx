import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-semibold">Evento, The Event Pioneers</h2>
          <p className="text-sm text-gray-300">We organize dreams, one event at a time.</p>
        </div>
        <div className="space-x-6">
          <Link to="/aboutus" className="hover:text-yellow-400 transition duration-300">About Us</Link>
          <Link to="/contactus" className="hover:text-yellow-400 transition duration-300">Contact Us</Link>
        </div>
      </div>
      <div className="text-center text-gray-400 text-sm mt-4">
        &copy; {new Date().getFullYear()} Evento, The Event Pioneers. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
