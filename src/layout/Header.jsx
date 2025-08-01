import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaCog, FaEdit, FaSignOutAlt, FaUser, FaChartBar, FaHeart, FaShoppingBag } from 'react-icons/fa';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for auth state changes triggered by other components
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('authStateChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        // Verify token with backend
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear storage
          handleLogout();
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        // If server is down, still show user as logged in based on stored data
        // but they'll need to re-authenticate when making API calls
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Optional: Call logout endpoint
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      setIsDropdownOpen(false);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('authStateChanged'));
      
      // Redirect to home page
      navigate('/');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

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

        {/* Right Side */}
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              {/* Notification Icon - Only shown when authenticated */}
              <button className="relative text-gray-600 hover:text-[#5038bd] transition-colors">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Profile Dropdown - Only shown when authenticated */}
              <div className="relative user-dropdown">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 group"
                  title={user?.name || 'User Profile'}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#5A3FF4] to-[#6B4EFF] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">
                      {user?.name || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.email || 'user@example.com'}
                    </div>
                  </div>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Enhanced Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100 backdrop-blur-sm">
                    {/* User Info Header */}
                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#5A3FF4] to-[#6B4EFF] rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{user?.name || 'User'}</p>
                          <p className="text-sm text-gray-600">{user?.email || 'user@example.com'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="px-6 py-3 border-b border-gray-100">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">12</div>
                          <div className="text-xs text-gray-600">Saved</div>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">5</div>
                          <div className="text-xs text-gray-600">Listed</div>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">8</div>
                          <div className="text-xs text-gray-600">Sold</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-indigo-200 transition-colors">
                          <FaChartBar className="text-indigo-600" size={14} />
                        </div>
                        <div>
                          <div className="font-medium">Dashboard</div>
                          <div className="text-xs text-gray-500">View your activity</div>
                        </div>
                      </Link>
                      
                      <Link
                        to="/profile"
                        className="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                          <FaUser className="text-green-600" size={14} />
                        </div>
                        <div>
                          <div className="font-medium">My Profile</div>
                          <div className="text-xs text-gray-500">Edit your information</div>
                        </div>
                      </Link>

                      <Link
                        to="/my-listings"
                        className="flex items-center px-6 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors">
                          <FaShoppingBag className="text-orange-600" size={14} />
                        </div>
                        <div>
                          <div className="font-medium">My Listings</div>
                          <div className="text-xs text-gray-500">Manage your items</div>
                        </div>
                      </Link>

                      <Link
                        to="/saved-items"
                        className="flex items-center px-6 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-700 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-pink-200 transition-colors">
                          <FaHeart className="text-pink-600" size={14} />
                        </div>
                        <div>
                          <div className="font-medium">Saved Items</div>
                          <div className="text-xs text-gray-500">Your favorites</div>
                        </div>
                      </Link>
                      
                      <Link
                        to="/settings"
                        className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors">
                          <FaCog className="text-gray-600" size={14} />
                        </div>
                        <div>
                          <div className="font-medium">Settings</div>
                          <div className="text-xs text-gray-500">Preferences & privacy</div>
                        </div>
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-6 py-3 text-red-600 hover:bg-red-50 transition-colors group"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                          <FaSignOutAlt className="text-red-600" size={14} />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Sign Out</div>
                          <div className="text-xs text-red-400">Log out of your account</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Login/Signup buttons when not authenticated */
            <div className="flex items-center space-x-3">
              <Link
                to="/Authpage"
                className="text-gray-600 hover:text-[#5A3FF4] transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/Authpage"
                className="bg-[#5A3FF4] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#4832D3] transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;