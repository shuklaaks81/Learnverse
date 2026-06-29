"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function SmartAIHub() {
  const [showStats, setShowStats] = useState(true);

  const features = [
    {
      icon: '🤖✨',
      title: 'AI Buddy Builder',
      description: 'Create your own AI learning buddy with ANY name you want!',
      route: '/lab/ai-buddy',
      color: 'from-purple-500 to-indigo-500',
      capabilities: [
        'Name your buddy ANYTHING (even super long names!)',
        'Pick what they help with (math, reading, science, ALL THE STUFF!)',
        'Choose their personality (funny, smart, encouraging)',
        'Pick their emoji avatar',
        'Chat with your custom AI buddy!'
      ]
    },
    {
      icon: '🎨',
      title: 'Visual Page Builder',
      description: 'Drag-and-drop builder to create your own custom pages!',
      route: '/lab/builder',
      color: 'from-pink-500 to-rose-500',
      capabilities: [
        'Drag & Drop Interface',
        'Add Text, Buttons, Shapes',
        'Color Customization',
        'Live Preview',
        'AI-Powered Code Generation'
      ]
    },
    {
      icon: '🤖',
      title: 'Smart Page Generator',
      description: 'AI that detects patterns and creates components automatically!',
      route: '/lab/ai-generator',
      color: 'from-blue-500 to-purple-500',
      capabilities: [
        'Pattern Recognition (Quiz, Story, Game, Form)',
        'Smart Layout Detection',
        'Auto-generates React Components',
        'Kid-friendly Styling',
        'Interactive Elements'
      ]
    },
    // TUTOR TEMPORARILY DISABLED - Still in development
    /*
    {
      icon: '🤖',
      title: 'Tutor Chat',
      description: 'AI tutor that helps with math, science, and reading!',
      route: '/lab/tutor',
      color: 'from-green-500 to-teal-500',
      capabilities: [
        'Educational Knowledge Base',
        'Subject Detection',
        'Encouraging Responses',
        'Examples & Tips',
        'Context-Aware Answers'
      ]
    }
    */
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 mb-8 text-center">
          <div className="text-8xl mb-6 animate-bounce">🧠</div>
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Custom Page Creation Lab
          </h1>
          <p className="text-2xl text-gray-700 mb-6 leading-relaxed">
            Build your own pages with drag-and-drop + AI power!<br />
            <span className="text-lg text-green-600 font-bold">🟢 100% Local • No APIs • No Internet Needed!</span>
          </p>

          {/* How It Works */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🚀 How The Magic Works</h3>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="bg-white rounded-xl p-4">
                <div className="text-4xl mb-2">1️⃣</div>
                <h4 className="font-bold text-blue-600 mb-2">Pattern Recognition</h4>
                <p className="text-sm text-gray-600">Analyzes input data to detect patterns and intent</p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="text-4xl mb-2">2️⃣</div>
                <h4 className="font-bold text-purple-600 mb-2">Knowledge Base</h4>
                <p className="text-sm text-gray-600">Accesses built-in educational content and rules</p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="text-4xl mb-2">3️⃣</div>
                <h4 className="font-bold text-pink-600 mb-2">Smart Generation</h4>
                <p className="text-sm text-gray-600">Creates intelligent responses or code instantly</p>
              </div>
            </div>
          </div>

          {/* Stats Toggle */}
          <button
            onClick={() => setShowStats(!showStats)}
            className="text-sm text-gray-600 hover:text-gray-800 font-bold underline"
          >
            {showStats ? '▼ Hide Technical Details' : '▶ Show Technical Details'}
          </button>

          {showStats && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-3xl font-black text-blue-600">0ms</div>
                <div className="text-sm text-blue-800 font-bold">API Latency</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-3xl font-black text-green-600">100%</div>
                <div className="text-sm text-green-800 font-bold">Local Processing</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="text-3xl font-black text-purple-600">∞</div>
                <div className="text-sm text-purple-800 font-bold">Free Requests</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="text-3xl font-black text-orange-600">&lt;1s</div>
                <div className="text-sm text-orange-800 font-bold">Response Time</div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 hover:scale-105 transform transition-all duration-300">
              <div className="text-center mb-6">
                <div className="text-7xl mb-4">{feature.icon}</div>
                <h2 className="text-3xl font-black text-gray-800 mb-3">
                  {feature.title}
                </h2>
                <p className="text-lg text-gray-600">
                  {feature.description}
                </p>
              </div>

              {/* Capabilities */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">✨ Capabilities:</h3>
                <ul className="space-y-2">
                  {feature.capabilities.map((cap, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Link href={feature.route}>
                <button className={`w-full px-8 py-4 bg-gradient-to-r ${feature.color} text-white font-bold text-xl rounded-xl hover:shadow-2xl transform transition-all duration-200`}>
                  Try It Now! 🚀
                </button>
              </Link>
            </div>
          ))}
          
          {/* Coming Soon - Tutor Chat */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-2xl p-8 border-4 border-dashed border-gray-400 opacity-75">
            <div className="text-center mb-6">
              <div className="text-7xl mb-4">🤖</div>
              <h2 className="text-3xl font-black text-gray-600 mb-3">
                Tutor Chat
              </h2>
              <p className="text-lg text-gray-500">
                AI tutor that helps with math, science, and reading!
              </p>
            </div>
            
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🚧</span>
                <h3 className="font-bold text-yellow-800">Coming Soon!</h3>
              </div>
              <p className="text-sm text-yellow-700">
                We&apos;re making the tutor even SMARTER! Adding support for bigger numbers, more subjects, and advanced learning strategies. Check back soon!
              </p>
            </div>
            
            <button disabled className="w-full px-8 py-4 bg-gray-400 text-white font-bold text-xl rounded-xl cursor-not-allowed">
              In Development... 🛠️
            </button>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-black text-gray-800 mb-6 text-center">
            🏗️ Architecture Overview
          </h2>
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
            <div className="flex flex-col items-center gap-6">
              {/* Layer 1: Input */}
              <div className="w-full max-w-2xl">
                <div className="bg-blue-100 border-2 border-blue-500 rounded-xl p-4 text-center">
                  <div className="font-bold text-blue-800 mb-2">INPUT LAYER</div>
                  <div className="text-sm text-blue-700">User Question or Design Data</div>
                </div>
              </div>

              <div className="text-3xl">↓</div>

              {/* Layer 2: Smart AI Engine */}
              <div className="w-full max-w-3xl">
                <div className="bg-purple-100 border-4 border-purple-500 rounded-2xl p-6">
                  <div className="font-black text-purple-900 text-xl mb-4 text-center">
                    🧠 SMART AI ENGINE (Core Brain)
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl mb-1">🎯</div>
                      <div className="text-xs font-bold text-gray-700">Pattern Detection</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl mb-1">📚</div>
                      <div className="text-xs font-bold text-gray-700">Knowledge Base</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl mb-1">⚡</div>
                      <div className="text-xs font-bold text-gray-700">Smart Logic</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-3xl">↓</div>

              {/* Layer 3: Outputs */}
              <div className="w-full max-w-3xl grid grid-cols-2 gap-4">
                <div className="bg-green-100 border-2 border-green-500 rounded-xl p-4 text-center">
                  <div className="font-bold text-green-800 mb-2">OUTPUT: Page Generator</div>
                  <div className="text-sm text-green-700">React Component Code</div>
                </div>
                <div className="bg-teal-100 border-2 border-teal-500 rounded-xl p-4 text-center">
                  <div className="font-bold text-teal-800 mb-2">OUTPUT: Tutor Chat</div>
                  <div className="text-sm text-teal-700">Educational Response</div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Reference */}
          <div className="mt-8 bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-sm">
            <div className="mb-2 text-gray-400">// Core Engine Location:</div>
            <div>src/agents/smartAI.engine.ts</div>
            <div className="mt-4 mb-2 text-gray-400">// Usage Example:</div>
            <div>const response = await smartAI.process(&#123;</div>
            <div>  type: 'page-generation' | 'tutor-chat',</div>
            <div>  input: &#123; /* your data */ &#125;,</div>
            <div>  context: &#123; /* optional context */ &#125;</div>
            <div>&#125;);</div>
          </div>
        </div>

        {/* Back to Lab */}
        <div className="mt-8 text-center">
          <Link href="/lab">
            <button className="px-8 py-4 bg-white/95 backdrop-blur-sm text-gray-800 font-bold rounded-xl hover:scale-105 transform transition-all duration-200 shadow-lg">
              ← Back to Lab
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
