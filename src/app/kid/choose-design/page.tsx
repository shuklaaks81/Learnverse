"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChooseDesign() {
  const router = useRouter();
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null);

  const designs = [
    { id: 1, name: "Colorful & Fun", emoji: "🎨", colors: "from-pink-400 via-purple-400 to-blue-400" },
    { id: 2, name: "Nature Style", emoji: "🌳", colors: "from-green-400 via-emerald-400 to-teal-400" },
    { id: 3, name: "Space Theme", emoji: "🚀", colors: "from-indigo-600 via-purple-600 to-pink-600" }
  ];

  const handleSelect = (designId: number) => {
    setSelectedDesign(designId);
    // Save design choice
    localStorage.setItem('selectedDesign', designId.toString());
    
    setTimeout(() => {
      router.push('/kid/draw-buddy');
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 animate-gradient">
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 10s ease infinite;
        }
      `}</style>

      <div className="w-full max-w-6xl bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 sm:p-16 border-4 border-white/60">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          🎨 Choose Your Design! ✨
        </h1>
        <p className="text-center text-gray-700 mb-12 font-bold text-2xl sm:text-3xl">
          Pick your favorite style! 🌟
        </p>

        <div className="grid sm:grid-cols-3 gap-8">
          {designs.map((design) => (
            <button
              key={design.id}
              onClick={() => handleSelect(design.id)}
              className={`bg-gradient-to-br ${design.colors} p-8 rounded-3xl hover:shadow-2xl transition-all hover:scale-105 shadow-lg border-4 ${
                selectedDesign === design.id ? 'border-yellow-400 ring-8 ring-yellow-300' : 'border-white'
              }`}
            >
              <div className="text-8xl mb-4 animate-bounce">{design.emoji}</div>
              <h2 className="text-white font-bold text-2xl sm:text-3xl">{design.name}</h2>
            </button>
          ))}
        </div>

        <p className="text-center text-gray-600 mt-12 font-semibold text-lg">
          Don&apos;t worry, you can change this later! 😊
        </p>
      </div>
    </div>
  );
}
