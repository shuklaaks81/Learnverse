"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ParentSettings {
  notifications: {
    lessonComplete: boolean;
    achievementUnlocked: boolean;
    weeklyReport: boolean;
    dailyReminder: boolean;
  };
  privacy: {
    dataCollection: boolean;
    shareProgress: boolean;
    analytics: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    animations: boolean;
    sounds: boolean;
  };
  learning: {
    timeLimit: number; // minutes per day, 0 = unlimited
    autoSave: boolean;
    difficultyLevel: 'easy' | 'medium' | 'hard' | 'adaptive';
  };
  performance: {
    antiLag: boolean;
    showFPSCounter: boolean;
  };
  account: {
    parentEmail: string;
    parentName: string;
    familyName: string;
  };
}

export default function ParentSettingsPage() {
  const [settings, setSettings] = useState<ParentSettings>({
    notifications: {
      lessonComplete: true,
      achievementUnlocked: true,
      weeklyReport: true,
      dailyReminder: false,
    },
    privacy: {
      dataCollection: false,
      shareProgress: false,
      analytics: true,
    },
    display: {
      theme: 'auto',
      animations: true,
      sounds: true,
    },
    learning: {
      timeLimit: 0,
      autoSave: true,
      difficultyLevel: 'adaptive',
    },
    performance: {
      antiLag: true,
      showFPSCounter: false,
    },
    account: {
      parentEmail: '',
      parentName: '',
      familyName: 'My Family',
    },
  });

  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'display' | 'learning' | 'performance' | 'account'>('notifications');

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('parentSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('parentSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      localStorage.removeItem('parentSettings');
      window.location.reload();
    }
  };

  const updateSetting = (category: keyof ParentSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 border-4 border-white/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                ⚙️ Parent Settings
              </h1>
              <p className="text-gray-700 mt-2 font-semibold text-lg">Customize your family&apos;s learning experience</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/parent/dashboard"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-bold hover:scale-105"
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Saved Notification */}
        {saved && (
          <div className="mb-6 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-xl animate-bounce font-bold text-center">
            ✓ Settings saved successfully!
          </div>
        )}

        {/* Main Settings Card */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl overflow-hidden border-4 border-white/50">
          {/* Tabs */}
          <div className="flex overflow-x-auto bg-gradient-to-r from-indigo-100 to-purple-100 border-b-4 border-purple-200">
            {[
              { id: 'notifications', icon: '🔔', label: 'Notifications' },
              { id: 'privacy', icon: '🔒', label: 'Privacy' },
              { id: 'display', icon: '🎨', label: 'Display' },
              { id: 'learning', icon: '📚', label: 'Learning' },
              { id: 'performance', icon: '⚡', label: 'Performance' },
              { id: 'account', icon: '👤', label: 'Account' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[120px] px-6 py-4 font-bold text-sm sm:text-base transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 border-b-4 border-purple-600 shadow-lg'
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                <span className="text-2xl block mb-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🔔 Notification Preferences</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all cursor-pointer">
                    <div>
                      <div className="font-bold text-gray-800">Lesson Complete Notifications</div>
                      <div className="text-sm text-gray-600">Get notified when your child completes a lesson</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.lessonComplete}
                      onChange={(e) => updateSetting('notifications', 'lessonComplete', e.target.checked)}
                      className="w-6 h-6 text-purple-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 hover:shadow-lg transition-all cursor-pointer">
                    <div>
                      <div className="font-bold text-gray-800">Achievement Unlocked</div>
                      <div className="text-sm text-gray-600">Celebrate when your child earns achievements</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.achievementUnlocked}
                      onChange={(e) => updateSetting('notifications', 'achievementUnlocked', e.target.checked)}
                      className="w-6 h-6 text-purple-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all cursor-pointer">
                    <div>
                      <div className="font-bold text-gray-800">Weekly Progress Report</div>
                      <div className="text-sm text-gray-600">Receive a summary of your family&apos;s weekly progress</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.weeklyReport}
                      onChange={(e) => updateSetting('notifications', 'weeklyReport', e.target.checked)}
                      className="w-6 h-6 text-purple-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all cursor-pointer">
                    <div>
                      <div className="font-bold text-gray-800">Daily Learning Reminder</div>
                      <div className="text-sm text-gray-600">Remind kids to practice every day</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.dailyReminder}
                      onChange={(e) => updateSetting('notifications', 'dailyReminder', e.target.checked)}
                      className="w-6 h-6 text-purple-600 rounded"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🔒 Privacy & Data</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-2 border-red-200 hover:shadow-lg transition-all cursor-pointer">
                    <div>
                      <div className="font-bold text-gray-800">Data Collection</div>
                      <div className="text-sm text-gray-600">Allow anonymous usage data collection for improvements</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.dataCollection}
                      onChange={(e) => updateSetting('privacy', 'dataCollection', e.target.checked)}
                      className="w-6 h-6 text-purple-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all cursor-pointer">
                    <div>
                      <div className="font-bold text-gray-800">Share Progress</div>
                      <div className="text-sm text-gray-600">Allow sharing progress with other family members</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.shareProgress}
                      onChange={(e) => updateSetting('privacy', 'shareProgress', e.target.checked)}
                      className="w-6 h-6 text-purple-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all cursor-pointer">
                    <div>
                      <div className="font-bold text-gray-800">Analytics</div>
                      <div className="text-sm text-gray-600">Track learning analytics for detailed insights</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.analytics}
                      onChange={(e) => updateSetting('privacy', 'analytics', e.target.checked)}
                      className="w-6 h-6 text-purple-600 rounded"
                    />
                  </label>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mt-6">
                  <p className="text-sm text-gray-700">
                    <strong>🔐 Privacy Note:</strong> All data is stored locally on your device. No personal information is sent to external servers.
                  </p>
                </div>
              </div>
            )}

            {/* Display Tab */}
            {activeTab === 'display' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🎨 Display Settings</h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                    <label className="font-bold text-gray-800 block mb-3">Theme</label>
                    <select
                      value={settings.display.theme}
                      onChange={(e) => updateSetting('display', 'theme', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl font-semibold focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="light">☀️ Light Mode</option>
                      <option value="dark">🌙 Dark Mode</option>
                      <option value="auto">🔄 Auto (System)</option>
                    </select>
                  </div>

                  <label className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all cursor-pointer">
                    <div>
                      <div className="font-bold text-gray-800">Animations</div>
                      <div className="text-sm text-gray-600">Enable fun animations throughout the app</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.display.animations}
                      onChange={(e) => updateSetting('display', 'animations', e.target.checked)}
                      className="w-6 h-6 text-purple-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 hover:shadow-lg transition-all cursor-pointer">
                    <div>
                      <div className="font-bold text-gray-800">Sound Effects</div>
                      <div className="text-sm text-gray-600">Play sounds for interactions and achievements</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.display.sounds}
                      onChange={(e) => updateSetting('display', 'sounds', e.target.checked)}
                      className="w-6 h-6 text-purple-600 rounded"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Learning Tab */}
            {activeTab === 'learning' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 Learning Controls</h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <label className="font-bold text-gray-800 block mb-3">
                      Daily Time Limit: {settings.learning.timeLimit === 0 ? 'Unlimited' : `${settings.learning.timeLimit} minutes`}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="180"
                      step="15"
                      value={settings.learning.timeLimit}
                      onChange={(e) => updateSetting('learning', 'timeLimit', parseInt(e.target.value))}
                      className="w-full h-3 bg-green-300 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>No Limit</span>
                      <span>15m</span>
                      <span>30m</span>
                      <span>1h</span>
                      <span>2h</span>
                      <span>3h</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                    <label className="font-bold text-gray-800 block mb-3">Difficulty Level</label>
                    <select
                      value={settings.learning.difficultyLevel}
                      onChange={(e) => updateSetting('learning', 'difficultyLevel', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl font-semibold focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="easy">🌱 Easy - Gentle introduction</option>
                      <option value="medium">⭐ Medium - Balanced challenge</option>
                      <option value="hard">🔥 Hard - Advanced learning</option>
                      <option value="adaptive">🎯 Adaptive - Adjusts automatically</option>
                    </select>
                  </div>

                  <label className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all cursor-pointer">
                    <div>
                      <div className="font-bold text-gray-800">Auto-Save Progress</div>
                      <div className="text-sm text-gray-600">Automatically save lesson progress</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.learning.autoSave}
                      onChange={(e) => updateSetting('learning', 'autoSave', e.target.checked)}
                      className="w-6 h-6 text-purple-600 rounded"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">⚡ Performance & Anti-Lag</h2>
                
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border-2 border-cyan-200 mb-6">
                  <h3 className="text-xl font-bold text-cyan-800 mb-2">🚀 Smart Performance System</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Our advanced anti-lag system constantly monitors your device&apos;s performance (FPS). 
                    If lag is detected, it automatically adjusts visual effects to keep the app running smoothly. 
                    When performance improves, features are gradually restored.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all cursor-pointer">
                    <div>
                      <div className="font-bold text-gray-800">Enable Anti-Lag System</div>
                      <div className="text-sm text-gray-600">
                        Automatically optimizes performance when FPS drops below 55
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        • NORMAL: Full features<br/>
                        • SIMPLIFIED: Reduced animations (FPS &lt; 55 for 3s)<br/>
                        • OVERDRIVE: Critical features only (FPS &lt; 55 for 8s)
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.performance.antiLag}
                      onChange={(e) => {
                        updateSetting('performance', 'antiLag', e.target.checked);
                        // Apply immediately
                        if (typeof window !== 'undefined') {
                          const { performanceMonitor } = require('@/utils/performanceMonitor');
                          performanceMonitor.setEnabled(e.target.checked);
                        }
                      }}
                      className="w-6 h-6 text-green-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all cursor-pointer">
                    <div>
                      <div className="font-bold text-gray-800">Show FPS Counter (Dev Mode)</div>
                      <div className="text-sm text-gray-600">
                        Display real-time FPS counter in development mode
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.performance.showFPSCounter}
                      onChange={(e) => updateSetting('performance', 'showFPSCounter', e.target.checked)}
                      className="w-6 h-6 text-blue-600 rounded"
                    />
                  </label>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                  <h4 className="font-bold text-yellow-900 mb-2">📊 How It Works:</h4>
                  <ol className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">1.</span>
                      <span>System monitors FPS (frames per second) continuously</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">2.</span>
                      <span>If FPS drops below 55 for 3 seconds, switches to SIMPLIFIED mode (reduced animations)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">3.</span>
                      <span>If still laggy after 5 more seconds, enters OVERDRIVE mode (minimal features)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">4.</span>
                      <span>When FPS improves to 58+ for 3 seconds, gradually restores features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">5.</span>
                      <span>You&apos;ll see notifications when performance mode changes</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4">
                  <h4 className="font-bold text-purple-900 mb-2">💡 Performance Tips:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Close other browser tabs while using Learnverse</li>
                    <li>• Restart your browser if performance degrades</li>
                    <li>• Use a modern browser (Chrome, Firefox, Safari, Edge)</li>
                    <li>• The anti-lag system works automatically - no manual intervention needed!</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">👤 Account Information</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                    <label className="font-bold text-gray-800 block mb-2">Parent Name</label>
                    <input
                      type="text"
                      value={settings.account.parentName}
                      onChange={(e) => updateSetting('account', 'parentName', e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl font-semibold focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                    <label className="font-bold text-gray-800 block mb-2">Parent Email</label>
                    <input
                      type="email"
                      value={settings.account.parentEmail}
                      onChange={(e) => updateSetting('account', 'parentEmail', e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl font-semibold focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <label className="font-bold text-gray-800 block mb-2">Family Name</label>
                    <input
                      type="text"
                      value={settings.account.familyName}
                      onChange={(e) => updateSetting('account', 'familyName', e.target.value)}
                      placeholder="The Smith Family"
                      className="w-full px-4 py-3 border-2 border-green-300 rounded-xl font-semibold focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 mt-6">
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>⚠️ Danger Zone</strong>
                  </p>
                  <button
                    onClick={handleReset}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-105"
                  >
                    🗑️ Reset All Settings to Default
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 border-t-4 border-purple-200 flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 shadow-xl text-lg"
            >
              💾 Save All Settings
            </button>
            <Link
              href="/parent/dashboard"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 text-lg flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border-2 border-blue-200 shadow-xl">
            <h3 className="text-xl font-bold text-blue-700 mb-3">💡 Quick Tip</h3>
            <p className="text-gray-700">
              Enable notifications to stay updated on your child&apos;s learning progress. You&apos;ll celebrate achievements together!
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border-2 border-purple-200 shadow-xl">
            <h3 className="text-xl font-bold text-purple-700 mb-3">📊 Learning Insights</h3>
            <p className="text-gray-700">
              Set time limits and difficulty levels to create the perfect learning environment for your family.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
