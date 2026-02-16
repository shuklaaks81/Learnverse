'use client';

import { useState, useRef, useEffect } from 'react';
import { SoundEffects } from '@/utils/soundEffects';

interface Message {
  id: string;
  type: 'question' | 'answer';
  text: string;
  timestamp: Date;
  cached?: boolean;
}

export function TutorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sounds = useRef<SoundEffects | null>(null);

  // Initialize student ID from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const kidData = localStorage.getItem('currentKid');
      if (kidData) {
        const kid = JSON.parse(kidData);
        setStudentId(kid.kidId || 'unknown');
      }
      // Initialize sound effects
      sounds.current = new SoundEffects();
    }
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAskQuestion = async () => {
    if (!input.trim()) return;
    if (!studentId) {
      setError('Student ID not found. Please refresh the page.');
      return;
    }

    // Add user question to chat
    const questionId = Date.now().toString();
    const newQuestion: Message = {
      id: questionId,
      type: 'question',
      text: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newQuestion]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      // Call tutor API
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          studentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get answer');
      }

      const { answer, cached, latency } = await response.json();

      // Play sound effect
      sounds.current?.playCorrect();

      // Add tutor answer to chat
      const answerId = (Date.now() + 1).toString();
      const newAnswer: Message = {
        id: answerId,
        type: 'answer',
        text: answer,
        timestamp: new Date(),
        cached,
      };
      setMessages(prev => [...prev, newAnswer]);

      // Log the interaction (non-blocking)
      fetch('/api/tutor-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          question: input,
          answerPreview: answer.substring(0, 100),
          timestamp: new Date().toISOString(),
        }),
      }).catch(err => console.error('Failed to log tutor interaction:', err));

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Try again!'
      );
      sounds.current?.playWrong();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 rounded-3xl p-6 shadow-2xl border-2 border-purple-200 backdrop-blur-sm">
      {/* Header with Enhancement */}
      <div className="text-center mb-8 pb-6 border-b-2 border-purple-200">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-4xl animate-bounce">🧑‍🏫</span>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Ask Your Tutor!
          </h2>
        </div>
        <p className="text-sm text-gray-600 font-semibold mt-2">
          💡 Stuck on a problem? Ask anything and get instant help!
        </p>
      </div>

      {/* Messages Container - Enhanced */}
      <div className="bg-white/80 backdrop-blur rounded-2xl p-5 min-h-96 max-h-96 overflow-y-auto mb-5 space-y-4 shadow-inner border border-purple-100">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4 animate-pulse">✨</div>
            <p className="text-gray-500 font-semibold text-lg">No questions yet!</p>
            <p className="text-gray-400 text-sm mt-2">Start chatting to get instant answers...</p>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'question' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-md transition-all transform hover:scale-105 duration-200 ${
                    msg.type === 'question'
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-br-none shadow-purple-200'
                      : 'bg-gradient-to-br from-blue-100 to-purple-100 text-gray-800 rounded-bl-none border-2 border-blue-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className="flex items-center justify-between gap-2 mt-2 text-xs opacity-70">
                    <span>{msg.timestamp.toLocaleTimeString()}</span>
                    {msg.type === 'answer' && msg.cached && (
                      <span className="bg-white/30 px-2 py-1 rounded-full animate-pulse font-semibold">💾 Cached</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 px-5 py-3 rounded-2xl rounded-bl-none border-2 border-blue-200">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 font-semibold">Tutor is thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Message - Enhanced */}
      {error && (
        <div className="bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-300 text-red-700 px-5 py-3 rounded-xl mb-4 text-sm font-semibold shadow-md flex items-center gap-2 animate-shake">
          <span className="text-lg">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Input Area - Enhanced */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleAskQuestion()}
          placeholder="Type your question here..."
          disabled={loading}
          className="flex-1 px-5 py-3 border-2 border-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed font-medium transition-all shadow-md"
        />
        <button
          onClick={handleAskQuestion}
          disabled={loading || !input.trim()}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
        >
          {loading ? <span className="inline-block animate-spin">⏳</span> : '📤 Send'}
        </button>
      </div>

      {/* Stats Footer - Enhanced */}
      <div className="flex justify-between items-center text-xs font-semibold text-gray-600 pt-4 border-t border-purple-200">
        <div className="flex gap-4">
          <span>📊 Questions: <span className="text-purple-600 font-bold">{messages.filter(m => m.type === 'question').length}</span>/10</span>
          <span>💬 Answers: <span className="text-blue-600 font-bold">{messages.filter(m => m.type === 'answer').length}</span></span>
        </div>
      </div>
    </div>
  );
}
