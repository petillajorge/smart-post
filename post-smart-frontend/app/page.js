import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full backdrop-blur-md bg-black/50 p-4 shadow-md flex justify-between items-center px-8 z-50">
        <h1 className="text-2xl font-bold">Smart Post</h1>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#features" className="hover:text-gray-400">Features</a></li>
            <li><a href="#pricing" className="hover:text-gray-400">Pricing</a></li>
            <li><a href="#contact" className="hover:text-gray-400">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center text-center h-screen px-6">
        <p className="text-5xl font-extrabold mb-4">
        AI-Powered Social Media Post Generation
        </p>

        <p className="text-lg text-gray-300 max-w-2xl mb-6">
          Create high-quality, platform-optimized posts in seconds. Tailor content for Instagram, TikTok, and more.
        </p>
        <Button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 text-lg font-semibold rounded-lg shadow-lg">
          Get Started
        </Button>
      </main>

      {/* Smooth Scrolling Section */}
      <section id="features" className="h-screen flex flex-col items-center justify-center text-center px-6">

          Why Choose Smart-Post?

        <p className="text-gray-300 max-w-xl">
          Our AI understands your brand voice and adapts to different social platforms for maximum engagement.
        </p>
      </section>
    </div>
  );
}