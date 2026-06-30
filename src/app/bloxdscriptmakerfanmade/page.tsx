"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function BloxdScriptMaker() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [thinkingStep, setThinkingStep] = useState("");
  const [showProcess, setShowProcess] = useState(false);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [scriptMode, setScriptMode] = useState<"world" | "codeblock">("world");
  const [chatMessages, setChatMessages] = useState<Array<{role: "user" | "system"; message: string}>>([]);
  const [errorReport, setErrorReport] = useState("");
  const [conversationHistory, setConversationHistory] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // New modes
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [deepScanResults, setDeepScanResults] = useState<Array<{type: "error" | "warning" | "info"; message: string}>>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<"generate" | "search" | "scan">("generate");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

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

    setChatMessages(prev => [...prev, { role: "user", message: prompt }]);

    try {
      setThinkingStep("🧠 Understanding your request...");
      await new Promise(resolve => setTimeout(resolve, 500));

      setThinkingStep("📋 Planning which APIs to use...");
      await new Promise(resolve => setTimeout(resolve, 500));

      setThinkingStep("⚡ Generating your script...");
      
      const response = await fetch("/api/generate-bloxd-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt, 
          mode: scriptMode,
          conversationHistory: conversationHistory 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate script");
      }

      const data = await response.json();
      
      setThinkingStep("🧪 Testing for errors...");
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
      
      setChatMessages(prev => [...prev, { role: "system", message: "✅ Script generated successfully!" }]);
      setConversationHistory(prev => prev + `\nUser: ${prompt}\nGenerated: Success\n`);
      setPrompt("");
    } catch (err) {
      setError("Oops! Something went wrong. Try again!");
      console.error(err);
      setThinkingStep("");
      setChatMessages(prev => [...prev, { role: "system", message: "❌ Error generating script. Try again!" }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const reportError = async () => {
    if (!errorReport.trim() || !generatedCode) {
      return;
    }

    setIsGenerating(true);
    setChatMessages(prev => [...prev, { role: "user", message: `🐛 Error: ${errorReport}` }]);

    try {
      setThinkingStep("🔧 Analyzing error and fixing...");
      
      const response = await fetch("/api/generate-bloxd-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: `Fix this error in the previous code: ${errorReport}`,
          mode: scriptMode,
          conversationHistory: conversationHistory + `\nPrevious code had error: ${errorReport}\n`,
          previousCode: generatedCode
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fix script");
      }

      const data = await response.json();
      
      setThinkingStep("✅ Fixed! Check the new code!");
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setGeneratedCode(data.code);
      setValidationWarnings(data.warnings || []);
      setThinkingStep("");
      
      setChatMessages(prev => [...prev, { role: "system", message: "✅ Fixed! Check the updated code." }]);
      setConversationHistory(prev => prev + `\nError reported: ${errorReport}\nFixed: Success\n`);
      setErrorReport("");
    } catch (err) {
      console.error(err);
      setThinkingStep("");
      setChatMessages(prev => [...prev, { role: "system", message: "❌ Couldn't auto-fix. Try describing it differently!" }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    alert("Code copied! 🍌");
  };

  const searchAPIDocs = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const response = await fetch("/api/search-bloxd-docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
      setSearchResults(["Error searching docs. Try again!"]);
    } finally {
      setIsSearching(false);
    }
  };

  const deepScanCode = async () => {
    if (!generatedCode) {
      setDeepScanResults([{type: "error", message: "No code to scan! Generate a script first."}]);
      return;
    }
    
    setIsScanning(true);
    setDeepScanResults([]);
    
    try {
      const response = await fetch("/api/deep-scan-bloxd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: generatedCode }),
      });
      
      const data = await response.json();
      setDeepScanResults(data.issues || []);
      
      if (data.issues.length === 0) {
        setDeepScanResults([{type: "info", message: "✅ No issues found! Code looks good!"}]);
      }
    } catch (err) {
      console.error(err);
      setDeepScanResults([{type: "error", message: "Scan failed. Try again!"}]);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-block mb-6 text-yellow-300 hover:text-yellow-400 transition">
          ← Back Home
        </Link>

        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <svg width="100" height="100" viewBox="0 0 120 120" className="drop-shadow-2xl mx-auto">
              <defs>
                <linearGradient id="blockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#4ADE80", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#16A34A", stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path d="M 60 20 L 100 40 L 60 60 L 20 40 Z" fill="url(#blockGrad)" stroke="#059669" strokeWidth="2" />
              <path d="M 20 40 L 20 80 L 60 100 L 60 60 Z" fill="#16A34A" stroke="#059669" strokeWidth="2" />
              <path d="M 60 60 L 60 100 L 100 80 L 100 40 Z" fill="#15803D" stroke="#059669" strokeWidth="2" />
              <text x="30" y="35" fontSize="10" fill="#FFF" opacity="0.8" className="animate-pulse">{"<div>"}</text>
              <text x="65" y="50" fontSize="8" fill="#FFF" opacity="0.6">{"if()"}</text>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Bloxd Script Maker
          </h1>
          <p className="text-gray-300">Powered by Bob 🍌 & Groq AI ⚡</p>
          <p className="text-gray-400 text-sm">Fan-made tool • Not affiliated with Bloxd.io</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab("generate")}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              activeTab === "generate"
                ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            🚀 Generate
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              activeTab === "search"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            🔍 Search API
          </button>
          <button
            onClick={() => setActiveTab("scan")}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              activeTab === "scan"
                ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            👀 Deep Scan
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main Content (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* GENERATE TAB */}
            {activeTab === "generate" && (
              <>
            {/* Mode Toggle */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <label className="block text-lg font-semibold mb-3 text-center">🎯 Script Mode</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setScriptMode("world")}
                  disabled={isGenerating}
                  className={`py-3 px-4 rounded-xl font-bold transition ${
                    scriptMode === "world"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  🌍 WORLD CODE
                  <div className="text-xs mt-1 opacity-80">Full scripts</div>
                </button>
                <button
                  onClick={() => setScriptMode("codeblock")}
                  disabled={isGenerating}
                  className={`py-3 px-4 rounded-xl font-bold transition ${
                    scriptMode === "codeblock"
                      ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  📦 CODE BLOCK
                  <div className="text-xs mt-1 opacity-80">Compact</div>
                </button>
              </div>
            </div>

            {/* Input */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <label className="block text-xl font-semibold mb-4">What do you want to create? 🎮</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: A flying banana that shoots lasers when you press space"
                className="w-full h-32 bg-black/30 border border-white/30 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 resize-none"
                disabled={isGenerating}
              />
              <button
                onClick={generateScript}
                disabled={isGenerating}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-xl transition transform hover:scale-105 disabled:scale-100"
              >
                {isGenerating ? "🍌 Bob is cooking..." : "🚀 Generate Script!"}
              </button>

              {showProcess && thinkingStep && (
                <div className="mt-4 bg-purple-500/20 border border-purple-400 rounded-lg p-4 text-purple-200 animate-pulse">
                  <p className="text-center font-semibold">{thinkingStep}</p>
                </div>
              )}

              {error && (
                <div className="mt-4 bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">{error}</div>
              )}
            </div>

            {/* Generated Code */}
            {generatedCode && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-green-400">Your Script! 🎉</h2>
                  <button
                    onClick={copyCode}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition"
                  >
                    📋 Copy
                  </button>
                </div>
                <pre className="bg-black/50 border border-green-500/30 rounded-xl p-6 overflow-x-auto max-h-96">
                  <code className="text-green-300 text-sm font-mono">{generatedCode}</code>
                </pre>

                {validationWarnings.length > 0 && (
                  <div className="mt-4 bg-yellow-500/20 border border-yellow-400 rounded-lg p-4">
                    <p className="text-yellow-200 font-semibold mb-2">⚠️ Warnings:</p>
                    <ul className="text-yellow-200 text-sm space-y-1 list-disc list-inside">
                      {validationWarnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
              </>
            )}
            
            {/* SEARCH TAB */}
            {activeTab === "search" && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-4 text-center">🔍 Search Bloxd API Docs</h2>
                <p className="text-gray-300 text-sm mb-4 text-center">
                  Search for functions, blocks, items, callbacks, and more!
                </p>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchAPIDocs()}
                    placeholder="Example: setBlock, player, entity, tick..."
                    className="flex-1 bg-black/30 border border-white/30 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                  <button
                    onClick={searchAPIDocs}
                    disabled={isSearching || !searchQuery.trim()}
                    className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white font-bold px-6 rounded-lg transition"
                  >
                    {isSearching ? "🔍..." : "Search"}
                  </button>
                </div>

                {searchResults.length > 0 && (
                  <div className="bg-black/30 rounded-xl p-4 max-h-96 overflow-y-auto">
                    <h3 className="font-bold mb-3 text-purple-300">Results:</h3>
                    {searchResults.map((result, i) => (
                      <div key={i} className="bg-white/5 rounded-lg p-3 mb-2 border border-purple-500/30">
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{result}</pre>
                      </div>
                    ))}
                  </div>
                )}

                {!isSearching && searchQuery && searchResults.length === 0 && (
                  <div className="bg-gray-500/20 border border-gray-400 rounded-lg p-4 text-center text-gray-300">
                    Type something and hit Search!
                  </div>
                )}
              </div>
            )}

            {/* DEEP SCAN TAB */}
            {activeTab === "scan" && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-4 text-center">👀 Deep Code Scanner</h2>
                <p className="text-gray-300 text-sm mb-4 text-center">
                  Scans your generated code for errors, undefined variables, fake APIs, and more!
                </p>

                <button
                  onClick={deepScanCode}
                  disabled={isScanning || !generatedCode}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-xl transition mb-4"
                >
                  {isScanning ? "🔬 Scanning..." : generatedCode ? "🔍 Scan Generated Code" : "⚠️ Generate Code First"}
                </button>

                {deepScanResults.length > 0 && (
                  <div className="bg-black/30 rounded-xl p-4 max-h-96 overflow-y-auto space-y-2">
                    {deepScanResults.map((issue, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border ${
                          issue.type === "error"
                            ? "bg-red-500/20 border-red-500"
                            : issue.type === "warning"
                            ? "bg-yellow-500/20 border-yellow-500"
                            : "bg-green-500/20 border-green-500"
                        }`}
                      >
                        <p className={`text-sm ${
                          issue.type === "error"
                            ? "text-red-200"
                            : issue.type === "warning"
                            ? "text-yellow-200"
                            : "text-green-200"
                        }`}>
                          {issue.type === "error" ? "❌" : issue.type === "warning" ? "⚠️" : "✅"} {issue.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {!isScanning && !generatedCode && (
                  <div className="bg-gray-500/20 border border-gray-400 rounded-lg p-4 text-center text-gray-300">
                    Go to Generate tab and create a script first!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Chat Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 sticky top-4">
              <h3 className="text-xl font-bold mb-4 text-center">💬 Chat with Bob</h3>
              
              {/* Chat Messages */}
              <div className="bg-black/30 rounded-xl p-4 h-64 overflow-y-auto mb-4 space-y-3">
                {chatMessages.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center italic">Start by generating a script!</p>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div key={i} className={`p-3 rounded-lg ${msg.role === "user" ? "bg-blue-500/20 text-blue-200" : "bg-green-500/20 text-green-200"}`}>
                      <p className="text-xs font-bold mb-1">{msg.role === "user" ? "You" : "Bob"}</p>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Error Report Box */}
              {generatedCode && (
                <div>
                  <label className="block text-sm font-semibold mb-2">🐛 Report Error or Request Fix:</label>
                  <textarea
                    value={errorReport}
                    onChange={(e) => setErrorReport(e.target.value)}
                    placeholder="Example: The code says 'undefined' when I run it"
                    className="w-full h-24 bg-black/30 border border-white/30 rounded-lg p-3 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-red-400 resize-none"
                    disabled={isGenerating}
                  />
                  <button
                    onClick={reportError}
                    disabled={isGenerating || !errorReport.trim()}
                    className="mt-2 w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
                  >
                    🔧 Fix This Error
                  </button>
                </div>
              )}

              <div className="mt-4 text-center text-gray-400 text-xs">
                <p>🍌 Bob remembers your conversation!</p>
                <p className="mt-1">Errors are saved for better fixes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Built with ❤️ for the Bloxd.io community</p>
        </div>
      </div>
    </div>
  );
}
