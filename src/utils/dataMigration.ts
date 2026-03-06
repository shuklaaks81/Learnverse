/**
 * Data Migration System
 * 
 * Handles safe updates when app structure changes.
 * Prevents crashes from old localStorage data formats.
 */

export const CURRENT_DATA_VERSION = '2.0.0';

interface MigrationResult {
  success: boolean;
  version: string;
  migrationsRun: string[];
  errors: string[];
}

/**
 * Run all necessary migrations to bring data up to current version
 */
export function runMigrations(): MigrationResult {
  const result: MigrationResult = {
    success: true,
    version: CURRENT_DATA_VERSION,
    migrationsRun: [],
    errors: []
  };

  try {
    const currentVersion = localStorage.getItem('dataVersion') || '1.0.0';
    
    if (compareVersions(currentVersion, CURRENT_DATA_VERSION) >= 0) {
      // Already up to date!
      return result;
    }

    console.log(`🔄 Migrating data from v${currentVersion} to v${CURRENT_DATA_VERSION}...`);

    // Run migrations in order
    if (compareVersions(currentVersion, '1.1.0') < 0) {
      migrate_1_0_to_1_1(result);
    }
    
    if (compareVersions(currentVersion, '2.0.0') < 0) {
      migrate_1_1_to_2_0(result);
    }

    // Update version
    localStorage.setItem('dataVersion', CURRENT_DATA_VERSION);
    console.log('✅ Migration complete!');

  } catch (error) {
    result.success = false;
    result.errors.push(`Migration failed: ${error}`);
    console.error('❌ Migration error:', error);
  }

  return result;
}

/**
 * Migration: 1.0 → 1.1
 * Added timestamps to completed lessons
 */
function migrate_1_0_to_1_1(result: MigrationResult) {
  try {
    console.log('📦 Migrating to v1.1.0: Adding timestamps...');
    
    // Get all kid accounts
    const kidAccounts = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
    
    kidAccounts.forEach((kid: any) => {
      const key = `kid_${kid.kidId}_completedLessons`;
      const lessons = JSON.parse(localStorage.getItem(key) || '[]');
      
      // If lessons are just strings (old format), convert to objects
      if (lessons.length > 0 && typeof lessons[0] === 'string') {
        const newFormat = lessons.map((lessonId: string) => ({
          id: lessonId,
          completedAt: Date.now(), // Assume completed recently
          coins: 50 // Default reward
        }));
        
        localStorage.setItem(key, JSON.stringify(newFormat));
        result.migrationsRun.push(`Migrated ${lessons.length} lessons for kid ${kid.kidId}`);
      }
    });
    
    console.log('✅ v1.1.0 migration complete');
  } catch (error) {
    result.errors.push(`v1.1.0 migration error: ${error}`);
  }
}

/**
 * Migration: 1.1 → 2.0
 * Added lesson generator support
 */
function migrate_1_1_to_2_0(result: MigrationResult) {
  try {
    console.log('📦 Migrating to v2.0.0: Adding lesson generator support...');
    
    // Initialize generated lessons array if it doesn't exist
    if (!localStorage.getItem('generatedLessons')) {
      localStorage.setItem('generatedLessons', '[]');
      result.migrationsRun.push('Initialized generated lessons storage');
    }
    
    // Add completedGeneratedLessons for each kid
    const kidAccounts = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
    kidAccounts.forEach((kid: any) => {
      const key = `kid_${kid.kidId}_completedGeneratedLessons`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, '[]');
        result.migrationsRun.push(`Added generated lessons tracking for kid ${kid.kidId}`);
      }
    });
    
    console.log('✅ v2.0.0 migration complete');
  } catch (error) {
    result.errors.push(`v2.0.0 migration error: ${error}`);
  }
}

/**
 * Compare two version strings
 * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < 3; i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    
    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
  }
  
  return 0;
}

/**
 * Check if localStorage is getting full
 * Returns percentage used (0-100)
 */
export function checkStorageUsage(): number {
  try {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    
    // Assume 5MB limit (conservative estimate)
    const limitBytes = 5 * 1024 * 1024;
    const percentUsed = (total / limitBytes) * 100;
    
    return Math.min(percentUsed, 100);
  } catch {
    return 0;
  }
}

/**
 * Clean up old data if storage is getting full
 */
export function cleanupOldData(): { cleaned: boolean; itemsRemoved: number } {
  const usage = checkStorageUsage();
  
  if (usage < 80) {
    return { cleaned: false, itemsRemoved: 0 };
  }
  
  console.log('🧹 Storage is getting full, cleaning up...');
  let itemsRemoved = 0;
  
  try {
    // Clean old generated lessons (keep only 50 newest)
    const lessons = JSON.parse(localStorage.getItem('generatedLessons') || '[]');
    if (lessons.length > 50) {
      lessons.sort((a: any, b: any) => b.timestamp - a.timestamp);
      localStorage.setItem('generatedLessons', JSON.stringify(lessons.slice(0, 50)));
      itemsRemoved += lessons.length - 50;
    }
    
    // Remove any temp data older than 7 days
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    
    for (let key in localStorage) {
      if (key.startsWith('temp_') || key.startsWith('cache_')) {
        try {
          const data = JSON.parse(localStorage[key]);
          if (data.timestamp && (now - data.timestamp) > sevenDays) {
            localStorage.removeItem(key);
            itemsRemoved++;
          }
        } catch {
          // Not JSON or no timestamp, leave it
        }
      }
    }
    
    console.log(`✅ Cleanup complete! Removed ${itemsRemoved} items`);
    return { cleaned: true, itemsRemoved };
    
  } catch (error) {
    console.error('Cleanup error:', error);
    return { cleaned: false, itemsRemoved };
  }
}

/**
 * Create a backup of all data
 * Returns JSON string that can be saved/downloaded
 */
export function createBackup(): string {
  const backup: any = {
    version: CURRENT_DATA_VERSION,
    timestamp: Date.now(),
    data: {}
  };
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      try {
        backup.data[key] = localStorage[key];
      } catch (error) {
        console.warn(`Couldn't backup key: ${key}`);
      }
    }
  }
  
  return JSON.stringify(backup, null, 2);
}

/**
 * Restore from a backup
 */
export function restoreBackup(backupString: string): { success: boolean; error?: string } {
  try {
    const backup = JSON.parse(backupString);
    
    if (!backup.version || !backup.data) {
      return { success: false, error: 'Invalid backup format' };
    }
    
    // Clear existing data
    localStorage.clear();
    
    // Restore backup data
    for (let key in backup.data) {
      localStorage.setItem(key, backup.data[key]);
    }
    
    // Run migrations if backup is old version
    if (compareVersions(backup.version, CURRENT_DATA_VERSION) < 0) {
      runMigrations();
    }
    
    return { success: true };
    
  } catch (error) {
    return { success: false, error: `Restore failed: ${error}` };
  }
}
