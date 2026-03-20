"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AIBuddyBrain } from '@/lib/ai-buddy/aiBuddyBrain';

interface AIBuddy {
  id: string;
  name: string;
  subjects: string[];
  personality: string[];
  emoji: string;
  createdAt: number;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

export default function AIBuddyChat() {
  const params = useParams();
  const buddyId = params?.id as string;
  
  const [buddy, setBuddy] = useState<AIBuddy | null>(null);
  const [brain, setBrain] = useState<AIBuddyBrain | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load buddy data
    const buddies = JSON.parse(localStorage.getItem('aiBuddies') || '[]');
    const foundBuddy = buddies.find((b: AIBuddy) => b.id === buddyId);
    
    if (foundBuddy) {
      setBuddy(foundBuddy);
      
      // Initialize AI Brain
      const aiBrain = new AIBuddyBrain({
        buddyId: foundBuddy.id,
        name: foundBuddy.name,
        subjects: foundBuddy.subjects,
        personality: foundBuddy.personality
      });
      setBrain(aiBrain);
      
      // Load chat history
      const chatHistory = JSON.parse(
        localStorage.getItem(`aibuddy_chat_${buddyId}`) || '[]'
      );
      
      if (chatHistory.length === 0) {
        // Send welcome message
        const welcomeMsg: Message = {
          id: Date.now().toString(),
          text: getWelcomeMessage(foundBuddy),
          isUser: false,
          timestamp: Date.now(),
        };
        setMessages([welcomeMsg]);
        localStorage.setItem(
          `aibuddy_chat_${buddyId}`,
          JSON.stringify([welcomeMsg])
        );
      } else {
        setMessages(chatHistory);
      }
    }
  }, [buddyId]);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getWelcomeMessage = (buddy: AIBuddy) => {
    const personalityText = buddy.personality.includes('funny')
      ? ' Get ready for some fun learning! 🎉'
      : buddy.personality.includes('encouraging')
      ? ' I believe in you! 💪'
      : buddy.personality.includes('exciting')
      ? ' This is gonna be AWESOME! ⚡'
      : ' I\'m here to help! 🌟';

    return `Hi! I'm ${buddy.name}!${personalityText} Ask me anything about ${
      buddy.subjects.includes('everything')
        ? 'ANYTHING - I know ALL THE STUFF!'
        : buddy.subjects.map(s => s).join(', ')
    }! What do you want to learn today?`;
  };

  const sendMessage = async () => {
    if (!input.trim() || !buddy || !brain) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsThinking(true);

    // Generate AI response using the Brain!
    setTimeout(async () => {
      const result = await brain.generateResponse(input);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: result.response,
        isUser: false,
        timestamp: Date.now() + 1,
      };

      const updatedMessages = [...newMessages, aiMsg];
      setMessages(updatedMessages);
      setIsThinking(false);

      // Save to localStorage
      localStorage.setItem(
        `aibuddy_chat_${buddyId}`,
        JSON.stringify(updatedMessages)
      );
    }, 800 + Math.random() * 800);
  };

  const clearChat = () => {
    if (confirm('Clear all messages? This cannot be undone!')) {
      const welcomeMsg: Message = {
        id: Date.now().toString(),
        text: buddy ? getWelcomeMessage(buddy) : 'Hi! How can I help?',
        isUser: false,
        timestamp: Date.now(),
      };
      setMessages([welcomeMsg]);
      localStorage.setItem(
        `aibuddy_chat_${buddyId}`,
        JSON.stringify([welcomeMsg])
      );
      
      // Clear brain memory too!
      if (brain) {
        brain.clearMemory();
      }
    }
  };

  if (!buddy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-600">Loading your buddy...</p>
          <Link href="/lab/ai-buddy" className="text-blue-600 underline mt-4 block">
            Go back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/lab/smart-ai"
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-gray-800 font-medium"
          >
            ← Back
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-4xl">{buddy.emoji}</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 break-words max-w-md">
                {buddy.name}
              </h1>
              <p className="text-sm text-gray-600">Your AI Learning Buddy</p>
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 shadow-md'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{message.text}</p>
            </div>
          </div>
        ))}
        
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 shadow-md p-4 rounded-2xl">
              <p className="flex items-center gap-2">
                <span className="animate-pulse">{buddy.emoji}</span>
                <span className="text-gray-600">Thinking...</span>
              </p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white shadow-lg p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask your buddy anything..."
            className="flex-1 p-4 border-2 border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isThinking}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

