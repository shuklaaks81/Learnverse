'use client';

import { useState, useEffect } from 'react';

interface WeeklyAnimationProps {
  weekNumber: number;
  onClose: () => void;
}

export default function WeeklyAnimation({ weekNumber, onClose }: WeeklyAnimationProps) {
  const [scene, setScene] = useState(0);
  const [dialogue, setDialogue] = useState('');
  const [speaker, setSpeaker] = useState('');

  useEffect(() => {
    // Week 1: Alex Video Games Logic Loop
    if (weekNumber === 1) {
      playWeek1Animation();
    }
    // Add more weeks here later!
  }, [weekNumber]);

  const playWeek1Animation = () => {
    const scenes = [
      { scene: 1, delay: 500, speaker: 'Person', text: 'Alex, you need to do something else instead of watching videos!' },
      { scene: 2, delay: 3500, speaker: 'Alex', text: 'Ok...' },
      { scene: 3, delay: 5500, speaker: 'Person', text: 'Alex! Why are you playing video games? What are you learning from it?' },
      { scene: 4, delay: 9000, speaker: 'Alex', text: 'Actually, studies show that games are actually good because of their problem-solving puzzles!' },
      { scene: 5, delay: 13500, speaker: 'Person', text: 'Whatever. Go play outside.' },
      { scene: 6, delay: 16500, speaker: 'Person', text: 'I told you to play OUTSIDE!' },
      { scene: 7, delay: 19500, speaker: 'Alex', text: 'You never said to do PHYSICAL games!' },
      { scene: 8, delay: 23000, speaker: '', text: '' }, // End
    ];

    scenes.forEach(({ scene: sceneNum, delay, speaker: sp, text }) => {
      setTimeout(() => {
        setScene(sceneNum);
        setSpeaker(sp);
        setDialogue(text);
      }, delay);
    });
  };

  const renderWeek1Scene = () => {
    switch (scene) {
      case 0:
        return null;
      
      case 1: // Person enters and yells at Alex watching videos
        return (
          <div className="relative w-full h-full">
            {/* Alex watching videos on left */}
            <div className="absolute left-20 bottom-32">
              <div className="flex flex-col items-center">
                {/* Stick figure sitting */}
                <svg width="100" height="120" className="animate-pulse">
                  {/* Head */}
                  <circle cx="50" cy="20" r="15" fill="#3b82f6" stroke="black" strokeWidth="2" />
                  {/* Body */}
                  <line x1="50" y1="35" x2="50" y2="70" stroke="black" strokeWidth="3" />
                  {/* Sitting legs */}
                  <line x1="50" y1="70" x2="30" y2="90" stroke="black" strokeWidth="3" />
                  <line x1="50" y1="70" x2="70" y2="90" stroke="black" strokeWidth="3" />
                  {/* Arms holding controller */}
                  <line x1="50" y1="45" x2="30" y2="55" stroke="black" strokeWidth="3" />
                  <line x1="50" y1="45" x2="70" y2="55" stroke="black" strokeWidth="3" />
                </svg>
                <div className="text-4xl">📱</div>
              </div>
            </div>
            
            {/* Person entering from right */}
            <div className="absolute right-20 bottom-32 animate-[slideInRight_0.5s_ease-out]">
              <svg width="80" height="120">
                <circle cx="40" cy="20" r="15" fill="#ef4444" stroke="black" strokeWidth="2" />
                <line x1="40" y1="35" x2="40" y2="80" stroke="black" strokeWidth="3" />
                <line x1="40" y1="80" x2="30" y2="110" stroke="black" strokeWidth="3" />
                <line x1="40" y1="80" x2="50" y2="110" stroke="black" strokeWidth="3" />
                <line x1="40" y1="45" x2="20" y2="60" stroke="black" strokeWidth="3" />
                <line x1="40" y1="45" x2="60" y2="60" stroke="black" strokeWidth="3" />
              </svg>
            </div>
          </div>
        );

      case 2: // Alex walks away
        return (
          <div className="relative w-full h-full">
            {/* Alex walking away to right */}
            <div className="absolute left-1/2 bottom-32 animate-[walkRight_2s_ease-in-out]">
              <svg width="80" height="120">
                <circle cx="40" cy="20" r="15" fill="#3b82f6" stroke="black" strokeWidth="2" />
                <line x1="40" y1="35" x2="40" y2="80" stroke="black" strokeWidth="3" />
                <line x1="40" y1="80" x2="30" y2="110" stroke="black" strokeWidth="3" />
                <line x1="40" y1="80" x2="50" y2="110" stroke="black" strokeWidth="3" />
                <line x1="40" y1="45" x2="25" y2="65" stroke="black" strokeWidth="3" />
                <line x1="40" y1="45" x2="55" y2="65" stroke="black" strokeWidth="3" />
              </svg>
            </div>
          </div>
        );

      case 3: // Person finds Alex playing video games
        return (
          <div className="relative w-full h-full">
            {/* Alex playing games on left */}
            <div className="absolute left-20 bottom-32">
              <div className="flex flex-col items-center">
                <svg width="100" height="120" className="animate-bounce">
                  <circle cx="50" cy="20" r="15" fill="#3b82f6" stroke="black" strokeWidth="2" />
                  <line x1="50" y1="35" x2="50" y2="70" stroke="black" strokeWidth="3" />
                  <line x1="50" y1="70" x2="30" y2="90" stroke="black" strokeWidth="3" />
                  <line x1="50" y1="70" x2="70" y2="90" stroke="black" strokeWidth="3" />
                  <line x1="50" y1="45" x2="30" y2="55" stroke="black" strokeWidth="3" />
                  <line x1="50" y1="45" x2="70" y2="55" stroke="black" strokeWidth="3" />
                </svg>
                <div className="text-4xl animate-pulse">🎮</div>
              </div>
            </div>
            
            {/* Person shocked on right */}
            <div className="absolute right-20 bottom-32 animate-shake">
              <svg width="80" height="120">
                <circle cx="40" cy="20" r="15" fill="#ef4444" stroke="black" strokeWidth="2" />
                <circle cx="35" cy="18" r="3" fill="black" />
                <circle cx="45" cy="18" r="3" fill="black" />
                <line x1="40" y1="35" x2="40" y2="80" stroke="black" strokeWidth="3" />
                <line x1="40" y1="80" x2="30" y2="110" stroke="black" strokeWidth="3" />
                <line x1="40" y1="80" x2="50" y2="110" stroke="black" strokeWidth="3" />
                {/* Arms up in shock */}
                <line x1="40" y1="45" x2="15" y2="30" stroke="black" strokeWidth="3" />
                <line x1="40" y1="45" x2="65" y2="30" stroke="black" strokeWidth="3" />
              </svg>
            </div>
          </div>
        );

      case 4: // Alex explains with smart look
        return (
          <div className="relative w-full h-full">
            {/* Alex confident on left */}
            <div className="absolute left-20 bottom-32">
              <svg width="100" height="120">
                <circle cx="50" cy="20" r="15" fill="#3b82f6" stroke="black" strokeWidth="2" />
                {/* Glasses for smart look */}
                <rect x="35" y="17" width="12" height="8" fill="none" stroke="black" strokeWidth="2" />
                <rect x="53" y="17" width="12" height="8" fill="none" stroke="black" strokeWidth="2" />
                <line x1="50" y1="35" x2="50" y2="80" stroke="black" strokeWidth="3" />
                <line x1="50" y1="80" x2="35" y2="110" stroke="black" strokeWidth="3" />
                <line x1="50" y1="80" x2="65" y2="110" stroke="black" strokeWidth="3" />
                {/* Pointing finger */}
                <line x1="50" y1="45" x2="80" y2="40" stroke="black" strokeWidth="3" />
                <line x1="50" y1="45" x2="30" y2="60" stroke="black" strokeWidth="3" />
              </svg>
              <div className="text-2xl mt-2">📚💡</div>
            </div>
            
            {/* Person annoyed */}
            <div className="absolute right-20 bottom-32">
              <svg width="80" height="120">
                <circle cx="40" cy="20" r="15" fill="#ef4444" stroke="black" strokeWidth="2" />
                {/* Annoyed eyes */}
                <line x1="30" y1="18" x2="35" y2="20" stroke="black" strokeWidth="2" />
                <line x1="45" y1="20" x2="50" y2="18" stroke="black" strokeWidth="2" />
                <line x1="40" y1="35" x2="40" y2="80" stroke="black" strokeWidth="3" />
                <line x1="40" y1="80" x2="30" y2="110" stroke="black" strokeWidth="3" />
                <line x1="40" y1="80" x2="50" y2="110" stroke="black" strokeWidth="3" />
                {/* Arms crossed */}
                <line x1="40" y1="50" x2="20" y2="55" stroke="black" strokeWidth="3" />
                <line x1="40" y1="50" x2="60" y2="55" stroke="black" strokeWidth="3" />
              </svg>
            </div>
          </div>
        );

      case 5: // Person tells Alex to go outside
        return (
          <div className="relative w-full h-full">
            <div className="absolute left-20 bottom-32">
              <svg width="100" height="120">
                <circle cx="50" cy="20" r="15" fill="#3b82f6" stroke="black" strokeWidth="2" />
                <line x1="50" y1="35" x2="50" y2="80" stroke="black" strokeWidth="3" />
                <line x1="50" y1="80" x2="35" y2="110" stroke="black" strokeWidth="3" />
                <line x1="50" y1="80" x2="65" y2="110" stroke="black" strokeWidth="3" />
                <line x1="50" y1="45" x2="35" y2="60" stroke="black" strokeWidth="3" />
                <line x1="50" y1="45" x2="65" y2="60" stroke="black" strokeWidth="3" />
              </svg>
            </div>
            
            {/* Person pointing to door */}
            <div className="absolute right-20 bottom-32">
              <svg width="80" height="120">
                <circle cx="40" cy="20" r="15" fill="#ef4444" stroke="black" strokeWidth="2" />
                <line x1="40" y1="35" x2="40" y2="80" stroke="black" strokeWidth="3" />
                <line x1="40" y1="80" x2="30" y2="110" stroke="black" strokeWidth="3" />
                <line x1="40" y1="80" x2="50" y2="110" stroke="black" strokeWidth="3" />
                {/* Pointing arm */}
                <line x1="40" y1="45" x2="70" y2="45" stroke="black" strokeWidth="3" />
                <line x1="40" y1="45" x2="20" y2="60" stroke="black" strokeWidth="3" />
              </svg>
            </div>
            
            {/* Door on far right */}
            <div className="absolute right-5 bottom-20 text-6xl">🚪</div>
          </div>
        );

      case 6: // Person catches Alex playing games again
        return (
          <div className="relative w-full h-full">
            {/* Alex playing OUTSIDE games (still on device) */}
            <div className="absolute left-20 bottom-32">
              <div className="flex flex-col items-center">
                <svg width="100" height="120">
                  <circle cx="50" cy="20" r="15" fill="#3b82f6" stroke="black" strokeWidth="2" />
                  <line x1="50" y1="35" x2="50" y2="80" stroke="black" strokeWidth="3" />
                  <line x1="50" y1="80" x2="35" y2="110" stroke="black" strokeWidth="3" />
                  <line x1="50" y1="80" x2="65" y2="110" stroke="black" strokeWidth="3" />
                  <line x1="50" y1="45" x2="30" y2="55" stroke="black" strokeWidth="3" />
                  <line x1="50" y1="45" x2="70" y2="55" stroke="black" strokeWidth="3" />
                </svg>
                <div className="text-4xl">🎮</div>
                <div className="text-2xl mt-1">🌳☀️</div>
              </div>
            </div>
            
            {/* Person VERY angry */}
            <div className="absolute right-20 bottom-32 animate-[shake_0.5s_infinite]">
              <svg width="80" height="120">
                <circle cx="40" cy="20" r="15" fill="#dc2626" stroke="black" strokeWidth="2" />
                {/* Angry eyes */}
                <line x1="30" y1="15" x2="35" y2="20" stroke="black" strokeWidth="3" />
                <line x1="50" y1="20" x2="45" y2="15" stroke="black" strokeWidth="3" />
                <line x1="40" y1="35" x2="40" y2="80" stroke="black" strokeWidth="3" />
                <line x1="40" y1="80" x2="30" y2="110" stroke="black" strokeWidth="3" />
                <line x1="40" y1="80" x2="50" y2="110" stroke="black" strokeWidth="3" />
                {/* Arms up angry */}
                <line x1="40" y1="45" x2="15" y2="35" stroke="black" strokeWidth="3" />
                <line x1="40" y1="45" x2="65" y2="35" stroke="black" strokeWidth="3" />
              </svg>
              <div className="text-3xl animate-pulse">💢😡</div>
            </div>
          </div>
        );

      case 7: // Alex's clever comeback
        return (
          <div className="relative w-full h-full">
            {/* Alex confident and smug */}
            <div className="absolute left-20 bottom-32">
              <svg width="100" height="120">
                <circle cx="50" cy="20" r="15" fill="#3b82f6" stroke="black" strokeWidth="2" />
                {/* Smug smile */}
                <path d="M 40 25 Q 50 28 60 25" fill="none" stroke="black" strokeWidth="2" />
                <line x1="50" y1="35" x2="50" y2="80" stroke="black" strokeWidth="3" />
                <line x1="50" y1="80" x2="35" y2="110" stroke="black" strokeWidth="3" />
                <line x1="50" y1="80" x2="65" y2="110" stroke="black" strokeWidth="3" />
                {/* Shrugging arms */}
                <line x1="50" y1="45" x2="25" y2="40" stroke="black" strokeWidth="3" />
                <line x1="50" y1="45" x2="75" y2="40" stroke="black" strokeWidth="3" />
              </svg>
              <div className="text-3xl mt-2">😏✨</div>
            </div>
            
            {/* Person defeated */}
            <div className="absolute right-20 bottom-32">
              <svg width="80" height="120" className="opacity-70">
                <circle cx="40" cy="20" r="15" fill="#ef4444" stroke="black" strokeWidth="2" />
                {/* Defeated eyes */}
                <line x1="30" y1="20" x2="35" y2="18" stroke="black" strokeWidth="2" />
                <line x1="45" y1="18" x2="50" y2="20" stroke="black" strokeWidth="2" />
                <line x1="40" y1="35" x2="40" y2="80" stroke="black" strokeWidth="3" />
                <line x1="40" y1="80" x2="30" y2="110" stroke="black" strokeWidth="3" />
                <line x1="40" y1="80" x2="50" y2="110" stroke="black" strokeWidth="3" />
                {/* Arms down defeated */}
                <line x1="40" y1="45" x2="25" y2="65" stroke="black" strokeWidth="3" />
                <line x1="40" y1="45" x2="55" y2="65" stroke="black" strokeWidth="3" />
              </svg>
              <div className="text-2xl">😑</div>
            </div>
          </div>
        );

      case 8: // End - The End text
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-4 animate-pulse">THE END</div>
              <div className="text-2xl text-white">😂 Alex: 1, Logic: 0</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Animation area */}
      <div className="flex-1 relative bg-gradient-to-b from-sky-200 to-green-100">
        {renderWeek1Scene()}
      </div>

      {/* Dialogue box */}
      {dialogue && (
        <div className="bg-gray-900 text-white p-6 border-t-4 border-yellow-400">
          <div className="max-w-4xl mx-auto">
            <div className="font-bold text-xl mb-2 text-yellow-400">{speaker}</div>
            <div className="text-lg">{dialogue}</div>
          </div>
        </div>
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-xl shadow-lg z-10"
      >
        ✕ Close
      </button>

      {/* Week indicator */}
      <div className="absolute top-4 left-4 bg-purple-600 text-white px-4 py-2 rounded-lg font-bold">
        Week {weekNumber} Animation
      </div>
    </div>
  );
}
