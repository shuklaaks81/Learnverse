'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Scene {
  id: string;
  type: 'image' | 'text' | 'voice';
  content: string;
  duration: number;
  voiceBlob?: Blob;
}

export default function VideoStudioPage() {
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [recording, setRecording] = useState(false);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [musicFile, setMusicFile] = useState<File | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Generate cartoon with AI
  const generateCartoon = async () => {
    if (!currentPrompt.trim()) return;
    
    setGenerating(true);
    try {
      // For now, create a placeholder - we'll add AI image generation later
      const newScene: Scene = {
        id: Date.now().toString(),
        type: 'text',
        content: currentPrompt,
        duration: 3,
      };
      
      setScenes([...scenes, newScene]);
      setCurrentPrompt('');
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate scene. Try again!');
    } finally {
      setGenerating(false);
    }
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        if (selectedScene) {
          // Add voice to selected scene
          setScenes(scenes.map(scene => 
            scene.id === selectedScene 
              ? { ...scene, voiceBlob: audioBlob }
              : scene
          ));
        } else {
          // Create new voice scene
          const newScene: Scene = {
            id: Date.now().toString(),
            type: 'voice',
            content: 'Voice Recording',
            duration: 3,
            voiceBlob: audioBlob,
          };
          setScenes([...scenes, newScene]);
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      alert('Could not access microphone!');
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Handle music upload
  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMusicFile(file);
    }
  };

  // Delete scene
  const deleteScene = (id: string) => {
    setScenes(scenes.filter(scene => scene.id !== id));
    if (selectedScene === id) setSelectedScene(null);
  };

  // Update scene duration
  const updateDuration = (id: string, duration: number) => {
    setScenes(scenes.map(scene => 
      scene.id === id ? { ...scene, duration } : scene
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-white">
            🎬 Video Studio
          </h1>
          <div className="w-20" />
        </div>

        <p className="text-white/90 text-center text-lg">
          Create awesome cartoons with AI + your creativity! 🎨✨
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel - AI Generator & Tools */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* AI Cartoon Generator */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">🎨 AI Cartoon Generator</h2>
            
            <textarea
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              placeholder="Describe what you want to see... (e.g., 'a cat playing piano')"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border-2 border-white/30 focus:border-white/60 outline-none resize-none"
              rows={3}
            />
            
            <button
              onClick={generateCartoon}
              disabled={generating || !currentPrompt.trim()}
              className="w-full mt-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? '✨ Generating...' : '🚀 Generate Scene'}
            </button>
          </div>

          {/* Voice Recorder */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">🎙️ Voice Recorder</h2>
            
            {selectedScene && (
              <p className="text-white/80 mb-3 text-sm">
                Recording for: Scene {scenes.findIndex(s => s.id === selectedScene) + 1}
              </p>
            )}
            
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`w-full px-6 py-3 rounded-xl font-bold transition-all ${
                recording 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              {recording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
            </button>
          </div>

          {/* Music Upload */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">🎵 Background Music</h2>
            
            <input
              type="file"
              accept="audio/*"
              onChange={handleMusicUpload}
              className="hidden"
              id="music-upload"
            />
            <label
              htmlFor="music-upload"
              className="block w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-bold text-center cursor-pointer hover:scale-105 transition-transform"
            >
              📁 Upload Music
            </label>
            
            {musicFile && (
              <p className="text-white/90 mt-3 text-sm truncate">
                ✅ {musicFile.name}
              </p>
            )}
          </div>

        </div>

        {/* Right Panel - Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">⏱️ Timeline ({scenes.length} scenes)</h2>
            
            {scenes.length === 0 ? (
              <div className="text-center py-20 text-white/60">
                <p className="text-xl">👈 Start by generating a scene!</p>
                <p className="mt-2">Add cartoons, voice, and music to build your video</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {scenes.map((scene, index) => (
                  <div
                    key={scene.id}
                    onClick={() => setSelectedScene(scene.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedScene === scene.id
                        ? 'bg-white/30 border-2 border-white'
                        : 'bg-white/10 border-2 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {scene.type === 'image' && '🎨'}
                          {scene.type === 'text' && '📝'}
                          {scene.type === 'voice' && '🎤'}
                        </span>
                        <div>
                          <p className="text-white font-bold">Scene {index + 1}</p>
                          <p className="text-white/70 text-sm truncate max-w-xs">
                            {scene.content}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteScene(scene.id);
                        }}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <label className="text-white/80 text-sm">Duration:</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={scene.duration}
                        onChange={(e) => updateDuration(scene.id, parseInt(e.target.value))}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1"
                      />
                      <span className="text-white font-bold">{scene.duration}s</span>
                    </div>
                    
                    {scene.voiceBlob && (
                      <p className="text-green-400 text-sm mt-2">✅ Voice added</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {scenes.length > 0 && (
              <div className="mt-6 pt-6 border-t-2 border-white/20">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const totalDuration = scenes.reduce((acc, scene) => acc + scene.duration, 0);
                      alert(`Your video will be ${totalDuration} seconds long! 🎬\n\nExport feature coming soon!`);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                  >
                    📹 Preview Video
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Clear all scenes?')) {
                        setScenes([]);
                        setSelectedScene(null);
                      }
                    }}
                    className="px-6 py-3 bg-red-500/80 hover:bg-red-500 text-white rounded-xl font-bold transition-all"
                  >
                    🗑️ Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Coming Soon Features */}
      <div className="max-w-7xl mx-auto mt-6 p-6 bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/20">
        <h3 className="text-xl font-bold text-white mb-3">🚧 Coming Soon:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-white/80">
          <div>✨ AI Image Generation</div>
          <div>🎥 Video Export</div>
          <div>📝 Text Overlays</div>
          <div>🎬 Transitions</div>
          <div>🎨 Filters & Effects</div>
          <div>💾 Save Projects</div>
          <div>🔗 Share Links</div>
          <div>🎭 Character Library</div>
        </div>
      </div>
    </div>
  );
}
