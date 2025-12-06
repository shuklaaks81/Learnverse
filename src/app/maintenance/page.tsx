"use client";
import React, { useState, useEffect } from "react";

export default function Maintenance() {
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ownerAccess, setOwnerAccess] = useState(false);
  const [mode, setMode] = useState<string>("");

  useEffect(() => {
    // Get maintenance reason from localStorage
    const reason = localStorage.getItem('maintenanceReason') || '';
    setMode(reason);
  }, []);

  // Dancing people animation
  if (mode === 'dance') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center justify-center overflow-hidden relative">
        <div className="text-6xl font-bold text-white mb-8 animate-bounce">🕺 We're teaching the servers to dance! 💃</div>
        <div className="flex gap-4 flex-wrap justify-center">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="text-8xl animate-dance" style={{animationDelay: `${i * 0.1}s`}}>
              {i % 4 === 0 ? '🕺' : i % 4 === 1 ? '💃' : i % 4 === 2 ? '🕴️' : '👯'}
            </div>
          ))}
        </div>
        <p className="text-white text-2xl mt-8">Check back soon! The servers are learning the moonwalk!</p>
      </div>
    );
  }

  // Pixels on vacation - broken app look
  if (mode === 'vacation') {
    return (
      <div className="min-h-screen bg-black overflow-hidden relative">
        {/* Glitchy broken pixels */}
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-glitch"
            style={{
              width: Math.random() * 100 + 20 + 'px',
              height: Math.random() * 100 + 20 + 'px',
              background: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 2 + 's',
              filter: 'blur(2px)',
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <div className="text-8xl mb-4 animate-spin-slow">🏖️</div>
          <h1 className="text-6xl font-bold animate-glitch-text" style={{
            color: 'white',
            textShadow: '3px 3px 0 red, -3px -3px 0 blue'
          }}>
            P̴i̷x̶e̸l̵s̷ ̶o̴n̷ ̵V̸a̵c̸a̶t̷i̸o̵n̶
          </h1>
          <p className="text-white text-3xl mt-4 animate-glitch">T͟h͟e͟y͟'l͟l͟ b͟e͟ b͟a͟c͟k͟ s͟o͟o͟n͟!</p>
        </div>
      </div>
    );
  }

  // Hamsters drinking coffee
  if (mode === 'coffee') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-200 to-orange-300 flex flex-col items-center justify-center overflow-hidden relative">
        {/* Coffee steam */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float-up"
            style={{
              left: `${20 + i * 5}%`,
              bottom: '30%',
              animationDelay: `${i * 0.3}s`
            }}
          >
            ☁️
          </div>
        ))}
        <div className="text-6xl font-bold text-amber-900 mb-8">The hamsters need a coffee break! ☕</div>
        <div className="flex gap-6 flex-wrap justify-center mb-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col items-center animate-bounce" style={{animationDelay: `${i * 0.2}s`}}>
              <div className="text-7xl">🐹</div>
              <div className="text-5xl mt-2">☕</div>
            </div>
          ))}
        </div>
        <div className="text-3xl text-amber-900 font-bold animate-pulse">Refueling... Please wait!</div>
      </div>
    );
  }

  // Code taking a nap - Z's floating up
  if (mode === 'nap') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex flex-col items-center justify-center overflow-hidden relative">
        {/* Floating Z's */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white animate-float-up"
            style={{
              fontSize: `${Math.random() * 40 + 20}px`,
              left: `${Math.random() * 100}%`,
              bottom: '-10%',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 4}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          >
            Zzz
          </div>
        ))}
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-9xl mb-4 animate-pulse">😴</div>
          <h1 className="text-6xl font-bold text-white mb-4">The code is taking a nap...</h1>
          <p className="text-3xl text-purple-200">Shhh... it'll wake up soon!</p>
          <div className="mt-8 text-7xl animate-bounce">🛏️</div>
        </div>
      </div>
    );
  }

  // Trolls on strike - tapping sticks
  if (mode === 'strike') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 flex flex-col items-center justify-center overflow-hidden relative">
        <div className="text-6xl font-bold text-yellow-400 mb-8 animate-shake">🧌 The app trolls are on STRIKE! 🧌</div>
        <div className="grid grid-cols-10 gap-2 mb-8">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="text-5xl animate-tap" style={{animationDelay: `${(i % 10) * 0.1}s`}}>
              🧌
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="text-4xl animate-tap" style={{animationDelay: `${i * 0.05}s`}}>
              🪵
            </div>
          ))}
        </div>
        <p className="text-white text-3xl font-bold animate-pulse">*TAP TAP TAP TAP TAP*</p>
        <p className="text-yellow-300 text-xl mt-4">Negotiating with the trolls... be right back!</p>
      </div>
    );
  }

  // App has a cold - green slime everywhere
  if (mode === 'cold') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-lime-700 flex flex-col items-center justify-center overflow-hidden relative">
        {/* Dripping slime */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-drip"
            style={{
              left: `${i * 3.5}%`,
              top: '-5%',
              animationDelay: `${i * 0.2}s`
            }}
          >
            <div className="w-8 h-20 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-80" />
          </div>
        ))}
        {/* Slime puddles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-green-500 opacity-60 animate-pulse"
            style={{
              width: `${Math.random() * 150 + 100}px`,
              height: `${Math.random() * 50 + 30}px`,
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
        <div className="relative z-10 flex flex-col items-center bg-black/40 backdrop-blur-sm rounded-3xl p-12">
          <div className="text-9xl mb-4 animate-bounce">🤧</div>
          <h1 className="text-6xl font-bold text-green-300 mb-4 drop-shadow-lg">Sorry, the app is catching a cold!</h1>
          <div className="text-5xl mb-4">🤮💚🦠</div>
          <p className="text-3xl text-green-200">Taking medicine... be back soon!</p>
          <div className="flex gap-4 mt-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="text-6xl animate-bounce" style={{animationDelay: `${i * 0.2}s`}}>
                🧪
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default maintenance page with owner login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Aksgkp81") {
      // Set a cookie for owner access (expires in 1 hour)
      document.cookie = `owner=true; path=/; max-age=3600`;
      setOwnerAccess(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-700 to-gray-800 text-white p-8">
      <div className="max-w-xl w-full bg-black/80 rounded-2xl shadow-2xl p-10 flex flex-col items-center border-4 border-red-700">
        <h1 className="text-4xl font-bold mb-6 text-red-400 animate-pulse">🚧 Sorry!</h1>
        <p className="mb-6 text-center text-lg text-red-200">
          The Learnverse is not available due to errors stopping it.<br/>
          It will be available shortly, or in a month, or possibly a year!<br/>
          (A year is very unlikely!)
        </p>
        <button
          className="mt-4 text-blue-300 underline hover:text-blue-400"
          onClick={() => setShowLogin((v) => !v)}
        >
          {showLogin ? "Hide Owner Login" : "If you are the owner, click here to enter password"}
        </button>
        {showLogin && !ownerAccess && (
          <form onSubmit={handleLogin} className="mt-6 w-full max-w-xs flex flex-col items-center">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Owner password"
              className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 text-white mb-2"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Enter
            </button>
            {error && <div className="text-red-400 mt-2 text-sm">{error}</div>}
          </form>
        )}
        {showLogin && ownerAccess && (
          <div className="mt-8 w-full max-w-xs flex flex-col items-center">
            <div className="text-green-400 text-lg font-bold mb-4">Welcome, Owner! 🎉</div>
            <div className="flex flex-col gap-3 w-full">
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => window.location.href = "/"}
              >
                Go to Main App
              </button>
              <button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => window.location.href = "/owner"}
              >
                Go to Secret Owner Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
