'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OwnerPage() {

  // Owner login state
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Ultra-secret event state
  const [secretClicks, setSecretClicks] = useState(0);
  const [secretScrolls, setSecretScrolls] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [secretStage, setSecretStage] = useState<
    | 'idle'
    | 'waiting'
    | 'quirky'
    | 'glitch'
    | 'film'
    | 'skull'
    | 'whiteout'
    | 'normal'
    | 'rampage1'
    | 'whiteout2'
    | 'buzz'
    | 'rampage2'
    | 'reveal'
    | null
  >(null);

  // Countdown timer for waiting stage
  const [waitingSeconds, setWaitingSeconds] = useState(120);

  useEffect(() => {
    if (secretStage === 'waiting') {
      setWaitingSeconds(120);
      const interval = setInterval(() => {
        setWaitingSeconds((s) => {
          if (s <= 1) {
            clearInterval(interval);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [secretStage]);
  const secretPhase = useRef<'idle' | 'clicking' | 'scrolling' | 'done'>('idle');
  const secretTimeouts = useRef<number[]>([]);

  // Helper: clear all timeouts
  const clearSecretTimeouts = () => {
    secretTimeouts.current.forEach((t) => clearTimeout(t));
    secretTimeouts.current = [];
  };

  // Sequence controller
  useEffect(() => {
    if (!secretStage) return;
    clearSecretTimeouts();
    if (secretStage === 'waiting') {
      // 2 minutes of nothing (for testing)
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage('quirky'), 2 * 60 * 1000));
    } else if (secretStage === 'quirky') {
      // 1 min: buttons open wrong pages, blank areas, text scramble
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage('glitch'), 60 * 1000));
    } else if (secretStage === 'glitch') {
      // 1 min: more glitches, missing/blank, text corruption
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage('film'), 60 * 1000));
    } else if (secretStage === 'film') {
      // 1 min: 1890s film look
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage('skull'), 60 * 1000));
    } else if (secretStage === 'skull') {
      // Skull flashes, then whiteout
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage('whiteout'), 5000));
    } else if (secretStage === 'whiteout') {
      // 10 sec white screen
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage('normal'), 10000));
    } else if (secretStage === 'normal') {
      // 30 sec normal
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage('rampage1'), 30000));
    } else if (secretStage === 'rampage1') {
      // 30 sec: app glitches, cycles through eras
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage('whiteout2'), 30000));
    } else if (secretStage === 'whiteout2') {
      // 5 sec white screen
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage('buzz'), 5000));
    } else if (secretStage === 'buzz') {
      // 10 sec buzzing
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage('rampage2'), 10000));
    } else if (secretStage === 'rampage2') {
      // 20 sec: final rampage
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage('reveal'), 20000));
    }
    // 'reveal' is final
    return clearSecretTimeouts;
  }, [secretStage]);

  // Start the sequence when secret is triggered
  useEffect(() => {
    if (showSecret && !secretStage) {
      setSecretStage('waiting');
    }
  }, [showSecret, secretStage]);

  // Global effects for each stage
  useEffect(() => {
    document.body.classList.remove('secret-quirky','secret-glitch','secret-film','secret-skull','secret-whiteout','secret-normal','secret-rampage1','secret-whiteout2','secret-buzz','secret-rampage2','secret-reveal');
    if (secretStage) document.body.classList.add(`secret-${secretStage}`);
    return () => {
      if (secretStage) document.body.classList.remove(`secret-${secretStage}`);
    };
  }, [secretStage]);

  // Handle scrolls for secret event
  useEffect(() => {
    if (secretPhase.current === 'scrolling') {
      const onScroll = () => {
        setSecretScrolls((s) => {
          if (s + 1 >= 20) {
            setShowSecret(true);
            secretPhase.current = 'done';
            setTimeout(() => setSecretStage('waiting'), 1000); // Start the event after 1s
            window.removeEventListener('wheel', onScroll);
            return 20;
          }
          return s + 1;
        });
      };
      window.addEventListener('wheel', onScroll);
      return () => window.removeEventListener('wheel', onScroll);
    }
  }, [secretScrolls]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Aksgkp81') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password!');
      setPassword('');
    }
  };

  const giveCoins = () => {
    const currentKid = JSON.parse(localStorage.getItem('currentKid') || '{}');
    if (currentKid.kidId) {
      localStorage.setItem(`coins_${currentKid.kidId}`, '100000');
      alert('✅ 100,000 coins added to current account!');
    } else {
      alert('❌ No kid account found. Please create/login first.');
    }
  };

  const activateLegendaryMode = () => {
    localStorage.setItem('legendaryMode', 'true');
    alert('🔮 Legendary Mode Activated! Refresh any page to see the effect.');
  };

  const deactivateLegendaryMode = () => {
    localStorage.setItem('legendaryMode', 'false');
    alert('✅ Legendary Mode Deactivated! Refresh any page.');
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset ALL progress? This cannot be undone!')) {
      localStorage.clear();
      alert('🗑️ All data cleared!');
      router.push('/');
    }
  };

  const exportData = () => {
    const data: Record<string, any> = {};
    
    // Export all localStorage data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || '');
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }

    // Create downloadable file
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `learning-app-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('📥 Data exported successfully!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border-2 border-purple-500">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-purple-400 mb-2">Owner Access</h1>
            <p className="text-gray-400 text-sm">Enter password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-purple-500 rounded-xl focus:outline-none focus:border-purple-400"
                placeholder="Enter owner password"
                autoFocus
              />
              {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              🔓 Unlock
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6 relative">
        {/* Ultra-secret clickable area (hidden) */}
        <button
          aria-label="Secret Trigger"
          style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, opacity: 0, zIndex: 50 }}
          tabIndex={-1}
          onClick={() => {
            if (secretPhase.current === 'idle' || secretPhase.current === 'clicking') {
              setSecretClicks((c) => {
                if (c + 1 >= 1234) {
                  secretPhase.current = 'scrolling';
                  return 1234;
                }
                secretPhase.current = 'clicking';
                return c + 1;
              });
            }
          }}
        />

        {/* TEST BUTTON: Instantly activate the ultra-secret event */}
        <button
          className="fixed top-4 left-4 z-[1001] px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-yellow-400 text-black font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
          onClick={() => {
            setShowSecret(true);
            setSecretStage('waiting');
          }}
        >
          🚨 Activate Secret Event (Test)
        </button>
        {/* Optional: subtle visual cue for dev/testing, remove for production */}
        {/* <div style={{position:'absolute',top:12,right:12,width:32,height:32,background:'rgba(255,0,255,0.1)',zIndex:49,borderRadius:16}} /> */}

        {/* Ultra-secret modal */}
        {showSecret && (
          <>
            {/* Overlay for all stages */}
            <div className={`fixed inset-0 z-[1000] pointer-events-none transition-all duration-1000 ${secretStage==='whiteout'||secretStage==='whiteout2'?'bg-white':'bg-transparent'}`}/>
            {/* Countdown timer for waiting stage */}
            {secretStage==='waiting' && (
              <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[1100] bg-black bg-opacity-80 px-8 py-4 rounded-2xl shadow-2xl border-4 border-fuchsia-400 text-center">
                <div className="text-2xl text-fuchsia-200 font-bold mb-1">Secret Event Starting In...</div>
                <div className="text-5xl text-yellow-300 font-extrabold tracking-widest">{Math.floor(waitingSeconds/60)}:{(waitingSeconds%60).toString().padStart(2,'0')}</div>
              </div>
            )}
            {/* Skull flash */}
            {secretStage==='skull' && (
              <div className="fixed inset-0 z-[1010] flex items-center justify-center bg-black bg-opacity-90 animate-pulse">
                <div className="text-[10vw] text-white animate-flash">💀</div>
              </div>
            )}
            {/* 1890s film look */}
            {secretStage==='film' && (
              <div className="fixed inset-0 z-[1010] pointer-events-none" style={{mixBlendMode:'multiply',background:'rgba(60,40,20,0.7)',filter:'grayscale(1) sepia(1) blur(1px)'}}>
                <div className="absolute inset-0 w-full h-full animate-filmgrain"/>
              </div>
            )}
            {/* Final secret reveal */}
            {secretStage==='reveal' && (
              <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-gradient-to-br from-black via-fuchsia-900 to-yellow-100 animate-secretfade">
                <div className="p-12 rounded-3xl shadow-2xl border-8 border-fuchsia-500 text-center max-w-2xl bg-black bg-opacity-80">
                  <div className="text-7xl mb-6 animate-bounce">🦄✨🔑</div>
                  <h2 className="text-4xl font-extrabold text-fuchsia-300 mb-4">THE BIGGEST SECRET OF ALL TIME</h2>
                  <p className="text-2xl text-yellow-200 mb-6">You have truly gone above and beyond.<br/>Welcome to the inner circle of Learnverse.<br/><span className="text-pink-300 font-bold">(You are now a legend!)</span></p>
                  <div className="text-5xl mb-6 animate-spin">🔓</div>
                  <button
                    className="mt-2 px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-yellow-400 text-black font-extrabold rounded-2xl shadow-lg hover:scale-105 transition-all text-2xl"
                    onClick={() => { setShowSecret(false); setSecretStage(null); clearSecretTimeouts(); }}
                  >Close</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Optional: Progress indicator for dev/testing, remove for production */}
        {/* <div style={{position:'absolute',top:48,right:12,zIndex:51,color:'#fff',fontSize:12}}>
          {secretPhase.current === 'clicking' && `${secretClicks}/1234 clicks`}
          {secretPhase.current === 'scrolling' && `${secretScrolls}/20 scrolls`}
        </div> */}

        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 mb-6 border-2 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-purple-400">👑 Owner Dashboard</h1>
              <p className="text-gray-400 mt-1">Testing & Development Tools</p>
            </div>
            <Link
              href="/"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
            >
              🚪 Exit
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 mb-6 border-2 border-purple-500">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={giveCoins}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              💰 Give 100K Coins
            </button>
            <button
              onClick={activateLegendaryMode}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              🔮 Activate Legendary Mode
            </button>
            <button
              onClick={deactivateLegendaryMode}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              ✨ Deactivate Legendary Mode
            </button>
            <button
              onClick={exportData}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              📥 Export All Data
            </button>
            <button
              onClick={resetProgress}
              className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all hover:scale-105 md:col-span-2"
            >
              🗑️ Reset All Progress
            </button>
          </div>
        </div>

        {/* Unused Ideas Section */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 mb-6 border-2 border-purple-500">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">💡 Ideas Not Yet Implemented</h2>
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-xl border-l-4 border-yellow-500">
              <h3 className="font-bold text-yellow-400 mb-2">🎯 Multiplayer Games</h3>
              <p className="text-gray-300 text-sm">Kids could compete with friends in real-time learning games</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-xl border-l-4 border-blue-500">
              <h3 className="font-bold text-blue-400 mb-2">📊 Parent Analytics Dashboard</h3>
              <p className="text-gray-300 text-sm">Detailed charts showing learning progress over time</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-xl border-l-4 border-green-500">
              <h3 className="font-bold text-green-400 mb-2">🏆 Leaderboards</h3>
              <p className="text-gray-300 text-sm">Weekly/monthly leaderboards for top learners</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-xl border-l-4 border-pink-500">
              <h3 className="font-bold text-pink-400 mb-2">🎨 Buddy Customization Studio</h3>
              <p className="text-gray-300 text-sm">Advanced editor to draw custom buddies with different body shapes, hairstyles, accessories</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-xl border-l-4 border-purple-500">
              <h3 className="font-bold text-purple-400 mb-2">📚 Lesson Creator Tool</h3>
              <p className="text-gray-300 text-sm">Parents could create custom lessons for their kids</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-xl border-l-4 border-red-500">
              <h3 className="font-bold text-red-400 mb-2">🎮 VR Learning Mode</h3>
              <p className="text-gray-300 text-sm">Virtual reality lessons for immersive learning</p>
            </div>
          </div>
        </div>

        {/* App Statistics */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border-2 border-purple-500">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">📊 App Info</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-3xl font-bold text-blue-400">20</div>
              <div className="text-gray-400 text-sm mt-1">Lessons</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-3xl font-bold text-green-400">6</div>
              <div className="text-gray-400 text-sm mt-1">Games</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-3xl font-bold text-yellow-400">12</div>
              <div className="text-gray-400 text-sm mt-1">Achievements</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-3xl font-bold text-purple-400">16</div>
              <div className="text-gray-400 text-sm mt-1">Shop Items</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-3xl font-bold text-cyan-400">🗺️</div>
              <div className="text-gray-400 text-sm mt-1">Progress Map</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-3xl font-bold text-pink-400">🔮</div>
              <div className="text-gray-400 text-sm mt-1">Legendary Mode</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-3xl font-bold text-orange-400">8</div>
              <div className="text-gray-400 text-sm mt-1">Learning Units</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-3xl font-bold text-indigo-400">40</div>
              <div className="text-gray-400 text-sm mt-1">Deep Topics</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
