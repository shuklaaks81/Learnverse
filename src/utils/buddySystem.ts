/**
 * Buddy System Utilities
 * 
 * Connect with friends and learn together!
 */

export interface Buddy {
  id: string;
  name: string;
  avatar: string;
  coins: number;
  streak: number;
  completedUnits: string[];
  completedLessons: string[];
  currentUnit?: string;
  lastActive: string;
}

/**
 * Get current kid's buddy (if paired)
 */
export function getBuddy(kidId: string): Buddy | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const buddyData = localStorage.getItem(`kid_${kidId}_buddy`);
    if (!buddyData) return null;
    
    return JSON.parse(buddyData);
  } catch (error) {
    console.error('Error loading buddy:', error);
    return null;
  }
}

/**
 * Set a buddy for current kid
 */
export function setBuddy(kidId: string, buddy: Buddy): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`kid_${kidId}_buddy`, JSON.stringify(buddy));
  } catch (error) {
    console.error('Error saving buddy:', error);
  }
}

/**
 * Remove buddy connection
 */
export function removeBuddy(kidId: string): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(`kid_${kidId}_buddy`);
}

/**
 * Generate a random buddy code for pairing
 */
export function generateBuddyCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Create a demo buddy for testing (simulated friend)
 */
export function createDemoBuddy(): Buddy {
  const demoNames = ['Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Taylor'];
  const demoAvatars = ['👦', '👧', '🧒', '👶', '🦸', '🧑‍🚀'];
  
  return {
    id: 'demo-buddy-' + Date.now(),
    name: demoNames[Math.floor(Math.random() * demoNames.length)],
    avatar: demoAvatars[Math.floor(Math.random() * demoAvatars.length)],
    coins: Math.floor(Math.random() * 500) + 100,
    streak: Math.floor(Math.random() * 10) + 1,
    completedUnits: ['plants', 'animals'], // Demo has completed some units
    completedLessons: [
      'plants-1', 'plants-2', 'plants-3', 'plants-4',
      'animals-1', 'animals-2', 'animals-3'
    ],
    currentUnit: 'ocean',
    lastActive: new Date().toISOString(),
  };
}

/**
 * Get unit progress for kid
 */
export function getKidUnitProgress(kidId: string, unitId: string): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const completedLessons = JSON.parse(
      localStorage.getItem(`kid_${kidId}_completedUnitLessons`) || '[]'
    );
    
    // Count lessons for this unit
    const unitLessonsCompleted = completedLessons.filter((lessonId: string) =>
      lessonId.startsWith(unitId + '-')
    ).length;
    
    return unitLessonsCompleted;
  } catch (error) {
    return 0;
  }
}

/**
 * Get completed units for kid
 */
export function getCompletedUnits(kidId: string): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    return JSON.parse(
      localStorage.getItem(`kid_${kidId}_completedUnits`) || '[]'
    );
  } catch (error) {
    return [];
  }
}

/**
 * Mark unit as completed
 */
export function completeUnit(kidId: string, unitId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const completed = getCompletedUnits(kidId);
    if (!completed.includes(unitId)) {
      completed.push(unitId);
      localStorage.setItem(`kid_${kidId}_completedUnits`, JSON.stringify(completed));
    }
  } catch (error) {
    console.error('Error completing unit:', error);
  }
}
