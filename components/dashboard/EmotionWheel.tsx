'use client';

import React from 'react';

export const EmotionWheel: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-96">
      <svg
        viewBox="0 0 400 400"
        className="w-full max-w-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="emotionGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fbbf24" />
          </radialGradient>
          <linearGradient id="wheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="25%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="75%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        {/* Background circle rings */}
        <circle cx="200" cy="200" r="190" fill="none" stroke="url(#wheelGradient)" strokeWidth="2" opacity="0.3" />
        <circle cx="200" cy="200" r="160" fill="none" stroke="url(#wheelGradient)" strokeWidth="2" opacity="0.3" />
        <circle cx="200" cy="200" r="130" fill="none" stroke="url(#wheelGradient)" strokeWidth="2" opacity="0.3" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="url(#wheelGradient)" strokeWidth="2" opacity="0.3" />

        {/* Center emotion face */}
        <circle cx="200" cy="200" r="70" fill="none" stroke="url(#wheelGradient)" strokeWidth="3" />
        
        {/* Left half - sad */}
        <circle cx="200" cy="200" r="65" fill="#0f172a" clipPath="polygon(0 0, 50% 0, 50% 100%, 0 100%)" />
        
        {/* Right half - happy */}
        <circle cx="200" cy="200" r="65" fill="#ffffff" clipPath="polygon(50% 0, 100% 0, 100% 100%, 50% 100%)" />

        {/* Left eye (sad) */}
        <ellipse cx="175" cy="190" rx="6" ry="12" fill="white" />

        {/* Right eye (happy) */}
        <circle cx="225" cy="185" r="8" fill="#663399" />

        {/* Sad mouth */}
        <path d="M 165 210 Q 170 205 180 210" stroke="white" strokeWidth="2" fill="none" />

        {/* Happy mouth */}
        <path d="M 220 210 Q 225 220 235 215" stroke="#d4526e" strokeWidth="2" fill="none" />
      </svg>

      {/* Bottom buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex gap-4 justify-center px-4">
        <button className="px-6 py-2 border-2 border-green-400 text-green-400 rounded-full font-semibold hover:bg-green-400 hover:text-black transition">
          Booked
        </button>
        <button className="px-6 py-2 border-2 border-pink-400 text-pink-400 rounded-full font-semibold hover:bg-pink-400 hover:text-black transition">
          Attended
        </button>
      </div>
    </div>
  );
};
