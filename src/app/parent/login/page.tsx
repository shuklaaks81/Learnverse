"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ParentLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [error, setError] = useState("");

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

    if (!email || !password) {
      setError("Please fill in all fields!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    // Create parent account
    const parentAccount = {
      email: email,
      password: password,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('parentAccount', JSON.stringify(parentAccount));
    localStorage.setItem('parentLoggedIn', 'true');
    
    alert('✅ Account created successfully!');
    router.push('/parent/dashboard');
  };

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
