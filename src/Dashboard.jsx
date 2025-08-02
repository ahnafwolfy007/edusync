import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaShoppingBag, 
  FaHome, 
  FaGraduationCap, 
  FaBriefcase, 
  FaCalendarAlt, 
  FaSearch, 
  FaBell, 
  FaUser, 
  FaCog,
  FaArrowRight,
  FaHeart,
  FaEye,
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
  FaBookOpen,
  FaLaptop,
  FaGamepad,
  FaTshirt,
  FaUtensils,
  FaQuestionCircle,
  FaBullhorn,
  FaCalendar
} from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/Authpage');
      return;
    }
    
    setUser(JSON.parse(userData));
    
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Fetch data
    fetchAnnouncements();
    fetchUserListings();

    // Block browser back button and show logout confirmation
    const handlePopState = (event) => {
      event.preventDefault();
      setShowLogoutModal(true);
      // Push the current state back to prevent actual navigation
      window.history.pushState(null, '', window.location.pathname);
    };

    // Add current state to history
    window.history.pushState(null, '', window.location.pathname);
    
    // Listen for popstate (back button)
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/announcements', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      } else {
        // Mock data for development
        setAnnouncements([
          {
            id: 1,
            title: "Campus Library Extended Hours",
            content: "Library will be open 24/7 during finals week",
            date: "2025-01-28",
            type: "academic",
            priority: "high"
          },
          {
            id: 2,
            title: "New Cafeteria Menu Launch",
            content: "Exciting new food options available starting Monday",
            date: "2025-01-27",
            type: "general",
            priority: "medium"
          },
          {
            id: 3,
            title: "Career Fair Registration Open",
            content: "Register now for the Spring Career Fair - Feb 15th",
            date: "2025-01-26",
            type: "career",
            priority: "high"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      // Set mock data on error
      setAnnouncements([
        {
          id: 1,
          title: "Campus Library Extended Hours",
          content: "Library will be open 24/7 during finals week",
          date: "2025-01-28",
          type: "academic",
          priority: "high"
        },
        {
          id: 2,
          title: "New Cafeteria Menu Launch",
          content: "Exciting new food options available starting Monday",
          date: "2025-01-27",
          type: "general",
          priority: "medium"
        }
      ]);
    }
  };

  const fetchUserListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/listings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserListings(data.listings || []);
      } else {
        // Mock data for development
        setUserListings([
          {
            id: 1,
            title: "Statistics Textbook",
            price: "$35",
            category: "books",
            type: "sell",
            status: "active",
            views: 12,
            likes: 3,
            created_at: "2025-01-26T10:30:00Z"
          },
          {
            id: 2,
            title: "Single Room Available",
            price: "$800/month",
            category: "housing",
            type: "rent",
            status: "active",
            views: 28,
            likes: 7,
            created_at: "2025-01-25T14:20:00Z"
          },
          {
            id: 3,
            title: "Gaming Headset",
            price: "$45",
            category: "electronics",
            type: "sell",
            status: "sold",
            views: 15,
            likes: 2,
            created_at: "2025-01-24T09:15:00Z"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching user listings:', error);
      // Set mock data on error
      setUserListings([
        {
          id: 1,
          title: "Statistics Textbook",
          price: "$35",
          category: "books",
          type: "sell",
          status: "active",
          views: 12,
          likes: 3,
          created_at: "2025-01-26T10:30:00Z"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getAnnouncementIcon = (type) => {
    switch (type) {
      case 'academic': return FaGraduationCap;
      case 'career': return FaBriefcase;
      case 'general': return FaBullhorn;
      default: return FaBullhorn;
    }
  };

  const getAnnouncementColor = (priority) => {
    switch (priority) {
      case 'high': return 'from-red-50 to-orange-50 border-red-200';
      case 'medium': return 'from-yellow-50 to-amber-50 border-yellow-200';
      case 'low': return 'from-blue-50 to-indigo-50 border-blue-200';
      default: return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const quickActions = [
    {
      title: "Explore Marketplace",
      desc: "Browse and buy student essentials",
      icon: FaShoppingBag,
      gradient: "from-purple-500 to-pink-500",
      items: "2.5K+ Items",
      action: "Browse"
    },
    {
      title: "Student Housing",
      desc: "Find your perfect room or roommate",
      icon: FaHome,
      gradient: "from-blue-500 to-cyan-500",
      items: "450+ Listings",
      action: "Explore"
    },
    {
      title: "Buy 2nd Hand",
      desc: "Quality used items at great prices",
      icon: FaDollarSign,
      gradient: "from-green-500 to-emerald-500",
      items: "1.8K+ Products",
      action: "Shop"
    },
    {
      title: "Rent & Borrow",
      desc: "Temporary access to what you need",
      icon: FaClock,
      gradient: "from-orange-500 to-red-500",
      items: "320+ Available",
      action: "Browse"
    }
  ];

  const lostFoundItems = [
    {
      id: 1,
      title: "Black iPhone 12",
      location: "Library 2nd Floor",
      time: "1h ago",
      type: "lost"
    },
    {
      id: 2,
      title: "Blue Backpack",
      location: "Student Center",
      time: "3h ago",
      type: "found"
    }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-[#5A3FF4] to-[#6B4EFF] text-white px-4 py-2 rounded-lg font-bold text-xl">
                Dashboard
              </div>
              
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search marketplace, housing, jobs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                />
              </div>
            </div>

           
          </div>
        </div>
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {greeting}, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to explore your campus marketplace and connect with your community?
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="text-white" size={24} />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{action.desc}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {action.items}
                </span>
                <div className="flex items-center text-indigo-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                  {action.action} <FaArrowRight className="ml-1" size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Announcements & My Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Announcements */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FaBullhorn className="mr-2 text-indigo-600" />
                Announcements
              </h2>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-16"></div>
                  ))}
                </div>
              ) : (
                announcements.slice(0, 3).map((announcement) => {
                  const IconComponent = getAnnouncementIcon(announcement.type);
                  return (
                    <div
                      key={announcement.id}
                      className={`bg-gradient-to-r ${getAnnouncementColor(announcement.priority)} p-4 rounded-xl border hover:shadow-md transition-shadow cursor-pointer`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <IconComponent className="text-gray-600 mt-1" size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                            {announcement.title}
                          </h3>
                          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                            {announcement.content}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <FaCalendar className="mr-1" size={10} />
                            {formatDate(announcement.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* My Listings */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">My Listings</h2>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  Create New
                </button>
              </div>
              
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {userListings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FaShoppingBag className="mx-auto mb-4 text-4xl text-gray-300" />
                      <p>No listings yet. Create your first listing!</p>
                    </div>
                  ) : (
                    userListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                          {listing.category === 'books' && <FaBookOpen className="text-gray-600" size={24} />}
                          {listing.category === 'electronics' && <FaLaptop className="text-gray-600" size={24} />}
                          {listing.category === 'housing' && <FaHome className="text-gray-600" size={24} />}
                          {!['books', 'electronics', 'housing'].includes(listing.category) && <FaShoppingBag className="text-gray-600" size={24} />}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {listing.title}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              listing.status === 'active' 
                                ? 'bg-green-100 text-green-600' 
                                : listing.status === 'sold'
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-yellow-100 text-yellow-600'
                            }`}>
                              {listing.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <FaEye className="mr-1" size={12} />
                              {listing.views} views
                            </span>
                            <span className="flex items-center">
                              <FaHeart className="mr-1" size={12} />
                              {listing.likes} likes
                            </span>
                            <span className="flex items-center">
                              <FaClock className="mr-1" size={12} />
                              {formatDate(listing.created_at)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-lg font-bold ${listing.type === 'rent' ? 'text-orange-600' : 'text-green-600'}`}>
                            {listing.price}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            listing.type === 'rent' 
                              ? 'bg-orange-100 text-orange-600' 
                              : 'bg-green-100 text-green-600'
                          }`}>
                            {listing.type === 'rent' ? 'Rent' : 'Sell'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lost & Found + Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lost & Found */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Lost & Found</h2>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Post Item
              </button>
            </div>
            
            <div className="space-y-3">
              {lostFoundItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <FaMapMarkerAlt className="mr-1" size={10} />
                        {item.location}
                      </span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.type === 'lost' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {item.type === 'lost' ? 'Lost' : 'Found'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Activity</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-sm text-gray-600">Items Saved</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{userListings.filter(l => l.status === 'active').length}</div>
                <div className="text-sm text-gray-600">Active Listings</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-gray-600">Transactions</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout and return to the home page?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleCancelLogout}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;