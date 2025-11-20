// Streak Tracker Utility - Tracks daily learning streaks! 🔥

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  totalDaysActive: number;
}

export const getStreakData = (): StreakData => {
  const defaultData: StreakData = {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: '',
    totalDaysActive: 0
  };

  try {
    const saved = localStorage.getItem('streakData');
    if (!saved) return defaultData;
    
    const data = JSON.parse(saved) as StreakData;
    return data;
  } catch {
    return defaultData;
  }
};

export const updateStreak = (): { 
  streakData: StreakData; 
  isNewRecord: boolean; 
  bonusCoins: number;
  message: string;
} => {
  const today = new Date().toDateString();
  const data = getStreakData();
  
  // If already updated today, just return current data
  if (data.lastActivityDate === today) {
    return { 
      streakData: data, 
      isNewRecord: false, 
      bonusCoins: 0,
      message: 'Already updated today!' 
    };
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  
  let newStreak = data.currentStreak;
  let isNewRecord = false;
  let bonusCoins = 0;
  let message = '';
  
  // Check if streak continues
  if (data.lastActivityDate === yesterdayStr) {
    // Streak continues!
    newStreak = data.currentStreak + 1;
    bonusCoins = newStreak * 10; // 10 coins per day in streak!
    message = `🔥 ${newStreak} Day Streak! +${bonusCoins} bonus coins!`;
    
    // Milestone bonuses!
    if (newStreak === 7) {
      bonusCoins += 100;
      message = `🎉 7 DAY STREAK! +${bonusCoins} coins! (100 bonus!)`;
    } else if (newStreak === 30) {
      bonusCoins += 500;
      message = `🌟 30 DAY STREAK! +${bonusCoins} coins! (500 bonus!)`;
    } else if (newStreak === 100) {
      bonusCoins += 2000;
      message = `💎 100 DAY STREAK! +${bonusCoins} coins! (2000 bonus!)`;
    } else if (newStreak === 365) {
      bonusCoins += 10000;
      message = `👑 365 DAY STREAK! +${bonusCoins} coins! (10000 LEGENDARY BONUS!)`;
    }
  } else {
    // Streak broken or starting fresh
    if (data.currentStreak > 0) {
      message = `💔 Streak broken! Starting fresh at 1 day. +10 coins`;
    } else {
      message = `🌟 Streak started! Day 1! +10 coins`;
    }
    newStreak = 1;
    bonusCoins = 10;
  }
  
  // Check for new record
  if (newStreak > data.longestStreak) {
    isNewRecord = true;
    message += ` 🏆 NEW RECORD!`;
    bonusCoins += 50; // Bonus for breaking your record!
  }
  
  const newData: StreakData = {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, data.longestStreak),
    lastActivityDate: today,
    totalDaysActive: data.totalDaysActive + 1
  };
  
  localStorage.setItem('streakData', JSON.stringify(newData));
  
  // Award bonus coins
  if (bonusCoins > 0) {
    const currentKid = JSON.parse(localStorage.getItem('currentKid') || '{}');
    const updatedKid = { 
      ...currentKid, 
      coins: (currentKid.coins || 0) + bonusCoins 
    };
    localStorage.setItem('currentKid', JSON.stringify(updatedKid));
    
    // Update kid accounts
    const kidAccounts = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
    const updatedAccounts = kidAccounts.map((kid: any) => 
      kid.id === currentKid.id ? updatedKid : kid
    );
    localStorage.setItem('kidAccounts', JSON.stringify(updatedAccounts));
  }
  
  return { streakData: newData, isNewRecord, bonusCoins, message };
};

export const getStreakEmoji = (streak: number): string => {
  if (streak === 0) return '✨';
  if (streak < 3) return '🔥';
  if (streak < 7) return '🔥🔥';
  if (streak < 14) return '🔥🔥🔥';
  if (streak < 30) return '⚡';
  if (streak < 50) return '💪';
  if (streak < 100) return '🌟';
  if (streak < 365) return '💎';
  return '👑'; // 365+ days!
};
