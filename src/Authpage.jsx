import React, { useState } from 'react';
import { FaGoogle, FaMicrosoft, FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
  email: '',
  password: '',
  name: '',
  institution: '',
  location: '',
  phone: '',
});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  // Backend server URL - make sure this matches your server port
  const API_BASE_URL = 'http://localhost:5000';

  // Function to handle back navigation
  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // Go back to previous page
    } else {
      navigate('/'); // Fallback to home if no history
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      // Use full URL instead of relative path
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // For login: Store token and redirect to home
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          setSuccess(data.message);
          
          // Redirect to home page after successful login
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          // For signup: Show success message and switch to login
          setSuccess('Account created successfully! Please login to continue.');
          
          // Clear form data
          setFormData({
            email: '',
            password: '',
            name: '',
            institution: '',
            location: '',
            phone: ''
          });
          
          // Switch to login form after a short delay
          setTimeout(() => {
            setIsLogin(true);
            setSuccess(''); // Clear success message when switching
          }, 2000);
        }
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Network error. Please check if the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Back Button */}
      <button 
        onClick={handleGoBack}
        className="absolute top-4 left-4 z-10 group flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white hover:border-indigo-300 hover:scale-105 active:scale-95"
      >
        <FaArrowLeft className="mr-2 text-gray-600 group-hover:text-indigo-600 transition-colors duration-300 group-hover:-translate-x-1 transform" />
        <span className="hidden sm:inline text-gray-700 group-hover:text-indigo-700 font-medium transition-colors duration-300">Back</span>
        
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
      </button>

      {/* Left Side - Image and Text (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 p-4 sm:p-8 md:p-12 flex-col justify-center text-white">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">Welcome to EduSync</h1>
            <p className="text-base sm:text-lg md:text-xl opacity-90">Your complete campus ecosystem for students and businesses</p>
          </div>
          
          {/* Image Container */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 flex items-center justify-center">
            <div className="w-full aspect-square max-w-[384px] bg-white/20 rounded-xl overflow-hidden">
              <img 
                src="../public/login.png" 
                alt="EduSync Illustration" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
          {/* Toggle Buttons */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 sm:py-4 font-medium text-sm sm:text-base ${
                isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-3 sm:py-4 font-medium text-sm sm:text-base ${
                !isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
  <>
    <div className="mb-3 sm:mb-4">
      <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2" htmlFor="name">
        Full Name
      </label>
      <input
        id="name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
        placeholder="John Doe"
        required={!isLogin}
        disabled={loading}
      />
    </div>

    <div className="mb-3 sm:mb-4">
      <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2" htmlFor="institution">
        Institution
      </label>
      <input
        id="institution"
        name="institution"
        type="text"
        value={formData.institution}
        onChange={handleChange}
        className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
        placeholder="University/College"
        required={!isLogin}
        disabled={loading}
      />
    </div>

    <div className="mb-3 sm:mb-4">
      <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2" htmlFor="location">
        Location
      </label>
      <input
        id="location"
        name="location"
        type="text"
        value={formData.location}
        onChange={handleChange}
        className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
        placeholder="City, Country"
        required={!isLogin}
        disabled={loading}
      />
    </div>

    <div className="mb-3 sm:mb-4">
      <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2" htmlFor="phone">
        Phone Number
      </label>
      <input
        id="phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
        placeholder="+1234567890"
        required={!isLogin}
        disabled={loading}
      />
    </div>
  </>
)}

              <div className="mb-3 sm:mb-4">
                <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  placeholder="you@gmail.com"
                  required
                  disabled={loading}
                />
              </div>

              

              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  placeholder="••••••••"
                  required
                  minLength="6"
                  disabled={loading}
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-xs sm:text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-500">
                    Forget password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-sm sm:text-base ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white`}
              >
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
              </button>
            </form>

            <div className="mt-4 sm:mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white text-gray-500 text-xs sm:text-sm">Or continue with</span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
                <button 
                  type="button"
                  disabled={loading}
                  className="w-full inline-flex justify-center py-2 px-2 sm:px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <FaGoogle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  <span className="ml-1 sm:ml-2">Google</span>
                </button>
                <button 
                  type="button"
                  disabled={loading}
                  className="w-full inline-flex justify-center py-2 px-2 sm:px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <FaMicrosoft className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  <span className="ml-1 sm:ml-2">Microsoft</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;