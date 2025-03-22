import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const UserHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Get username from cookies
  const Username = Cookies.get("Username") || "Guest";
  const firstLetter = Username.charAt(0);

  const handleLogout = () => {
    Cookies.remove("UserID");
    Cookies.remove("UserType");
    Cookies.remove("Username");
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="bg-blue-600 flex justify-between items-center px-6 py-4">
      {/* Hamburger Menu (Mobile) */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Navigation Links */}
      <div
        className={`absolute md:static top-16 left-0 w-full md:w-auto bg-blue-700 md:bg-transparent flex justify-center md:flex md:items-center ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col md:flex-row md:space-x-6 text-center">
          <li>
            <NavLink
              to="/home"
              className="text-white hover:text-gray-300 px-4 py-2 block"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className="text-white hover:text-gray-300 px-4 py-2 block"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </NavLink>
          </li>
        </ul>
      </div>

      {/* User Info & Logout */}
      <div className="flex items-center space-x-3">
        <div className="bg-white text-blue-600 w-8 h-8 flex items-center justify-center rounded-full text-lg font-semibold">
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

export default UserHeader;
