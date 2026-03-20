// Utility to unlock achievements
export function unlockAchievement(achievementId: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`achievement_${achievementId}`, 'true');
    console.log(`🏆 Achievement unlocked: ${achievementId}`);
    
    // Check if this is an Easter egg achievement
    const easterEggAchievements = [
      'ghost', 'space', 'cool', 'gamer', 'blocky', 
      'huh', 'bru', 'ultrasecret', 'okbye', 'the2point0', 'weird', 'panic', 'cookie'
    ];
    
    // If unlocking an Easter egg, also unlock the meta-achievement
    if (easterEggAchievements.includes(achievementId)) {
      localStorage.setItem('achievement_easter_egg_finder', 'true');
      console.log('🎉 Meta-achievement unlocked: Easter Egg Finder!');
    }
  }
}

// Check if achievement is unlocked
export function isAchievementUnlocked(achievementId: string): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(`achievement_${achievementId}`) === 'true';
  }
  return false;
}

// Get total achievements stats
export function getAchievementStats() {
  if (typeof window !== 'undefined') {
    const secretAchievements = [
      'ghost', 'space', 'cool', 'gamer', 'blocky', 
      'huh', 'bru', 'ultrasecret', 'okbye', 'the2point0', 'weird', 'panic', 'cookie'
    ];
    
    const unlockedCount = secretAchievements.filter(id => 
      localStorage.getItem(`achievement_${id}`) === 'true'
    ).length;
    
    return {
      unlocked: unlockedCount,
      total: secretAchievements.length,
      percentage: Math.round((unlockedCount / secretAchievements.length) * 100)
    };
  }
  
  return { unlocked: 0, total: 9, percentage: 0 };
}
