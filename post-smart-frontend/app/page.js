"use client"; // This is a client component

import { motion } from "framer-motion";
import { useEffect, useRef } from 'react';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function LandingPage() {
  const mainRef = useRef(null);

  useEffect(() => {
    const setMainHeight = () => {
      if (mainRef.current) {
        mainRef.current.style.minHeight = `${window.innerHeight}px`;
      }
    };

    setMainHeight();
    window.addEventListener('resize', setMainHeight);

    return () => {
      window.removeEventListener('resize', setMainHeight);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-black overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full backdrop-blur-md bg-black/50 p-4 shadow-md flex justify-between items-center px-8 z-50">
        <h1 className="text-2xl font-bold text-white px-3">Smart Post</h1>
        <nav>
          <ul className="flex space-x-6 text-white">
            <li><a href="#features" className="hover:text-gray-400">Features</a></li>
            <li><a href="#pricing" className="hover:text-gray-400">Pricing</a></li>
            <li><a href="#contact" className="hover:text-gray-400">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center text-center px-6 pt-[80px]" > {/* Adjusted pt to accommodate header */}
        <div className="max-w-3xl w-full"> {/* Added max-w to constrain content width */}
        <motion.h1
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-5xl md:text-5xl font-extrabold mb-4"
          >
            Smart Post
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-3xl md:text-5xl font-extrabold mb-4"
          >
            AI-Powered Social Media Post Generation
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-lg text-gray-700 mb-6 mt-3">
            Create high-quality, platform-optimized posts in seconds. Tailor content for Instagram, TikTok, and more.
          </motion.p>
        </div>

        {/* Input Formulary */}
        <motion.div
          className="w-full mt-8" // Adjusted mt for spacing
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-white text-black p-6 md:p-8 rounded-xl shadow-lg w-[90%] max-w-lg mx-auto border border-gray-300" // Added mx-auto for centering
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-semibold mb-4">Generate Your Post</h3>
            <input type="text" placeholder="Your Username" className="w-full p-2 border rounded mb-4" />
            <input type="text" placeholder="Post Content" className="w-full p-2 border rounded mb-4" />
            <div className="w-full p-2 border rounded mb-4 flex flex-col items-center">
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                id="fileInput"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    document.getElementById('fileLabel').textContent = file.name;
                  }
                }}
              />
              <label htmlFor="fileInput" id="fileLabel" className="cursor-pointer bg-gray-200 p-2 rounded text-center w-full">
                Upload Image or Video
              </label>
            </div>
            <button className="w-full text-white font-semibold py-3 rounded-lg shadow-md bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 hover:from-yellow-600 hover:via-pink-600 hover:to-purple-600">
              Generate Post
            </button>
          </motion.div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 bg-white text-black flex flex-col md:flex-row items-center justify-between"> {/*Reduced p-20 to py-12*/}
        <motion.div className="md:w-1/2 px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose PostSmith?</h2>
          <p className="text-lg">Create engaging, high-quality posts with minimal effort. Our AI-driven platform helps maximize reach and engagement.</p>
        </motion.div>
        <motion.div className="md:w-1/2 flex justify-center mt-8 md:mt-0 px-6">
          <div className="w-full max-w-lg bg-gray-100 p-6 rounded-lg shadow-lg">Carrousel Placeholder for Success Stories</div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 md:py-20 bg-gray-100 text-black flex items-center justify-center"> {/*Reduced p-20 to py-12*/}
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Choose Your Plan</h2>
          <div className="flex flex-col md:flex-row space-x-0 md:space-x-8 space-y-6 md:space-y-0">
            <div className="p-6 bg-white shadow-lg rounded-lg text-center">
              <h3 className="text-2xl font-semibold">Starter</h3>
              <p>Basic features to get started</p>
              <button className="bg-blue-500 mt-4 px-4 py-2 rounded text-white">Upgrade</button>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg text-center">
              <h3 className="text-2xl font-semibold">Pro</h3>
              <p>Advanced features and customization</p>
              <button className="bg-blue-500 mt-4 px-4 py-2 rounded text-white">Upgrade</button>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg text-center">
              <h3 className="text-2xl font-semibold">Elite</h3>
              <p>Full suite of tools for professionals</p>
              <button className="bg-blue-500 mt-4 px-4 py-2 rounded text-white">Upgrade</button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="p-6 bg-black text-white text-center">© 2025 Smart Post. All rights reserved.</footer>
    </div>
  );
}