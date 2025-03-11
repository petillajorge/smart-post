"use client"; // This is a client component

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from 'react';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SocialMediaPostGenerator from "@/components/ui/postGenerator";


export default function LandingPage() {
  const mainRef = useRef(null);
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hearts, setHearts] = useState([]);


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

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const gridSize = 50;
    const offsetX = (mousePosition.x - width / 2) / 20;
    const offsetY = (mousePosition.y - height / 2) / 20;

    ctx.clearRect(0, 0, width, height);

    // Subtle gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)'); // Light base
    gradient.addColorStop(1, 'rgba(220, 220, 230, 0.8)'); // Slightly darker bottom
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(180, 180, 190, 0.42)'; // Thin, light grid lines
    ctx.lineWidth = 0.5;

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const adjustedX = x + offsetX;
      ctx.beginPath();
      ctx.moveTo(adjustedX, 0);
      ctx.lineTo(adjustedX, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const adjustedY = y + offsetY;
      ctx.beginPath();
      ctx.moveTo(0, adjustedY);
      ctx.lineTo(width, adjustedY);
      ctx.stroke();
    }
  }, [mousePosition]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prevHearts) => [
        ...prevHearts,
        {
          id: Date.now(),
          x: Math.random() < 0.5 ? 20 : window.innerWidth - 20,
          y: window.innerHeight + 20,
        },
      ]);
    }, 1250); // Adjust interval for heart frequency

    return () => clearInterval(interval);
  }, []);

  const heartVariants = {
    initial: { opacity: 1, y: 0, scale: 0.9 },
    animate: { y: -window.innerHeight - 20, opacity: 0, scale: 1.2, transition: { duration: 3 } },
    exit: { opacity: 0 },
  };

  return (
    <div className="relative min-h-screen bg-transparent text-black overflow-hidden">
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={heartVariants}
            style={{
              position: 'absolute',
              left: heart.x,
              top: heart.y,
              pointerEvents: 'none',
              zIndex: 0,
              background: 'linear-gradient(to right, #feda75, #d62976, #962fbf, #4f5bd5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2rem',
            }}
            onAnimationComplete={() => setHearts((prev) => prev.filter((h) => h.id !== heart.id))}
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>
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
        
        <SocialMediaPostGenerator />
      </main>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 bg-yellow-100 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Explore PostSmith</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Explore the latest and greatest PostSmith has to offer. Fast-track your post generation by exploring our features.
            </p>
          </div>
          <div className="mt-10">
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Simulated ImagesSpread */}
                {[1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className={`relative ${index === 3 ? 'md:col-span-2' : ''}`}>
                    <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                      <img
                        src={`https://source.unsplash.com/random/400x400?sig=${index}`}
                        alt={`Feature ${index}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 overflow-hidden">
            <div className="marquee-container relative w-full overflow-hidden">
              <div className="marquee flex whitespace-nowrap animate-marquee">
                {['AI Generation', 'Platform Optimization', 'Image/Video Upload', 'Customization', 'Scheduling', 'Analytics'].map((tag, index) => (
                  <a key={index} href="#" className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                    {tag}
                  </a>
                ))}
                {/* Duplicate for seamless loop */}
                {['AI Generation', 'Platform Optimization', 'Image/Video Upload', 'Customization', 'Scheduling', 'Analytics'].map((tag, index) => (
                  <a key={`duplicate-${index}`} href="#" className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 md:py-20 bg-transparent-100 text-black flex items-center justify-center"> {/*Reduced p-20 to py-12*/}
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