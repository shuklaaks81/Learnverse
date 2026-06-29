import { useLegendaryMode, getLegendaryStyles } from '@/utils/legendaryMode';
import { renderHook } from '@testing-library/react';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Legendary Mode Utility (src/utils/legendaryMode.ts)', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('useLegendaryMode Hook', () => {
    it('returns false when legendaryMode is not set', () => {
      const { result } = renderHook(() => useLegendaryMode());
      expect(result.current).toBe(false);
    });

    it('returns true when legendaryMode is true', () => {
      localStorage.setItem('legendaryMode', 'true');
      const { result } = renderHook(() => useLegendaryMode());
      expect(result.current).toBe(true);
    });

    it('returns false when legendaryMode is false string', () => {
      localStorage.setItem('legendaryMode', 'false');
      const { result } = renderHook(() => useLegendaryMode());
      expect(result.current).toBe(false);
    });

    it('is a valid React hook', () => {
      const { result } = renderHook(() => useLegendaryMode());
      expect(typeof result.current).toBe('boolean');
    });
  });

  describe('getLegendaryStyles', () => {
    it('returns normal theme object when legendaryMode is disabled', () => {
      localStorage.removeItem('legendaryMode');
      const styles = getLegendaryStyles();
      
      expect(styles.background).toBe('bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300');
      expect(styles.card).toBe('bg-white');
      expect(styles.text).toBe('text-gray-800');
      expect(styles.accent).toBe('text-orange-600');
    });

    it('returns legendary theme when legendaryMode is enabled', () => {
      localStorage.setItem('legendaryMode', 'true');
      const styles = getLegendaryStyles();
      
      expect(styles.background).toContain('purple-900');
      expect(styles.background).toContain('black');
      expect(styles.text).toBe('text-cyan-300');
      expect(styles.accent).toBe('text-pink-400');
    });

    it('returns object with required properties', () => {
      const styles = getLegendaryStyles();
      
      expect(styles).toHaveProperty('background');
      expect(styles).toHaveProperty('card');
      expect(styles).toHaveProperty('text');
      expect(styles).toHaveProperty('accent');
      expect(styles).toHaveProperty('button');
    });

    it('includes cyberpunk styling in legendary mode', () => {
      localStorage.setItem('legendaryMode', 'true');
      const styles = getLegendaryStyles();
      
      // Check for cyberpunk elements
      expect(styles.card).toContain('border');
      expect(styles.card).toContain('cyan');
      expect(styles.button).toContain('shadow');
    });

    it('includes backdrop blur in legendary card style', () => {
      localStorage.setItem('legendaryMode', 'true');
      const styles = getLegendaryStyles();
      
      expect(styles.card).toContain('backdrop-blur');
    });

    it('normal theme button has gradient', () => {
      localStorage.removeItem('legendaryMode');
      const styles = getLegendaryStyles();
      
      expect(styles.button).toBe('bg-gradient-to-r from-orange-400 to-pink-400');
    });

    it('legendary theme button has enhanced gradient with shadow', () => {
      localStorage.setItem('legendaryMode', 'true');
      const styles = getLegendaryStyles();
      
      expect(styles.button).toContain('gradient');
      expect(styles.button).toContain('purple');
      expect(styles.button).toContain('shadow');
    });

    it('handles missing window gracefully', () => {
      const originalWindow = global.window;
      (global as any).window = undefined;
      
      const styles = getLegendaryStyles();
      
      // Should default to normal theme when window is undefined
      expect(styles.background).toBe('bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300');
      
      global.window = originalWindow;
    });

    it('returns consistent theme properties', () => {
      const normalStyles = getLegendaryStyles();
      localStorage.setItem('legendaryMode', 'true');
      const legendaryStyles = getLegendaryStyles();
      
      // Both should have same properties
      expect(Object.keys(normalStyles).sort()).toEqual(Object.keys(legendaryStyles).sort());
    });

    it('all style values are strings', () => {
      const styles = getLegendaryStyles();
      
      Object.values(styles).forEach(value => {
        expect(typeof value).toBe('string');
      });
    });

    it('legendary card has transparency', () => {
      localStorage.setItem('legendaryMode', 'true');
      const styles = getLegendaryStyles();
      
      expect(styles.card).toContain('/50');
    });
  });
});
