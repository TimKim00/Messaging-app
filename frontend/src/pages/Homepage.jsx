import React from "react";
import { Link } from "react-router-dom";
// import backgroundImage from "./../../assets/backgroundImage.jpg"; // Replace with your actual background image

export default function HomePage() {
  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        // style={{
        //   backgroundImage: `url(${backgroundImage})`,
        // }}
      ></div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Welcome to Our Platform
        </h1>
        <p className="text-lg md:text-xl mb-12 animate-fade-in delay-1s">
          Discover, connect, and grow with our amazing community.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/register"
            className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 animate-slide-in-left"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 bg-transparent border border-white text-white rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 animate-slide-in-right"
          >
            Login
          </Link>
        </div>
      </div>
      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-gray-400">
        <p>© 2024 TimKim00. All rights reserved.</p>
      </div>
    </div>
  );
}
