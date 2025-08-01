import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaShoppingBag, 
  FaHome, 
  FaGraduationCap, 
  FaBriefcase, 
  FaUsers, 
  FaSearch,
  FaArrowRight,
  FaCheckCircle,
  FaShieldAlt,
  FaHeadset
} from 'react-icons/fa';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authStateChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#5A3FF4] via-[#6B4EFF] to-[#4834d4] text-white py-20 px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Campus, <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Connected
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Buy, sell, rent, and discover everything you need for campus life. 
            Connect with students, find housing, and make your university experience amazing.
          </p>
          
          {/* Dynamic CTA based on auth status */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="bg-white text-[#5A3FF4] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center"
                >
                  Go to Dashboard
                  <FaArrowRight className="ml-2" />
                </Link>
                <Link 
                  to="/marketplace" 
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#5A3FF4] transition-all duration-300 transform hover:scale-105"
                >
                  Explore Marketplace
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/Authpage" 
                  className="bg-white text-[#5A3FF4] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center"
                >
                  Get Started
                  <FaArrowRight className="ml-2" />
                </Link>
                <Link 
                  to="/marketplace" 
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#5A3FF4] transition-all duration-300 transform hover:scale-105"
                >
                  Browse as Guest
                </Link>
              </>
            )}
          </div>

          {/* Welcome message for authenticated users */}
          {isAuthenticated && user && (
            <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-2xl max-w-md mx-auto">
              <p className="text-lg">
                Welcome back, <span className="font-semibold">{user.name}</span>! 👋
              </p>
              <p className="text-sm opacity-80 mt-1">
                Ready to explore your campus community?
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Campus Life
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From textbooks to housing, jobs to tutoring - find it all in one place
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaShoppingBag,
                title: "Marketplace",
                description: "Buy and sell textbooks, electronics, furniture, and more",
                color: "from-purple-500 to-pink-500",
                items: "2.5K+ Items"
              },
              {
                icon: FaHome,
                title: "Housing",
                description: "Find rooms, apartments, and roommates near campus",
                color: "from-blue-500 to-cyan-500",
                items: "450+ Listings"
              },
              {
                icon: FaGraduationCap,
                title: "Tutoring",
                description: "Connect with tutors and study groups for academic success",
                color: "from-green-500 to-emerald-500",
                items: "200+ Tutors"
              },
              {
                icon: FaBriefcase,
                title: "Jobs",
                description: "Discover part-time jobs and internships on and off campus",
                color: "from-orange-500 to-red-500",
                items: "150+ Opportunities"
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {feature.items}
                    </span>
                    <button className="text-[#5A3FF4] font-semibold hover:text-[#4832D3] transition-colors group-hover:translate-x-1 transform duration-300 flex items-center">
                      Explore <FaArrowRight className="ml-1 text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How EduSync Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, safe, and designed for students
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Sign Up with Student Email",
                description: "Create your account using your university email to join your campus community",
                icon: FaUsers
              },
              {
                step: "02", 
                title: "Post or Browse Items",
                description: "List items for sale, find what you need, or discover housing options",
                icon: FaSearch
              },
              {
                step: "03",
                title: "Connect & Trade Safely",
                description: "Message other students, meet on campus, and complete transactions securely",
                icon: FaShieldAlt
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#5A3FF4] to-[#6B4EFF] rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="text-white text-2xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20 px-8 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Safe & Trusted by Students
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our platform is built with student safety in mind, featuring verified university accounts and secure communication tools.
              </p>
              
              <div className="space-y-4">
                {[
                  "University email verification required",
                  "In-app messaging system",
                  "Community reporting tools",
                  "24/7 customer support"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#5A3FF4] to-[#6B4EFF] rounded-full flex items-center justify-center mr-4">
                    <FaHeadset className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">24/7 Support</h4>
                    <p className="text-gray-600 text-sm">We're here to help</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "EduSync has made buying and selling on campus so much easier and safer. I love how everything is verified through our university emails!"
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="font-semibold text-gray-900">Sarah M.</p>
                  <p className="text-gray-600 text-sm">Business Student, UIU</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 bg-gradient-to-r from-[#5A3FF4] to-[#6B4EFF] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Campus Experience?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who are already using EduSync to buy, sell, and connect on campus.
          </p>
          
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/dashboard" 
                className="bg-white text-[#5A3FF4] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center justify-center"
              >
                <FaArrowRight className="mr-2" />
                Continue to Dashboard
              </Link>
              <Link 
                to="/marketplace" 
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#5A3FF4] transition-all duration-300 transform hover:scale-105"
              >
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/Authpage" 
                className="bg-white text-[#5A3FF4] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center justify-center"
              >
                <FaArrowRight className="mr-2" />
                Get Started Free
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#5A3FF4] transition-all duration-300 transform hover:scale-105">
                Learn More
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;