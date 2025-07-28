import React from 'react';
import { Link } from 'react-router-dom';
 // Add this import

const Index = () => {
  return (
    
    <div className="text-gray-800 font-sans">
      

      {/* Hero Section */}
      <section className="flex items-center justify-between bg-gradient-to-r from-[#5A3FF4] to-[#6B4EFF] text-white px-16 py-24">
        <div className="w-1/2 space-y-6">
          <h2 className="text-5xl font-bold leading-tight">Your Complete Campus Life Solution</h2>
          <p className="text-xl text-gray-100">Connect, trade, and thrive in your campus community with EduSync's all-in-one platform.</p>
          <Link to="/Authpage">
          <button className="bg-white text-[#5A3FF4] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg">
            Get Started
          </button>
          </Link>
        </div>  
        <div className="w-1/2 transform hover:scale-105 transition-transform duration-300">
         <img src="../public/landing.png" alt="Students" className="w-3/4 md:w-2/3 lg:w-1/2 mx-auto" />
        </div>
      </section>

      {/* Features Section */}
      <section className="text-center py-20 px-8 bg-gray-50">
        <h3 className="text-3xl font-bold mb-12">Everything You Need in One Place</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: "Campus Marketplace", desc: "Buy and sell textbooks, electronics, and more." },
            { title: "Student Housing", desc: "Find or list student accommodations." },
            { title: "Tutoring Network", desc: "Connect with peer tutors or offer help." },
            { title: "Job Board", desc: "Find part-time jobs and internships." },
            { title: "Campus Events", desc: "Stay updated with latest campus activities." },
            { title: "Secure Platform", desc: "Verified student accounts and secure transactions." },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="font-bold text-xl mb-3 text-[#5A3FF4]">{f.title}</h4>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-[#5A3FF4] to-[#6B4EFF] text-white py-16 flex justify-around text-center">
        {[
          { number: "50K+", label: "Listings" },
          { number: "100K+", label: "Students" },
          { number: "5K+", label: "Events" },
          { number: "50+", label: "Campuses" }
        ].map((stat, i) => (
          <div key={i} className="hover:transform hover:scale-110 transition-transform duration-300">
            <h4 className="text-4xl font-bold mb-2">{stat.number}</h4>
            <p className="text-gray-200">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section className="py-20 px-8 bg-gray-50">
        <h3 className="text-3xl font-bold mb-12 text-center">What Students Say</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Sarah Johnson", role: "Computer Science", text: "EduSync made it super easy to find a great tutor for my classes!" },
            { name: "Michael Chen", role: "Business Admin", text: "Found my roommate and felt safe through the verification process." },
            { name: "Emily Rodriguez", role: "Engineering", text: "The job board helped me land my first internship!" }
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <h4 className="font-bold text-lg text-[#5A3FF4]">{t.name}</h4>
              <p className="text-sm text-gray-500 mb-4">{t.role}</p>
              <p className="text-gray-700">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
        <section className="bg-white py-16 text-center">
          <div className="max-w-3xl mx-auto px-8">
            <h3 className="text-3xl font-bold mb-4">Join Your Campus Community Today</h3>
            <p className="text-gray-600 mb-8 text-lg">Connect with students, access resources, and make the most of your campus life with EduSync.</p>
            <div className="space-x-4">
          <Link to="/Authpage">
            <button className="bg-[#5A3FF4] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#4832D3] transition-colors duration-200 shadow-lg">
              Sign Up Now
            </button>
          </Link>
          <button className="border-2 border-[#5A3FF4] text-[#5A3FF4] px-8 py-3 rounded-lg font-semibold hover:bg-[#5A3FF4] hover:text-white transition-all duration-200">
            Learn More
          </button>
            </div>
          </div>
        </section>

        
    </div>
  );
};

export default Index;
