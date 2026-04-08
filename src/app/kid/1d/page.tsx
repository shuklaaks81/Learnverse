"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * THE 1D DIMENSION
 * 
 * A mystical realm where everything is made of 1s and ds
 * Ruled by King 1 and Side King d
 * 
 * Everything here is ASCII art using ONLY the sacred characters: 1 and d
 */

export default function OneDDimension() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    // Load coins from localStorage
    if (typeof window !== 'undefined') {
      const kidData = localStorage.getItem('currentKid');
      if (kidData) {
        const kid = JSON.parse(kidData);
        setCoins(kid.coins || 0);
      }
    }

    // Welcome animation
    setTimeout(() => setShowWelcome(false), 3000);
  }, []);

  const ascii1DTitle = `
d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1
1                                                          1
d  111111  1111111        111111   111  1   1  111111    d
1  1    1  1     1        1    1    1   11 11  1         1
d  1    1  1     1        1    1    1   1 1 1  111111    d
1  1    1  1     1        1    1    1   1   1  1         1
d  111111  1111111        111111   111  1   1  111111    d
1                                                          1
d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1
  `;

  const asciiCharacter = `
    1
   1d1
   ddd
  1d1d1
    d
   d d
  1   1
  `;

  const asciiButton = (text: string) => `
d1d1d1d1d1d1d1d1d1d1d1d
1                     1
d    ${text}    d
1                     1
d1d1d1d1d1d1d1d1d1d1d1d
  `;

  const asciiCoin = `
  1d1d1
 d11111d
d1111111d
1d111111d
d1111111d
 d11111d
  1d1d1
  `;

  const activities = [
    { name: "1D LESSONS", description: "Learn in one dimension" },
    { name: "1D GAMES", description: "Play games made of 1s and ds" },
    { name: "1D SHOP", description: "Buy items with 1d coins" },
    { name: "1D LAB", description: "Experiment with the fabric of 1d reality" },
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-8 overflow-auto">
      {/* Welcome Animation */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center animate-pulse">
          <div className="text-center">
            <pre className="text-6xl text-green-400 mb-8">
{`
  111  1111111
   1   1     1
   1   1     1
   1   1     1
  111  1111111
`}
            </pre>
            <div className="text-3xl animate-bounce">ENTERING 1D DIMENSION...</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 border-4 border-green-400 p-4">
        <pre className="text-xs sm:text-sm overflow-x-auto whitespace-pre">
          {ascii1DTitle}
        </pre>
      </div>

      {/* Info Bar */}
      <div className="mb-8 flex flex-wrap gap-4 justify-center items-center text-2xl">
        <div className="border-2 border-green-400 p-4">
          <pre className="text-xs">{asciiCharacter}</pre>
        </div>
        <div className="border-2 border-green-400 p-4 text-center">
          <div className="text-sm mb-2">YOUR 1D COINS:</div>
          <pre className="text-xs">{asciiCoin}</pre>
          <div className="text-2xl mt-2">{coins}</div>
        </div>
      </div>

      {/* Main Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-8">
        {activities.map((activity, index) => (
          <button
            key={index}
            className="border-4 border-green-400 p-6 hover:bg-green-950 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
            onClick={() => alert(`Welcome to ${activity.name}! Built entirely from 1s and ds! 👑`)}
          >
            <pre className="text-xs mb-4 whitespace-pre">
              {asciiButton(activity.name)}
            </pre>
            <div className="text-center text-sm">{activity.description}</div>
          </button>
        ))}
      </div>

      {/* Royal Decree */}
      <div className="border-4 border-green-400 p-6 max-w-4xl mx-auto mb-8">
        <div className="text-center text-xl mb-4">👑 ROYAL DECREE 👑</div>
        <pre className="text-xs whitespace-pre">
{`
d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d
1                                                                    1
d   BY ORDER OF KING 1 AND SIDE KING d:                             d
1                                                                    1
d   This dimension is constructed entirely from the sacred           d
1   characters 1 and d. All who enter must respect the 1D laws.      1
d                                                                    d
1   Everything you see here - every button, every character,         1
d   every pixel - is made from ones and ds.                          d
1                                                                    1
d   The pen oracle has spoken. The prophecy is fulfilled.            d
1                                                                    1
d   Long live the 1D Empire!                                         d
1                                                                    1
d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d
`}
        </pre>
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/kid">
          <button className="border-4 border-green-400 px-8 py-4 hover:bg-green-950 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]">
            <pre className="text-xs whitespace-pre">
{`
d1d1d1d1d1d1d1d1d1d1d
1   EXIT 1D REALM   1
d1d1d1d1d1d1d1d1d1d1d
`}
            </pre>
          </button>
        </Link>
        
        <button 
          onClick={() => {
            const matrix = Array(50).fill(0).map(() => 
              Array(100).fill(0).map(() => Math.random() > 0.5 ? '1' : 'd').join('')
            ).join('\n');
            alert(`1D MATRIX:\n\n${matrix.substring(0, 500)}...`);
          }}
          className="border-4 border-green-400 px-8 py-4 hover:bg-green-950 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
        >
          <pre className="text-xs whitespace-pre">
{`
d1d1d1d1d1d1d1d1d1d1d
1   1D MATRIX VIEW  1
d1d1d1d1d1d1d1d1d1d1d
`}
          </pre>
        </button>
      </div>

      {/* Floating 1s and ds */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        {Array(30).fill(0).map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          >
            {Math.random() > 0.5 ? '1' : 'd'}
          </div>
        ))}
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-100px) rotate(180deg); }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
