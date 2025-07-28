import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaUserCircle, FaCog, FaEdit, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="text-gray-800 font-sans">
      {/* Navbar/Header */}
      <header className="flex justify-between items-center px-8 py-4 shadow-md bg-white sticky top-0 z-50">
        {/* Logo - Left */}
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <img 
            src="../public/edusyncnav.png"  
            alt="EduSync Logo"  
            className="w-32"  
          />
        </Link>

        {/* Centered Navigation */}
        <nav className="absolute left-1/2 transform -translate-x-1/2 flex space-x-8 font-sans font-extrabold">
          {[
            { name: 'Marketplace', path: '/marketplace' },
            { name: 'Housing', path: '/housing' },
            { name: 'Tutoring', path: '/tutoring' },
            { name: 'Jobs', path: '/jobs' },
            { name: 'Campus Info', path: '/campus-info' }
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-gray-600 hover:text-[#5A3FF4] transition-colors duration-200 font-medium whitespace-nowrap"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-6">
          {/* Notification Icon */}
          <button className="relative text-gray-600 hover:text-[#5038bd] transition-colors">
            <FaBell className="text-xl" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-gray-600 hover:text-[#5A3FF4] transition-colors"
            >
              <FaUserCircle className="text-2xl" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/edit-profile"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <FaEdit className="mr-2 " />
                  Edit Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <FaCog className="mr-2" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    // Add logout logic here
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;