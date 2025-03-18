"use client"; // This is a client component

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from 'react';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SocialMediaPostGenerator from "@/components/ui/postGenerator";
import Header from "@/components/ui/Header"
import InfoBlock from "@/components/ui/InfoBlock";


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

  {/*
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
    
    */}
  

  return (
    <div className="relative min-h-screen bg-transparent text-black overflow-hidden">
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />
      {/*
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
      */}
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center text-center px-6 pt-[80px]" > {/* Adjusted pt to accommodate header */}
        <div className="max-w-3xl w-full bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"> {/* Added max-w to constrain content width */}
        <h1
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-5xl md:text-6xl font-extrabold mb-4 "
          >
            Smart Post
          </h1>
          <h2
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-3xl md:text-5xl font-extrabold mb-4"
          >
            AI-Powered Social Media Post Generation
          </h2>
          <p 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-lg text-gray-700 mb-6 mt-3">
            Create high-quality, platform-optimized posts in seconds. Tailor content for Instagram, TikTok, and more.
          </p>
        </div>

        {/* Input Formulary */}
        <SocialMediaPostGenerator />
      </main>

      {/* Features Section */}
      <InfoBlock />


      

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