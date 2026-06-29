"use client";

import { useState } from "react";
import Link from "next/link";

export default function BloxdScriptMaker() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [thinkingStep, setThinkingStep] = useState("");
  const [showProcess, setShowProcess] = useState(false);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  const generateScript = async () => {
    if (!prompt.trim()) {
      setError("Please describe what script you want!");
      return;
    }

    setIsGenerating(true);
    setError("");
    setGeneratedCode("");
    setThinkingStep("");
    setShowProcess(true);

    try {
      // Step 1: Understanding
      setThinkingStep("🧠 Understanding your request...");
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Planning APIs
      setThinkingStep("📋 Planning which APIs to use...");
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Generating Code
      setThinkingStep("⚡ Generating your script...");
      
      const response = await fetch("/api/generate-bloxd-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate script");
      }

      const data = await response.json();
      
      // Step 4: Testing
      setThinkingStep("🧪 Testing for errors...");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Step 5: Dry Run Validation
      if (data.hadErrors) {
        setThinkingStep("🔧 Auto-fixing issues...");
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      
      setThinkingStep("🔬 Running validation checks...");
      await new Promise(resolve => setTimeout(resolve, 700));
      
      setThinkingStep("✅ Done! Your script is ready!");
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setGeneratedCode(data.code);
      setValidationWarnings(data.warnings || []);
      setThinkingStep("");
    } catch (err) {
      setError("Oops! Something went wrong. Try again!");
      console.error(err);
      setThinkingStep("");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    alert("Code copied! 🍌");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-block mb-8 text-yellow-300 hover:text-yellow-400 transition">
          ← Back Home
        </Link>

        {/* Logo: Bob eating code block */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            {/* Code Block */}
            <div className="relative inline-block">
              <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-2xl">
                {/* Block cube */}
                <defs>
                  <linearGradient id="blockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#4ADE80", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#16A34A", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                {/* Top face */}
                <path d="M 60 20 L 100 40 L 60 60 L 20 40 Z" fill="url(#blockGrad)" stroke="#059669" strokeWidth="2" />
                {/* Left face */}
                <path d="M 20 40 L 20 80 L 60 100 L 60 60 Z" fill="#16A34A" stroke="#059669" strokeWidth="2" />
                {/* Right face */}
                <path d="M 60 60 L 60 100 L 100 80 L 100 40 Z" fill="#15803D" stroke="#059669" strokeWidth="2" />
                {/* Code strings flowing in */}
                <text x="30" y="35" fontSize="10" fill="#FFF" opacity="0.8" className="animate-pulse">{"<div>"}</text>
                <text x="65" y="50" fontSize="8" fill="#FFF" opacity="0.6" className="animate-pulse" style={{ animationDelay: "0.3s" }}>{"if()"}</text>
                <text x="25" y="70" fontSize="9" fill="#FFF" opacity="0.7" className="animate-pulse" style={{ animationDelay: "0.6s" }}>{"fn()"}</text>
              </svg>
              
              {/* Bob eating the block */}
              <div className="absolute -bottom-4 -right-8">
                <svg width="60" height="60" viewBox="0 0 60 60">
                  {/* Bob's body */}
                  <ellipse cx="30" cy="35" rx="20" ry="25" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
                  {/* Bob's stem */}
                  <rect x="25" y="8" width="10" height="8" fill="#8B4513" rx="2" />
                  {/* Bob's eyes */}
                  <circle cx="22" cy="28" r="3" fill="#000" />
                  <circle cx="38" cy="28" r="3" fill="#000" />
                  {/* Bob's mouth (open and eating) */}
                  <ellipse cx="30" cy="40" rx="8" ry="6" fill="#000" opacity="0.8" />
                  {/* Tongue */}
                  <ellipse cx="30" cy="42" rx="5" ry="3" fill="#FF6B6B" />
                  {/* Happy eating expression */}
                  <path d="M 20 32 Q 22 35 24 32" stroke="#FFA500" strokeWidth="1.5" fill="none" />
                  <path d="M 36 32 Q 38 35 40 32" stroke="#FFA500" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mt-8 mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Bloxd Script Maker
          </h1>
          <p className="text-gray-300 text-lg mb-2">Powered by Bob 🍌 & Groq AI ⚡</p>
          <p className="text-gray-400 text-sm italic">Fan-made tool • Not affiliated with Bloxd.io</p>
        </div>

        {/* Input Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <label className="block text-xl font-semibold mb-4">
            What script do you want to create? 🎮
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Create a flying banana that shoots lasers when you press space"
            className="w-full h-32 bg-black/30 border border-white/30 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition resize-none"
            disabled={isGenerating}
          />
          
          <button
            onClick={generateScript}
            disabled={isGenerating}
            className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-xl transition transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
          >
            {isGenerating ? "🍌 Bob is cooking your script..." : "🚀 Generate Script!"}
          </button>

          {/* Process Steps Display */}
          {showProcess && thinkingStep && (
            <div className="mt-4 bg-purple-500/20 border border-purple-400 rounded-lg p-4 text-purple-200 animate-pulse">
              <p className="text-center font-semibold">{thinkingStep}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Generated Code Section */}
        {generatedCode && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-400">Your Script is Ready! 🎉</h2>
              <button
                onClick={copyCode}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition transform hover:scale-105"
              >
                📋 Copy Code
              </button>
            </div>
            
            <pre className="bg-black/50 border border-green-500/30 rounded-xl p-6 overflow-x-auto">
              <code className="text-green-300 text-sm font-mono whitespace-pre-wrap">
                {generatedCode}
              </code>
            </pre>

            <div className="mt-4 bg-blue-500/20 border border-blue-400 rounded-lg p-4">
              <p className="text-blue-200 text-sm">
                💡 <strong>How to use:</strong> Copy this code and paste it into the Bloxd.io script editor!
              </p>
            </div>

            {/* Validation Warnings */}
            {validationWarnings.length > 0 && (
              <div className="mt-4 bg-yellow-500/20 border border-yellow-400 rounded-lg p-4">
                <p className="text-yellow-200 font-semibold mb-2">⚠️ Validation Warnings:</p>
                <ul className="text-yellow-200 text-sm space-y-1 list-disc list-inside">
                  {validationWarnings.map((warning, i) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
                <p className="text-yellow-200 text-xs mt-2 italic">
                  These are suggestions - the code should still work, but double-check these areas!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p className="mb-2">🍌 Bob approves this script maker!</p>
          <p>Built with love for the Bloxd.io community ❤️</p>
        </div>
      </div>
    </div>
  );
}
