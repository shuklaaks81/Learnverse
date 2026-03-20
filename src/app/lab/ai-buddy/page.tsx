"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AIBuddy {
  id: string;
  name: string;
  subjects: string[];
  personality: string[];
  emoji: string;
  createdAt: number;
}

export default function AIBuddyBuilder() {
  const router = useRouter();
  const [buddyName, setBuddyName] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState('🤓');
  const [isCreating, setIsCreating] = useState(false);

  const subjects = [
    { id: 'reading', label: 'Reading', emoji: '📚' },
    { id: 'math', label: 'Math', emoji: '🧮' },
    { id: 'science', label: 'Science', emoji: '🔬' },
    { id: 'writing', label: 'Writing', emoji: '✍️' },
    { id: 'history', label: 'History', emoji: '🏛️' },
    { id: 'art', label: 'Art', emoji: '🎨' },
    { id: 'music', label: 'Music', emoji: '🎵' },
    { id: 'everything', label: 'ALL THE STUFF!', emoji: '🌟' },
  ];

  const personalities = [
    { id: 'funny', label: 'Funny & Silly', emoji: '😄' },
    { id: 'smart', label: 'Super Smart', emoji: '🧠' },
    { id: 'encouraging', label: 'Encouraging', emoji: '💪' },
    { id: 'patient', label: 'Patient & Kind', emoji: '🤗' },
    { id: 'exciting', label: 'Exciting & Energetic', emoji: '⚡' },
    { id: 'creative', label: 'Creative & Imaginative', emoji: '✨' },
  ];

  const emojis = ['🤓', '📚', '🎓', '🦉', '🧙', '🤖', '👨‍🏫', '👩‍🏫', '🦊', '🐻', '🦁', '🐼'];

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(s => s !== subjectId)
        : [...prev, subjectId]
    );
  };

  const togglePersonality = (personalityId: string) => {
    setSelectedPersonality(prev =>
      prev.includes(personalityId)
        ? prev.filter(p => p !== personalityId)
        : [...prev, personalityId]
    );
  };

  const createBuddy = () => {
    if (!buddyName.trim()) {
      alert('Your buddy needs a name! Even if it\'s super long! 😄');
      return;
    }

    if (selectedSubjects.length === 0) {
      alert('Pick what your buddy helps with!');
      return;
    }

    if (selectedPersonality.length === 0) {
      alert('Pick your buddy\'s personality!');
      return;
    }

    setIsCreating(true);

    // Create the AI buddy
    const buddy: AIBuddy = {
      id: Date.now().toString(),
      name: buddyName,
      subjects: selectedSubjects,
      personality: selectedPersonality,
      emoji: selectedEmoji,
      createdAt: Date.now(),
    };

    // Save to localStorage
    const existingBuddies = JSON.parse(localStorage.getItem('aiBuddies') || '[]');
    existingBuddies.push(buddy);
    localStorage.setItem('aiBuddies', JSON.stringify(existingBuddies));

    // Navigate to chat page
    setTimeout(() => {
      router.push(`/lab/ai-buddy/chat/${buddy.id}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link
          href="/lab/smart-ai"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-gray-800 font-medium"
        >
          ← Back to Lab
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🎨 Create Your AI Buddy! 🤖
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Make your own helpful AI friend with any name you want!
        </p>

        {/* Step 1: Name */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            1️⃣ Name Your Buddy
          </h2>
          <p className="text-gray-600 mb-4">
            Type ANY name - short, long, funny, serious - whatever you want! 🎉
          </p>
          <textarea
            value={buddyName}
            onChange={(e) => setBuddyName(e.target.value)}
            placeholder="Like: Mr. Professor of the stuff in reading and subjects! also idk why i have a long name i mean it is nice you know mpants!"
            className="w-full p-4 border-2 border-purple-300 rounded-lg text-gray-800 text-lg focus:outline-none focus:border-purple-500 min-h-[100px]"
            maxLength={500}
          />
          <p className="text-sm text-gray-500 mt-2">
            {buddyName.length}/500 characters
          </p>
        </div>

        {/* Step 2: Subjects */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            2️⃣ What Will They Help With?
          </h2>
          <p className="text-gray-600 mb-4">Pick as many as you want!</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {subjects.map(subject => (
              <button
                key={subject.id}
                onClick={() => toggleSubject(subject.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedSubjects.includes(subject.id)
                    ? 'bg-blue-500 text-white border-blue-600 shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                <div className="text-3xl mb-1">{subject.emoji}</div>
                <div className="font-semibold text-sm">{subject.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Personality */}
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            3️⃣ Pick Their Personality
          </h2>
          <p className="text-gray-600 mb-4">How should they act?</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {personalities.map(personality => (
              <button
                key={personality.id}
                onClick={() => togglePersonality(personality.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPersonality.includes(personality.id)
                    ? 'bg-green-500 text-white border-green-600 shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                }`}
              >
                <div className="text-3xl mb-1">{personality.emoji}</div>
                <div className="font-semibold text-sm">{personality.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Emoji Avatar */}
        <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            4️⃣ Choose Their Avatar
          </h2>
          <p className="text-gray-600 mb-4">Pick an emoji face for your buddy!</p>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-3">
            {emojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => setSelectedEmoji(emoji)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedEmoji === emoji
                    ? 'bg-yellow-400 border-yellow-600 shadow-lg scale-110'
                    : 'bg-white border-gray-300 hover:border-yellow-400'
                }`}
              >
                <div className="text-3xl">{emoji}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {buddyName && (
          <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-300">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Preview:</h2>
            <div className="flex items-start gap-4">
              <div className="text-6xl">{selectedEmoji}</div>
              <div>
                <p className="text-2xl font-bold text-gray-800 break-words">{buddyName}</p>
                <p className="text-gray-600 mt-2">
                  {selectedSubjects.length > 0 && (
                    <>Helps with: {selectedSubjects.map(s => subjects.find(sub => sub.id === s)?.label).join(', ')}</>
                  )}
                </p>
                <p className="text-gray-600">
                  {selectedPersonality.length > 0 && (
                    <>Personality: {selectedPersonality.map(p => personalities.find(per => per.id === p)?.label).join(', ')}</>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Create Button */}
        <button
          onClick={createBuddy}
          disabled={isCreating}
          className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? '✨ Creating Your Buddy...' : '🚀 Create My AI Buddy!'}
        </button>
      </div>
    </div>
  );
}
