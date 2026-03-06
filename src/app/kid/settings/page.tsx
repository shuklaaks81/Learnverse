'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkStorageUsage, cleanupOldData, createBackup, restoreBackup, CURRENT_DATA_VERSION } from '@/utils/dataMigration';

export default function SettingsPage() {
  const router = useRouter();
  const [storageUsage, setStorageUsage] = useState(0);
  const [showBackupSuccess, setShowBackupSuccess] = useState(false);
  const [showRestoreArea, setShowRestoreArea] = useState(false);
  const [restoreData, setRestoreData] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      updateStorageUsage();
    }
  }, []);

  const updateStorageUsage = () => {
    const usage = checkStorageUsage();
    setStorageUsage(usage);
  };

  const handleCleanup = () => {
    const result = cleanupOldData();
    if (result.cleaned) {
      setMessage(`✅ Cleaned up ${result.itemsRemoved} items!`);
      updateStorageUsage();
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('✨ No cleanup needed! Storage is good.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDownloadBackup = () => {
    const backup = createBackup();
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `learnverse-backup-${Date.now()}.json`;
    link.click();
    
    setShowBackupSuccess(true);
    setTimeout(() => setShowBackupSuccess(false), 3000);
  };

  const handleRestore = () => {
    if (!restoreData.trim()) {
      setMessage('❌ Please paste backup data first!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const result = restoreBackup(restoreData);
    if (result.success) {
      setMessage('✅ Restore successful! Reloading...');
      setTimeout(() => window.location.reload(), 2000);
    } else {
      setMessage(`❌ Restore failed: ${result.error}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const getStorageColor = () => {
    if (storageUsage < 50) return 'from-green-500 to-green-600';
    if (storageUsage < 80) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              ⚙️ Settings
            </h1>
            <button
              onClick={() => router.push('/kid')}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-bold hover:scale-105 transform transition"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-bounce">
            <p className="text-xl font-bold text-center text-gray-800">{message}</p>
          </div>
        )}

        {/* App Info */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📱 App Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 font-semibold">Data Version:</span>
              <span className="font-bold text-purple-600">{CURRENT_DATA_VERSION}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-semibold">Storage Used:</span>
              <span className={`font-bold bg-gradient-to-r ${getStorageColor()} bg-clip-text text-transparent`}>
                {storageUsage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Storage Bar */}
          <div className="mt-4">
            <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden relative">
              <div
                className={`h-full bg-gradient-to-r ${getStorageColor()} transition-all duration-500`}
                style={{ width: `${Math.min(storageUsage, 100)}%` }}
              />
              {storageUsage > 80 && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                  ⚠️ ALMOST FULL!
                </div>
              )}
            </div>
          </div>

          {storageUsage > 50 && (
            <button
              onClick={handleCleanup}
              className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:scale-105 transform transition shadow-lg"
            >
              🧹 Clean Up Old Data
            </button>
          )}
        </div>

        {/* Backup Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💾 Backup & Restore</h2>
          <p className="text-gray-600 mb-4">
            Keep your lessons, progress, and achievements safe! Download a backup file and restore it anytime.
          </p>
          
          <button
            onClick={handleDownloadBackup}
            className="w-full mb-4 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:scale-105 transform transition shadow-lg"
          >
            📥 Download Backup
          </button>

          {showBackupSuccess && (
            <div className="bg-green-100 border-2 border-green-500 rounded-xl p-4 mb-4 animate-bounce">
              <p className="text-green-800 font-bold text-center">
                ✅ Backup downloaded! Keep this file safe!
              </p>
            </div>
          )}

          <button
            onClick={() => setShowRestoreArea(!showRestoreArea)}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transform transition shadow-lg"
          >
            📤 {showRestoreArea ? 'Hide' : 'Show'} Restore
          </button>

          {showRestoreArea && (
            <div className="mt-4 space-y-3">
              <textarea
                value={restoreData}
                onChange={(e) => setRestoreData(e.target.value)}
                placeholder="Paste your backup JSON here..."
                className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none font-mono text-sm"
              />
              <button
                onClick={handleRestore}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:scale-105 transform transition shadow-lg"
              >
                ⚠️ Restore from Backup
              </button>
              <p className="text-xs text-gray-500 text-center">
                Warning: This will replace all current data!
              </p>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-4 border-red-500 rounded-2xl shadow-2xl p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Danger Zone</h2>
          <p className="text-gray-700 mb-4">
            These actions cannot be undone! Make a backup first!
          </p>
          
          <button
            onClick={() => {
              if (confirm('Are you SURE? This will delete ALL your data!')) {
                if (confirm('Last chance! Really delete everything?')) {
                  localStorage.clear();
                  alert('All data deleted! Reloading...');
                  window.location.href = '/';
                }
              }
            }}
            className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:scale-105 transform transition shadow-lg"
          >
            🗑️ Delete All Data
          </button>
        </div>
      </div>
    </div>
  );
}
