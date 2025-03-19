import Cookies from "js-cookie";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const navigate = useNavigate();
  const currentLocation = useLocation();

  // Get username from cookies
  var Username = Cookies.get("Username") || "Guest";
  var firstLetter = Username.charAt(0);
  console.log("object")

  const handleLogout = () => {
    Cookies.remove("UserID");
    Cookies.remove("UserType");
    Cookies.remove("Username");

    navigate("/"); // Redirect to login page
  };

  return (
    <>
      <div className="header-bottom bg-gray-800 flex justify-between items-center px-4 py-3">
        {/* Left Side Navigation */}
        <div className="header-navs header-navs-left">
          <ul className="menu-nav flex flex-col md:flex-row md:space-x-6">
            <li className="menu-item">
              <NavLink
                to="/dashboard/Company"
                className="text-white hover:text-gray-300 px-4 py-2 block"
              >
                Company
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/dashboard/Client"
                className="text-white hover:text-gray-300 px-4 py-2 block"
              >
                Clients
              </NavLink>
            </li>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </ul>
        </div>

        {/* Right Side - User Info */}
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-lg font-semibold">
            {firstLetter}
          </div>
          <span className="text-white font-medium">{Username}</span>
        </div>
      </div>
    </>
  );
};

export default Header;
