"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function BloxdScriptMaker() {
  const [prompt, setPrompt] = useState("");
  const [lastPrompt, setLastPrompt] = useState(""); // Save original prompt for auto-fix
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
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1); // Step-based flow

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
      setLastPrompt(prompt); // Save for auto-fix
      setPrompt("");
      
      // Auto-advance to Step 2: Deep Scan & Auto-Fix Loop
      setCurrentStep(2);
      await new Promise(resolve => setTimeout(resolve, 500));
      await autoDeepScan(data.code);
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
        body: JSON.stringify({ code: generatedCode, mode: scriptMode }),
      });
      
      const data = await response.json();
      setDeepScanResults(data.issues || []);
      
      if (data.issues.length === 0) {
        setDeepScanResults([{type: "info", message: "✅ No issues found! Code looks good!"}]);
      }
      
      // Move to Step 3 after scan
      setCurrentStep(3);
    } catch (err) {
      console.error(err);
      setDeepScanResults([{type: "error", message: "Scan failed. Try again!"}]);
    } finally {
      setIsScanning(false);
    }
  };

  const autoDeepScan = async (code: string) => {
    const MAX_ITERATIONS = 3;
    let currentCode = code;
    let iteration = 0;
    
    while (iteration < MAX_ITERATIONS) {
      iteration++;
      setDeepScanResults([]);
      setIsScanning(true);
      
      setChatMessages(prev => [...prev, { 
        role: "system", 
        message: `🔬 Deep Scan + Simulation (Attempt ${iteration}/${MAX_ITERATIONS})...` 
      }]);
      
      try {
        const response = await fetch("/api/deep-scan-bloxd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: currentCode, mode: scriptMode })
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || "Scan failed");
        
        setDeepScanResults(data.issues || []);
        
        const errors = data.issues?.filter((i: any) => i.type === "error") || [];
        const warnings = data.issues?.filter((i: any) => i.type === "warning") || [];
        
        if (errors.length === 0) {
          // SUCCESS! No errors found
          setChatMessages(prev => [...prev, { 
            role: "system", 
            message: `✅ Code is clean! (${warnings.length} warnings, ${iteration} ${iteration === 1 ? 'scan' : 'scans'})` 
          }]);
          setGeneratedCode(currentCode);
          setIsScanning(false);
          setCurrentStep(3);
          return;
        }
        
        // AUTO-FIX: Send errors back to AI
        setChatMessages(prev => [...prev, { 
          role: "system", 
          message: `🔧 Found ${errors.length} errors. Auto-fixing...` 
        }]);
        
        const errorPrompt = `FIX THESE ERRORS:\n${errors.map((e: any) => `- ${e.message}`).join('\n')}\n\nOriginal request: ${lastPrompt || 'Fix the code'}`;
        
        const fixResponse = await fetch("/api/generate-bloxd-script", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: errorPrompt,
            mode: scriptMode,
            conversationHistory: conversationHistory + `\nFix iteration ${iteration}\n`,
            previousCode: currentCode
          })
        });
        
        const fixData = await fixResponse.json();
        
        if (!fixResponse.ok) throw new Error(fixData.error || "Fix generation failed");
        
        currentCode = fixData.code;
        setGeneratedCode(currentCode);
        
        // Continue loop for next scan iteration
        
      } catch (error) {
        console.error("Auto-fix error:", error);
        setChatMessages(prev => [...prev, { 
          role: "system", 
          message: `❌ Auto-fix failed: ${error instanceof Error ? error.message : String(error)}` 
        }]);
        setIsScanning(false);
        setCurrentStep(3);
        return;
      }
    }
    
    // Max iterations reached
    setChatMessages(prev => [...prev, { 
      role: "system", 
      message: `⚠️ Reached max iterations (${MAX_ITERATIONS}). Some errors may remain.` 
    }]);
    setIsScanning(false);
    setCurrentStep(3);
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

        {/* Step Progress Bar */}
        <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {[
              { num: 1, label: "Generate", icon: "🚀" },
              { num: 2, label: "Scanning", icon: "🔬" },
              { num: 3, label: "Review", icon: "👀" },
              { num: 4, label: "Done", icon: "✅" }
            ].map((step, i) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                      currentStep >= step.num
                        ? "bg-gradient-to-r from-green-500 to-blue-500 scale-110 shadow-lg"
                        : "bg-gray-600"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p className={`text-sm mt-2 font-bold ${currentStep >= step.num ? "text-white" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                </div>
                {i < 3 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all ${
                      currentStep > step.num ? "bg-gradient-to-r from-green-500 to-blue-500" : "bg-gray-600"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation - REMOVED */}

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main Content (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* STEP 1: GENERATE */}
            {currentStep >= 1 && (
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
            
            {/* STEP 2 & 3: AUTO SCAN + REVIEW RESULTS */}
            {currentStep >= 2 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  {isScanning ? "🔬 Scanning Code..." : "👀 Scan Results"}
                </h2>

                {isScanning && (
                  <div className="text-center py-8">
                    <div className="animate-spin text-6xl mb-4">🔬</div>
                    <p className="text-gray-300">Checking for errors, undefined variables, fake APIs...</p>
                  </div>
                )}

                {!isScanning && deepScanResults.length > 0 && (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {deepScanResults.map((issue, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-lg border ${
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

                {!isScanning && currentStep === 3 && (
                  <div className="mt-6 flex gap-4 justify-center">
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition"
                    >
                      ✅ Looks Good! Finish
                    </button>
                    <button
                      onClick={() => {
                        setCurrentStep(1);
                        setGeneratedCode("");
                        setDeepScanResults([]);
                      }}
                      className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition"
                    >
                      🔄 Regenerate Script
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: DONE + SEARCH HELPER */}
            {currentStep === 4 && (
              <>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 border-4 border-white/50 text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold mb-2">Script Ready!</h2>
                  <p className="text-lg mb-6">Your code is validated and ready to use in Bloxd!</p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={copyCode}
                      className="bg-white text-green-600 px-8 py-3 rounded-xl font-bold hover:scale-105 transition"
                    >
                      📋 Copy Code
                    </button>
                    <button
                      onClick={() => {
                        setCurrentStep(1);
                        setGeneratedCode("");
                        setDeepScanResults([]);
                      }}
                      className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition"
                    >
                      🚀 Create Another
                    </button>
                  </div>
                </div>

                {/* Search Helper */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-4 text-center">🔍 Need Help? Search API Docs</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && searchAPIDocs()}
                      placeholder="Search: setBlock, player, entity, tick..."
                      className="flex-1 bg-black/30 border border-white/30 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                    <button
                      onClick={searchAPIDocs}
                      disabled={isSearching || !searchQuery.trim()}
                      className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white font-bold px-6 rounded-lg transition"
                    >
                      {isSearching ? "..." : "Search"}
                    </button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="mt-4 bg-black/30 rounded-xl p-4 max-h-64 overflow-y-auto">
                      {searchResults.map((result, i) => (
                        <div key={i} className="bg-white/5 rounded-lg p-3 mb-2 border border-purple-500/30">
                          <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">{result}</pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* SEARCH TAB - REMOVED, now in Step 4 */}
            
          {/* DEEP SCAN TAB - REMOVED, now automatic in Step 2/3 */}

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
