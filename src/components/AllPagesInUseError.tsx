"use client";

import { useEffect, useState } from 'react';

interface AllPagesInUseErrorProps {
  onBack?: () => void;
}

export default function AllPagesInUseError({ onBack }: AllPagesInUseErrorProps) {
  const [countdown, setCountdown] = useState(10000000000);
  useEffect(() => {
    // Silly countdown that decreases by 1 every second
    const interval = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center">
        {/* Crying emoji animation */}
        <div className="text-9xl mb-6 animate-bounce">
          😭
        </div>
        
        {/* Main message */}
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          OH NO!
        </h1>
        
        <div className="text-xl md:text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
          Sorry! All web pages are currently in use!
        </div>
        
        {/* The funny countdown */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 mb-6">
          <div className="text-sm font-bold mb-2 opacity-90">
            PLEASE WAIT:
          </div>
          <div className="text-3xl md:text-4xl font-black font-mono">
            {countdown.toLocaleString()} seconds
          </div>
          <div className="text-xs mt-2 opacity-75">
            (That's about 317 years... give or take! 😅)
          </div>
        </div>
        
        {/* Explanation */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
          <div className="font-bold text-blue-900 mb-2">
            🤔 What happened?
          </div>
          <p className="text-sm text-blue-800 leading-relaxed">
            All 50 custom page slots are being used! Someone needs to delete an old custom page
            before you can create a new one. Ask your parent to check the custom pages and delete
            ones you don't need anymore!
          </p>
        </div>
        
        {/* Fun facts while waiting */}
        <div className="bg-yellow-50 rounded-xl p-4 mb-6 text-left">
          <div className="font-bold text-yellow-900 mb-2">
            💡 Fun Facts While You Wait:
          </div>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• In 10 billion seconds, you could watch a movie 5 million times!</li>
            <li>• That's enough time to count to 1 billion... 10 times!</li>
            <li>• You could probably invent time travel by then? 🚀</li>
          </ul>
        </div>
        
        {/* Progress bar (always full because all pages used) */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
            <span>Custom Pages Used</span>
            <span>50 / 50 (100%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 animate-pulse"
              style={{ width: '100%' }}
            />
          </div>
        </div>
        
        {/* Back button */}
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-200 shadow-lg"
        >
          ← Go Back
        </button>
        
        {/* Alternative suggestion */}
        <p className="text-sm text-gray-600 mt-4">
          💡 Or try refreshing the page - someone might have just freed up a slot!
        </p>
      </div>
      
      {/* Floating sad emojis */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
