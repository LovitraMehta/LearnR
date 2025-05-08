import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VisitorHome = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-[#1b1b1b] w-full min-h-screen text-white flex flex-col">
      

      {/* Hero Section First */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Got Doubts? We've Got Answers.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8 text-gray-300">
          Stuck on a tough question or a confusing concept? LearnR connects you with expert help and powerful AI to solve your doubts instantly.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-[#00c2ff] hover:bg-[#00a8da] text-black font-semibold py-3 px-6 rounded-2xl shadow-md transition-all duration-200"
          >
            Sign In
          </button>
          <a href="#learnr-info" className="border border-[#00c2ff] text-[#00c2ff] py-3 px-6 rounded-2xl hover:bg-[#00c2ff20] transition-all duration-200">
            Learn More
          </a>
        </div>
      </div>

      {/* LearnR Info Section */}
      <div id="learnr-info" className="bg-[#232323] py-10 px-6 md:px-12 text-center">
        <h2 className="text-3xl font-semibold mb-4">Welcome to LearnR</h2>
        <p className="text-gray-300 max-w-4xl mx-auto text-lg mb-8">
          LearnR is your one-stop solution for academic support. Whether you're prepping for exams or stuck on homework, we’ve got your back.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left">
          <div className="bg-[#2a2a2a] p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-[#00c2ff]">🧠 Expert Doubt Solving</h3>
            <p className="text-gray-400">
              Post your academic questions and get clear, detailed explanations from real subject experts who understand your curriculum.
            </p>
          </div>
          <div className="bg-[#2a2a2a] p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-[#00c2ff]">🤖 Instant AI-Powered Answers</h3>
            <p className="text-gray-400">
              Don’t want to wait? Use our AI assistant to get instant, intelligent responses for quick understanding — anytime, anywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorHome;
