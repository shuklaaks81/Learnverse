"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ParentLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [error, setError] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  // Check if Premium version is selected
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const version = localStorage.getItem('learnverseVersion') || 'original';
      setIsPremium(version === 'premium');
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check if parent account exists
    const savedParent = localStorage.getItem('parentAccount');
    
    if (!savedParent) {
      setError("No account found! Please create an account first.");
      return;
    }

    const parentData = JSON.parse(savedParent);
    
    if (parentData.email === email && parentData.password === password) {
      // Login successful
      localStorage.setItem('parentLoggedIn', 'true');
      router.push('/parent/dashboard');
    } else {
      setError("❌ Incorrect email or password!");
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!familyName || !email || !password) {
      setError("Please fill in all fields!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    // Create parent account
    const parentAccount = {
      familyName: familyName.trim(),
      email: email,
      password: password,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('parentAccount', JSON.stringify(parentAccount));
    localStorage.setItem('parentLoggedIn', 'true');
    
    alert(`✅ Account created successfully!\n\nFamily Name: ${familyName.trim()}`);
    router.push('/parent/dashboard');
  };

  // PREMIUM FUTURISTIC PARENT LOGIN! 💎✨
  if (isPremium) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        {/* Animated Cyber Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950">
          {/* Glowing grid lines */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" style={{top: `${i * 5}%`, animationDelay: `${i * 0.1}s`}} />
            ))}
            {[...Array(20)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent" style={{left: `${i * 5}%`, animationDelay: `${i * 0.1}s`}} />
            ))}
          </div>
          
          {/* Neon particles */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float-particle"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                background: `${['#0ff', '#f0f', '#ff0', '#0f0'][Math.floor(Math.random() * 4)]}`,
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`,
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 15 + 10 + 's'
              }}
            />
          ))}

          {/* Electric arcs */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-cyan-400 via-transparent to-transparent animate-pulse" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-pink-400 via-transparent to-transparent animate-pulse" style={{animationDelay: '1s'}} />
        </div>

        {/* Ultra Glassmorphism Login Card */}
        <div className="w-full max-w-2xl relative z-10">
          <div className="relative bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-3xl rounded-3xl border-4 border-white/30 shadow-[0_0_100px_rgba(128,0,255,0.8),inset_0_0_60px_rgba(128,0,255,0.3)] p-8 sm:p-12 overflow-hidden animate-card-appear">
            {/* Animated holographic overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-pink-500/30 animate-hologram pointer-events-none" />
            
            {/* Corner accents with glow */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-radial from-cyan-400/70 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-radial from-pink-400/70 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-radial from-purple-400/70 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-radial from-yellow-400/70 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}} />

            <div className="relative z-10">
              <h1 className="text-4xl sm:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-glow-text drop-shadow-[0_0_30px_rgba(0,255,255,0.8)]">
                👨‍👩‍👧‍👦 Parent {isCreatingAccount ? 'Sign Up' : 'Login'}
              </h1>
              <p className="text-center text-cyan-200 mb-8 font-bold text-xl drop-shadow-glow">
                {isCreatingAccount ? 'Create your parent account 🌟' : 'Welcome back! 👋'}
              </p>

              <form onSubmit={isCreatingAccount ? handleCreateAccount : handleLogin} className="space-y-6">
                {isCreatingAccount && (
                  <div>
                    <label className="block text-xl font-bold text-pink-300 mb-3 drop-shadow-glow">
                      👨‍👩‍👧‍👦 Family Name
                    </label>
                    <input
                      type="text"
                      required
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      className="w-full px-6 py-5 text-lg bg-white/10 backdrop-blur-xl border-2 border-pink-400/50 rounded-2xl text-white placeholder-yellow-300 focus:outline-none focus:border-pink-400 focus:shadow-[0_0_40px_rgba(255,0,255,0.7)] transition-all duration-300 animate-electric-border"
                      placeholder="Enter your Family Name"
                      maxLength={100}
                    />
                    <p className="text-cyan-200 text-sm mt-2 drop-shadow-glow">
                      ✨ This will be used to group your kids' accounts
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xl font-bold text-cyan-300 mb-3 drop-shadow-glow">
                    📧 Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-5 text-lg bg-white/10 backdrop-blur-xl border-2 border-cyan-400/50 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_40px_rgba(0,255,255,0.7)] transition-all duration-300 animate-electric-border"
                    placeholder="parent@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xl font-bold text-purple-300 mb-3 drop-shadow-glow">
                    🔒 Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-5 text-lg bg-white/10 backdrop-blur-xl border-2 border-purple-400/50 rounded-2xl text-white placeholder-cyan-300 focus:outline-none focus:border-purple-400 focus:shadow-[0_0_40px_rgba(255,0,255,0.7)] transition-all duration-300 animate-electric-border"
                    placeholder={isCreatingAccount ? "Create a password (min 6 characters)" : "Enter your password"}
                    minLength={isCreatingAccount ? 6 : undefined}
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border-2 border-red-400 text-red-300 px-6 py-4 rounded-2xl text-center font-bold text-lg backdrop-blur-xl animate-shake shadow-[0_0_30px_rgba(255,0,0,0.5)]">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white py-6 px-8 rounded-2xl hover:shadow-[0_0_60px_rgba(128,0,255,1)] transition-all font-bold text-2xl hover:scale-105 border-4 border-white/40 animate-button-glow"
                >
                  {isCreatingAccount ? '✨ CREATE ACCOUNT' : '🚀 LOGIN'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setIsCreatingAccount(!isCreatingAccount);
                    setError("");
                    setEmail("");
                    setPassword("");
                  }}
                  className="text-cyan-400 hover:text-pink-400 font-bold text-xl underline transition-all duration-300 hover:scale-110 inline-block drop-shadow-glow"
                >
                  {isCreatingAccount ? 'Already have an account? Login ➜' : "Don't have an account? Sign Up ➜"}
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link href="/" className="text-purple-300 hover:text-cyan-300 font-bold text-lg transition-colors duration-300 inline-flex items-center gap-2 hover:scale-110">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NORMAL VERSION
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient">
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
      `}</style>

      <div className="w-full max-w-2xl bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 sm:p-12 border-4 border-white/60">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          👨‍👩‍👧‍👦 Parent {isCreatingAccount ? 'Sign Up' : 'Login'}
        </h1>
        <p className="text-center text-gray-700 mb-8 font-semibold text-lg">
          {isCreatingAccount ? 'Create your parent account 🌟' : 'Welcome back! 👋'}
        </p>

        <form onSubmit={isCreatingAccount ? handleCreateAccount : handleLogin} className="space-y-6">
          {isCreatingAccount && (
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-2">
                Family Name 👨‍👩‍👧‍👦
              </label>
              <input
                type="text"
                required
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full px-6 py-4 text-lg border-4 border-pink-300 rounded-xl focus:ring-4 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter your Family Name"
                maxLength={100}
              />
              <p className="text-gray-600 text-sm mt-2">
                ✨ This will be used to group your kids' accounts
              </p>
            </div>
          )}

          <div>
            <label className="block text-lg font-bold text-gray-800 mb-2">
              Email Address 📧
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 text-lg border-4 border-indigo-300 rounded-xl focus:ring-4 focus:ring-indigo-500 focus:border-transparent"
              placeholder="parent@example.com"
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-800 mb-2">
              Password 🔒
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 text-lg border-4 border-indigo-300 rounded-xl focus:ring-4 focus:ring-indigo-500 focus:border-transparent"
              placeholder={isCreatingAccount ? "Create a password (min 6 characters)" : "Enter your password"}
              minLength={isCreatingAccount ? 6 : undefined}
            />
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl text-center font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-5 px-8 rounded-2xl hover:shadow-2xl transition-all font-bold text-xl hover:scale-105 shadow-lg"
          >
            {isCreatingAccount ? '✨ Create Account' : '🚀 Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsCreatingAccount(!isCreatingAccount);
              setError("");
              setEmail("");
              setPassword("");
            }}
            className="text-indigo-600 hover:text-indigo-700 font-bold text-lg underline"
          >
            {isCreatingAccount ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-600 hover:text-gray-800 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
