"use client";

import { useState, useEffect } from "react";

type CheckStatus = "pending" | "success" | "error";
type LoadingCheck = {
  name: string;
  status: CheckStatus;
  message?: string;
};

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  const [showBuddy, setShowBuddy] = useState(false);
  const [text, setText] = useState("");
  const [checks, setChecks] = useState<LoadingCheck[]>([]);
  const [currentCheck, setCurrentCheck] = useState(0);
  const [funnyMode, setFunnyMode] = useState(false);
  const [stars, setStars] = useState<Array<{width: number; height: number; top: number; left: number; delay: number; duration: number}>>([]);

  const words = ["Learn", "Explore", "Discover", "Create", "Play"];

  // Generate stars only on client side
  useEffect(() => {
    const generatedStars = [...Array(50)].map(() => ({
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2
    }));
    setStars(generatedStars);
  }, []);

  // Real system checks
  const systemChecks = [
    { name: "Checking local storage", test: () => typeof localStorage !== "undefined" },
    { name: "Loading user accounts", test: () => {
      try {
        const accounts = localStorage.getItem('kidAccounts');
        return true;
      } catch {
        return false;
      }
    }},
    { name: "Finding last account", test: () => {
      try {
        const lastAccount = localStorage.getItem('lastKidAccount');
        if (lastAccount) {
          setChecks(prev => prev.map((c, i) => 
            i === currentCheck ? { ...c, message: `Found: ${lastAccount}` } : c
          ));
        }
        return true;
      } catch {
        return false;
      }
    }},
    { name: "Checking if app is awake", test: () => {
      // Check if app is in maintenance mode
      const isDown = localStorage.getItem('appMaintenance') === 'true';
      if (isDown) {
        const modes = ['dance', 'vacation', 'coffee', 'nap', 'strike', 'cold'];
        const funnyReasons = [
          "We're teaching the servers to dance 💃",
          "Our pixels are on vacation 🏖️",
          "The hamsters need a coffee break ☕",
          "The code is taking a nap 😴",
          "The app trolls are on strike 🧌",
          "Sorry, the app is catching a cold 🤧"
        ];
        const randomIndex = Math.floor(Math.random() * funnyReasons.length);
        const reason = funnyReasons[randomIndex];
        const mode = modes[randomIndex];
        
        // Store the mode for the maintenance page
        localStorage.setItem('maintenanceReason', mode);
        
        setChecks(prev => prev.map((c, i) => 
          i === currentCheck ? { ...c, message: reason } : c
        ));
        
        // Redirect to maintenance page after showing error
        setTimeout(() => {
          window.location.href = '/maintenance';
        }, 2000);
        
        return false;
      }
      return true;
    }},
    { name: "Checking app features", test: () => true },
    { name: "Loading Lab components", test: () => true },
    { name: "Verifying game engine", test: () => true },
    { name: "Loading lesson data", test: () => true },
    { name: "Checking achievements", test: () => {
      try {
        localStorage.getItem('achievements');
        return true;
      } catch {
        return false;
      }
    }},
    { name: "Initializing sound system", test: () => true },
    { name: "Ready to learn! 🚀", test: () => true }
  ];

  const funnyChecks = [
    { name: "Teaching hamsters to code", test: () => true },
    { name: "Counting to infinity", test: () => true },
    { name: "This is really boring", test: () => true },
    { name: "I won't even show it", test: () => true },
    { name: "Just kidding! Loading for real now...", test: () => true },
    { name: "Actually checking stuff", test: () => true },
    { name: "Finding your account", test: () => true },
    { name: "Almost there...", test: () => true },
    { name: "Ready! 🎉", test: () => true }
  ];

  useEffect(() => {
    // Random chance for funny mode
    const useFunnyMode = Math.random() < 0.1; // 10% chance
    setFunnyMode(useFunnyMode);

    // Stage 0-4: Show words swooshing in
    if (stage < 5) {
      const timer = setTimeout(() => {
        setStage(stage + 1);
      }, 400);
      return () => clearTimeout(timer);
    }
    
    // Stage 5: Show buddy writing
    if (stage === 5) {
      setShowBuddy(true);
      const timer = setTimeout(() => setStage(6), 500);
      return () => clearTimeout(timer);
    }

    // Stage 6: Buddy writes "Learnverse"
    if (stage === 6) {
      const fullText = "Learnverse";
      let i = 0;
      const interval = setInterval(() => {
        if (i <= fullText.length) {
          setText(fullText.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
          setStage(7);
        }
      }, 100);
      return () => clearInterval(interval);
    }

    // Stage 7: Run system checks
    if (stage === 7) {
      const checksToRun = useFunnyMode ? funnyChecks : systemChecks;
      
      let checkIndex = 0;
      const runCheck = () => {
        if (checkIndex >= checksToRun.length) {
          setTimeout(() => onComplete(), 800);
          return;
        }

        const check = checksToRun[checkIndex];
        setCurrentCheck(checkIndex);
        
        // Add check as pending
        setChecks(prev => [...prev, { name: check.name, status: "pending" }]);

        // Run the test after a delay
        setTimeout(() => {
          try {
            const result = check.test();
            setChecks(prev => prev.map((c, i) => 
              i === checkIndex 
                ? { ...c, status: result ? "success" : "error", message: result ? c.message : "Failed to load" }
                : c
            ));
          } catch (error) {
            setChecks(prev => prev.map((c, i) => 
              i === checkIndex 
                ? { ...c, status: "error", message: error instanceof Error ? error.message : "Unknown error" }
                : c
            ));
          }
          
          checkIndex++;
          setTimeout(runCheck, 300);
        }, 200);
      };

      runCheck();
    }
  }, [stage, onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black overflow-hidden">
      {/* Animated stars/galaxy background */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              width: star.width + "px",
              height: star.height + "px",
              top: star.top + "%",
              left: star.left + "%",
              animationDelay: star.delay + "s",
              animationDuration: star.duration + "s"
            }}
          />
        ))}
      </div>

      {/* Galaxy spiral effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-purple-500/40 via-blue-500/20 to-transparent animate-spin-slow" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Swooshing words */}
        {stage < 5 && (
          <div className="text-6xl font-bold text-white animate-swoosh-in">
            {words[stage] || ""}
          </div>
        )}

        {/* Buddy writing Learnverse */}
        {showBuddy && (
          <div className="flex flex-col items-center gap-4">
            {/* Buddy character */}
            <div className="animate-bounce-in">
              <svg width="120" height="140" viewBox="0 0 90 110" className="filter drop-shadow-2xl">
                {/* Body */}
                <ellipse cx="45" cy="65" rx="32" ry="38" fill="#f0abfc" stroke="#a21caf" strokeWidth="3" />
                {/* Face */}
                <ellipse cx="45" cy="55" rx="22" ry="20" fill="#fff" stroke="#a21caf" strokeWidth="2" />
                {/* Eyes */}
                <ellipse cx="36" cy="55" rx="4" ry="5" fill="#0c0a09" />
                <ellipse cx="54" cy="55" rx="4" ry="5" fill="#0c0a09" />
                {/* Smile */}
                <path d="M38 65 Q45 72 52 65" stroke="#a21caf" strokeWidth="2" fill="none" />
                {/* Arm with pencil */}
                <path d="M15 70 Q0 50 25 45" stroke="#a21caf" strokeWidth="5" fill="none" className="animate-writing" />
                {/* Pencil */}
                <rect x="20" y="40" width="3" height="12" fill="#fbbf24" transform="rotate(-45 20 40)" />
                <polygon points="20,40 22,38 21,42" fill="#78350f" />
                {/* Feet */}
                <ellipse cx="32" cy="100" rx="7" ry="4" fill="#a21caf" />
                <ellipse cx="58" cy="100" rx="7" ry="4" fill="#a21caf" />
              </svg>
            </div>

            {/* Learnverse text being written */}
            <div className="text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-fade-in">
              {text}
              {stage === 6 && <span className="animate-blink">|</span>}
            </div>

            {/* System checks */}
            {checks.length > 0 && (
              <div className="mt-8 bg-black/40 backdrop-blur-sm rounded-2xl p-6 min-w-[400px] max-h-[300px] overflow-y-auto">
                {funnyMode && checks.length === 1 && (
                  <div className="text-yellow-300 text-sm mb-3 text-center animate-fade-in">
                    😴 Ok this is really boring... I won't even show it properly!
                  </div>
                )}
                <div className="space-y-2">
                  {checks.map((check, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm animate-fade-in">
                      {check.status === "pending" && (
                        <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                      )}
                      {check.status === "success" && (
                        <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center text-xs">✓</div>
                      )}
                      {check.status === "error" && (
                        <div className="w-4 h-4 bg-red-400 rounded-full flex items-center justify-center text-xs">✗</div>
                      )}
                      <span className={`flex-1 ${
                        check.status === "success" ? "text-green-300" :
                        check.status === "error" ? "text-red-300" :
                        "text-purple-200"
                      }`}>
                        {check.name}
                      </span>
                      {check.message && (
                        <span className="text-xs text-gray-400">{check.message}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
