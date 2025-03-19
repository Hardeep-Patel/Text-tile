import Cookies from "js-cookie";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Get username from cookies
  var Username = Cookies.get("Username") || "Guest";
  var firstLetter = Username.charAt(0);

  const handleLogout = () => {
    Cookies.remove("UserID");
    Cookies.remove("UserType");
    Cookies.remove("Username");
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="bg-gray-800 flex justify-between items-center px-6 py-4">
      {/* Left Side - Hamburger Menu (Mobile Only) */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Center - Navigation Menu */}
      <div
        className={`absolute md:static top-16 left-0 w-full md:w-auto bg-gray-900 md:bg-transparent flex justify-center md:flex md:items-center ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col md:flex-row md:space-x-6 text-center">
          <li className="menu-item">
            <NavLink
              to="/dashboard/Company"
              className="text-white hover:text-gray-300 px-4 py-2 block"
              onClick={() => setMenuOpen(false)}
            >
              Company
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink
              to="/dashboard/Client"
              className="text-white hover:text-gray-300 px-4 py-2 block"
              onClick={() => setMenuOpen(false)}
            >
              Clients
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Right Side - User Info & Logout Button */}
      <div className="flex items-center space-x-3">
        <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-lg font-semibold">
          {firstLetter}
        </div>
        <span className="text-white font-medium hidden md:block">{Username}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
