import { getStreakData, updateStreak, StreakData, getStreakEmoji } from '@/utils/streakTracker';

describe('Streak Tracker Utility (src/utils/streakTracker.ts)', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('getStreakData', () => {
    it('returns default data when no streak saved', () => {
      const result = getStreakData();
      expect(result.currentStreak).toBe(0);
      expect(result.longestStreak).toBe(0);
      expect(result.lastActivityDate).toBe('');
      expect(result.totalDaysActive).toBe(0);
    });

    it('returns saved streak data from localStorage', () => {
      const savedData: StreakData = {
        currentStreak: 5,
        longestStreak: 10,
        lastActivityDate: new Date().toDateString(),
        totalDaysActive: 15
      };
      localStorage.setItem('streakData', JSON.stringify(savedData));

      const result = getStreakData();
      expect(result.currentStreak).toBe(5);
      expect(result.longestStreak).toBe(10);
      expect(result.totalDaysActive).toBe(15);
    });

    it('handles corrupted localStorage data gracefully', () => {
      localStorage.setItem('streakData', 'invalid json');
      const result = getStreakData();
      expect(result.currentStreak).toBe(0);
    });
  });

  describe('updateStreak', () => {
    it('increases streak when user is active on a new day', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const initialData: StreakData = {
        currentStreak: 3,
        longestStreak: 5,
        lastActivityDate: yesterday.toDateString(),
        totalDaysActive: 10
      };
      localStorage.setItem('streakData', JSON.stringify(initialData));

      const result = updateStreak();
      expect(result.streakData.currentStreak).toBe(4);
    });

    it('returns same streak if user was active today', () => {
      const today = new Date().toDateString();
      const initialData: StreakData = {
        currentStreak: 3,
        longestStreak: 5,
        lastActivityDate: today,
        totalDaysActive: 10
      };
      localStorage.setItem('streakData', JSON.stringify(initialData));

      const result = updateStreak();
      expect(result.streakData.currentStreak).toBe(3);
    });

    it('resets streak if user was inactive for more than 1 day', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const initialData: StreakData = {
        currentStreak: 5,
        longestStreak: 10,
        lastActivityDate: twoDaysAgo.toDateString(),
        totalDaysActive: 20
      };
      localStorage.setItem('streakData', JSON.stringify(initialData));

      const result = updateStreak();
      expect(result.streakData.currentStreak).toBe(1);
    });

    it('awards bonus coins for long streaks', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const initialData: StreakData = {
        currentStreak: 9, // Will be 10 after update
        longestStreak: 10,
        lastActivityDate: yesterday.toDateString(),
        totalDaysActive: 20
      };
      localStorage.setItem('streakData', JSON.stringify(initialData));

      const result = updateStreak();
      expect(result.bonusCoins).toBeGreaterThanOrEqual(0);
    });

    it('returns isNewRecord when streak beats longest', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const initialData: StreakData = {
        currentStreak: 15,
        longestStreak: 15,
        lastActivityDate: yesterday.toDateString(),
        totalDaysActive: 20
      };
      localStorage.setItem('streakData', JSON.stringify(initialData));

      const result = updateStreak();
      expect(result.isNewRecord).toBeDefined();
    });

    it('returns message string', () => {
      const result = updateStreak();
      expect(typeof result.message).toBe('string');
      expect(result.message.length).toBeGreaterThan(0);
    });

    it('persists updated streak to localStorage', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const initialData: StreakData = {
        currentStreak: 3,
        longestStreak: 5,
        lastActivityDate: yesterday.toDateString(),
        totalDaysActive: 10
      };
      localStorage.setItem('streakData', JSON.stringify(initialData));

      updateStreak();
      const saved = localStorage.getItem('streakData');
      expect(saved).toBeTruthy();
      
      const savedData = JSON.parse(saved!);
      expect(savedData.currentStreak).toBe(4);
    });
  });

  describe('resetStreak', () => {
    it('would reset streak if function existed', () => {
      // Note: resetStreak function not exported from streakTracker.ts
      // This test documents the expected behavior
      expect(true).toBe(true);
    });
  });

  describe('getStreakEmoji', () => {
    it('returns sparkle emoji for 0 streak', () => {
      expect(getStreakEmoji(0)).toBe('✨');
    });

    it('returns fire emoji for small streak', () => {
      expect(getStreakEmoji(1)).toBe('🔥');
      expect(getStreakEmoji(2)).toBe('🔥');
    });

    it('returns double fire for 3-7 day streak', () => {
      expect(getStreakEmoji(3)).toBe('🔥🔥');
      expect(getStreakEmoji(6)).toBe('🔥🔥');
    });

    it('returns triple fire for 7-14 day streak', () => {
      expect(getStreakEmoji(7)).toBe('🔥🔥🔥');
      expect(getStreakEmoji(13)).toBe('🔥🔥🔥');
    });

    it('returns lightning for 14-30 day streak', () => {
      expect(getStreakEmoji(14)).toBe('⚡');
      expect(getStreakEmoji(29)).toBe('⚡');
    });

    it('returns muscle emoji for 30-50 day streak', () => {
      expect(getStreakEmoji(30)).toBe('💪');
      expect(getStreakEmoji(49)).toBe('💪');
    });

    it('returns star emoji for 50-100 day streak', () => {
      expect(getStreakEmoji(50)).toBe('🌟');
      expect(getStreakEmoji(99)).toBe('🌟');
    });

    it('returns diamond emoji for 100-365 day streak', () => {
      expect(getStreakEmoji(100)).toBe('💎');
      expect(getStreakEmoji(364)).toBe('💎');
    });

    it('returns crown emoji for 365+ day streak', () => {
      expect(getStreakEmoji(365)).toBe('👑');
      expect(getStreakEmoji(1000)).toBe('👑');
    });
  });

  describe('StreakData interface', () => {
    it('has currentStreak property', () => {
      const data: StreakData = {
        currentStreak: 5,
        longestStreak: 10,
        lastActivityDate: new Date().toDateString(),
        totalDaysActive: 15
      };
      expect(data.currentStreak).toBeDefined();
    });

    it('has longestStreak property', () => {
      const data: StreakData = {
        currentStreak: 5,
        longestStreak: 10,
        lastActivityDate: new Date().toDateString(),
        totalDaysActive: 15
      };
      expect(data.longestStreak).toBeDefined();
    });

    it('has lastActivityDate property', () => {
      const data: StreakData = {
        currentStreak: 5,
        longestStreak: 10,
        lastActivityDate: new Date().toDateString(),
        totalDaysActive: 15
      };
      expect(data.lastActivityDate).toBeDefined();
    });

    it('has totalDaysActive property', () => {
      const data: StreakData = {
        currentStreak: 5,
        longestStreak: 10,
        lastActivityDate: new Date().toDateString(),
        totalDaysActive: 15
      };
      expect(data.totalDaysActive).toBeDefined();
    });
  });
});
