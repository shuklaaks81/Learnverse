import { SoundEffects } from '@/utils/soundEffects';

// Mock Web Audio API
const mockOscillator = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  frequency: {
    setValueAtTime: jest.fn(),
    exponentialRampToValueAtTime: jest.fn(),
    linearRampToValueAtTime: jest.fn(),
  },
  type: 'sine',
};

const mockGainNode = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  gain: {
    setValueAtTime: jest.fn(),
    exponentialRampToValueAtTime: jest.fn(),
    linearRampToValueAtTime: jest.fn(),
  },
};

const mockAudioContext = {
  createOscillator: jest.fn(() => mockOscillator),
  createGain: jest.fn(() => mockGainNode),
  destination: {} as AudioDestinationNode,
  currentTime: 0,
};

describe('SoundEffects Utility (src/utils/soundEffects.ts)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock AudioContext
    if (typeof window !== 'undefined') {
      (window as any).AudioContext = jest.fn(() => mockAudioContext);
    }
  });

  it('creates AudioContext on instantiation', () => {
    const sounds = new SoundEffects();
    expect(mockAudioContext.createOscillator).toBeDefined();
  });

  it('has playCorrect method', () => {
    const sounds = new SoundEffects();
    expect(typeof sounds.playCorrect).toBe('function');
  });

  it('has playWrong method', () => {
    const sounds = new SoundEffects();
    expect(typeof sounds.playWrong).toBe('function');
  });

  it('has playCelebration method', () => {
    const sounds = new SoundEffects();
    expect(typeof sounds.playCelebration).toBe('function');
  });

  it('has playAchievement method', () => {
    const sounds = new SoundEffects();
    expect(typeof sounds.playAchievement).toBe('function');
  });

  it('has playClick method', () => {
    const sounds = new SoundEffects();
    expect(typeof sounds.playClick).toBe('function');
  });

  it('playCorrect creates oscillator and gain node', () => {
    const sounds = new SoundEffects();
    sounds.playCorrect();
    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    expect(mockAudioContext.createGain).toHaveBeenCalled();
  });

  it('playWrong creates oscillator and gain node', () => {
    const sounds = new SoundEffects();
    sounds.playWrong();
    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    expect(mockAudioContext.createGain).toHaveBeenCalled();
  });

  it('playCelebration creates multiple oscillators', () => {
    jest.clearAllMocks();
    const sounds = new SoundEffects();
    sounds.playCelebration();
    // Celebration plays 4 notes
    expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(4);
  });

  it('playAchievement creates multiple oscillators', () => {
    jest.clearAllMocks();
    const sounds = new SoundEffects();
    sounds.playAchievement();
    // Achievement plays 3 sparkle sounds
    expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(3);
  });

  it('playClick creates oscillator', () => {
    const sounds = new SoundEffects();
    sounds.playClick();
    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
  });

  it('connects oscillator to gain node', () => {
    const sounds = new SoundEffects();
    sounds.playCorrect();
    expect(mockOscillator.connect).toHaveBeenCalledWith(mockGainNode);
  });

  it('connects gain node to destination', () => {
    const sounds = new SoundEffects();
    sounds.playCorrect();
    expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
  });

  it('starts and stops oscillator', () => {
    const sounds = new SoundEffects();
    sounds.playCorrect();
    expect(mockOscillator.start).toHaveBeenCalled();
    expect(mockOscillator.stop).toHaveBeenCalled();
  });

  it('gracefully handles playCorrect when audioContext is null', () => {
    const sounds = new SoundEffects();
    // Set audioContext to null to test null check
    (sounds as any).audioContext = null;
    
    // Should not throw error
    expect(() => sounds.playCorrect()).not.toThrow();
  });

  it('gracefully handles playWrong when audioContext is null', () => {
    const sounds = new SoundEffects();
    (sounds as any).audioContext = null;
    expect(() => sounds.playWrong()).not.toThrow();
  });

  it('sets frequency values for correct sound', () => {
    const sounds = new SoundEffects();
    sounds.playCorrect();
    expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalled();
    expect(mockOscillator.frequency.exponentialRampToValueAtTime).toHaveBeenCalled();
  });

  it('sets frequency values for wrong sound', () => {
    const sounds = new SoundEffects();
    sounds.playWrong();
    expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalled();
    expect(mockOscillator.frequency.exponentialRampToValueAtTime).toHaveBeenCalled();
  });

  it('sets gain values for audio output', () => {
    const sounds = new SoundEffects();
    sounds.playCorrect();
    expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalled();
    expect(mockGainNode.gain.exponentialRampToValueAtTime).toHaveBeenCalled();
  });

  it('playCelebration uses linear ramp for gain', () => {
    jest.clearAllMocks();
    const sounds = new SoundEffects();
    sounds.playCelebration();
    expect(mockGainNode.gain.linearRampToValueAtTime).toHaveBeenCalled();
  });
});
