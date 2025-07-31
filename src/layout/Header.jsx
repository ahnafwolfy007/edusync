import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaCog, FaEdit, FaSignOutAlt } from 'react-icons/fa';

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
    return () => window.removeEventListener('storage', handleStorageChange);
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
      
      // Redirect to home page
      navigate('/');
    }
  };

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
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-[#5A3FF4] transition-colors"
                  title={user?.name || 'User Profile'}
                >
                  <FaUserCircle className="text-2xl" />
                  <span className="hidden md:inline-block text-sm font-medium">
                    {user?.name || 'User'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    <Link
                      to="/edit-profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaCog className="mr-2" />
                      Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
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