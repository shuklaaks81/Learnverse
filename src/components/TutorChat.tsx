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
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-blue-100 to-purple-100 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-purple-700">Ask Your Tutor! 🧑‍🏫</h2>
        <p className="text-sm text-gray-600 mt-1">
          Stuck on a problem? Ask me anything!
        </p>
      </div>

      {/* Messages Container */}
      <div className="bg-white rounded-lg p-4 h-80 overflow-y-auto mb-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Ask a question to get started! ✨</p>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.type === 'question' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.type === 'question'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  {msg.type === 'answer' && msg.cached && (
                    <p className="text-xs mt-1 opacity-70">💾 From cache</p>
                  )}
                  <p className="text-xs mt-1 opacity-50">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleAskQuestion()}
          placeholder="Ask a question..."
          disabled={loading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
        />
        <button
          onClick={handleAskQuestion}
          disabled={loading || !input.trim()}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
        >
          {loading ? '⏳' : '📤'}
        </button>
      </div>

      {/* Stats Footer */}
      <div className="mt-4 text-center text-xs text-gray-600">
        <p>Questions today: {messages.filter(m => m.type === 'question').length}/10</p>
      </div>
    </div>
  );
}
