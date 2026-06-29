'use client';

import { useEffect, useState } from 'react';
import { runMigrations, checkStorageUsage, cleanupOldData, CURRENT_DATA_VERSION } from '@/utils/dataMigration';

interface MigrationWrapperProps {
  children: React.ReactNode;
}

export default function MigrationWrapper({ children }: MigrationWrapperProps) {
  const [isMigrating, setIsMigrating] = useState(true);
  const [migrationError, setMigrationError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        console.log('🚀 Starting Learnverse...');
        
        // Run migrations
        const result = runMigrations();
        
        if (!result.success) {
          console.error('Migration failed:', result.errors);
          setMigrationError('Failed to update app data. You may experience issues.');
        } else if (result.migrationsRun.length > 0) {
          console.log('✅ Migrations completed:', result.migrationsRun);
        }
        
        // Check storage usage
        const usage = checkStorageUsage();
        console.log(`💾 Storage usage: ${usage.toFixed(1)}%`);
        
        if (usage > 80) {
          console.warn('⚠️ Storage is getting full!');
          const cleanup = cleanupOldData();
          if (cleanup.cleaned) {
            console.log(`🧹 Cleaned up ${cleanup.itemsRemoved} items`);
          }
        }
        
        // Log version info
        console.log(`📦 Data version: ${CURRENT_DATA_VERSION}`);
        
      } catch (error) {
        console.error('Startup error:', error);
        setMigrationError('App initialization failed');
      } finally {
        setIsMigrating(false);
      }
    }
  }, []);

  // Show migration screen
  if (isMigrating) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center z-50">
        <div className="bg-white/95 rounded-3xl p-12 text-center shadow-2xl max-w-md">
          <div className="text-7xl mb-6 animate-bounce">🚀</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Preparing Learnverse...</h2>
          <p className="text-gray-600 mb-6">Checking for updates and optimizing your data!</p>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if migration failed
  if (migrationError) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center z-50">
        <div className="bg-white/95 rounded-3xl p-12 text-center shadow-2xl max-w-md">
          <div className="text-7xl mb-6">⚠️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Update Issue</h2>
          <p className="text-gray-600 mb-6">{migrationError}</p>
          <button
            onClick={() => {
              setMigrationError(null);
              window.location.reload();
            }}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
          >
            Try Again
          </button>
          <p className="text-xs text-gray-500 mt-4">
            If this persists, you may need to clear your browser data.
          </p>
        </div>
      </div>
    );
  }

  // All good, show the app!
  return <>{children}</>;
}
