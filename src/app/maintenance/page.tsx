"use client";
import React, { useState } from "react";

export default function Maintenance() {
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ownerAccess, setOwnerAccess] = useState(false);

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
