/**
 * Performance Monitor & Anti-Lag System
 * 
 * Monitors FPS and automatically adjusts app performance to prevent lag.
 * 
 * Performance Modes:
 * - NORMAL: Full features, all animations, sounds
 * - SIMPLIFIED: Reduced animations, fewer visual effects
 * - OVERDRIVE: Minimal animations, critical features only
 * 
 * Algorithm:
 * 1. Monitor FPS every frame
 * 2. If FPS < 55 for 3 seconds → SIMPLIFIED mode
 * 3. If still < 55 for 5 more seconds → OVERDRIVE mode
 * 4. When FPS > 58 for 3 seconds → restore previous mode
 */

export type PerformanceMode = 'normal' | 'simplified' | 'overdrive' | 'emergency' | 'nuclear' | 'restart' | 'replenish';

export interface PerformanceStats {
  currentFPS: number;
  averageFPS: number;
  mode: PerformanceMode;
  lagSources: string[];
  isMonitoring: boolean;
  emergencyActivations: number;
  intervalsKilled: number;
  mutationsBlocked: number;
  replenishAttempts: number;
  componentsDisabled: string[];
}

class PerformanceMonitor {
  private fps: number = 60;
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private fpsHistory: number[] = [];
  private mode: PerformanceMode = 'normal';
  private listeners: Set<(stats: PerformanceStats) => void> = new Set();
  private animationFrameId: number | null = null;
  private isEnabled: boolean = false;
  
  // Thresholds
  private readonly LOW_FPS_THRESHOLD = 55;
  private readonly EMERGENCY_FPS_THRESHOLD = 30; // EMERGENCY mode trigger
  private readonly NUCLEAR_FPS_THRESHOLD = 15; // NUCLEAR mode trigger
  private readonly RESTART_FPS_THRESHOLD = 10; // RESTART mode trigger
  private readonly RECOVERY_FPS_THRESHOLD = 58;
  private readonly SAMPLE_SIZE = 180; // 3 seconds at 60fps
  private readonly SIMPLIFIED_TRIGGER_TIME = 180; // frames (~3 seconds)
  private readonly OVERDRIVE_TRIGGER_TIME = 300; // frames (~5 seconds)
  private readonly EMERGENCY_TRIGGER_TIME = 420; // frames (~7 seconds)
  private readonly NUCLEAR_DURATION_THRESHOLD = 5000; // 5 seconds in nuclear before restart
  private readonly REPLENISH_ATTEMPT_THRESHOLD = 5; // 5 failed attempts before replenish
  private readonly SERVER_PROCESSING_TIME = 14000; // 14 seconds server simulation
  
  // Counters
  private lowFPSCounter: number = 0;
  private highFPSCounter: number = 0;
  private emergencyActivations: number = 0;
  private intervalsKilled: number = 0;
  private mutationsBlocked: number = 0;
  private nuclearModeStartTime: number = 0;
  private replenishAttempts: number = 0;
  private failedRecoveryAttempts: number = 0;
  
  // Lag sources tracking with attempt counters
  private lagSources: Set<string> = new Set();
  private lagSourceAttempts: Map<string, number> = new Map();
  private disabledComponents: Set<string> = new Set();
  
  // Mutation observer to block suspicious elements
  private mutationObserver: MutationObserver | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Check if anti-lag is enabled in settings
      this.checkSettings();
    }
  }

  private checkSettings() {
    const settings = localStorage.getItem('parentSettings');
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        this.isEnabled = parsed.performance?.antiLag ?? false;
      } catch (e) {
        this.isEnabled = false;
      }
    }
  }

  public enable() {
    if (this.isEnabled && this.animationFrameId === null) {
      this.start();
    }
  }

  public disable() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
    this.mode = 'normal';
    this.notifyListeners();
  }

  public start() {
    if (this.animationFrameId !== null) return;
    
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.setupMutationObserver();
    this.measureFPS();
    console.log('🚀 Performance Monitor started');
  }

  private measureFPS = () => {
    this.frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    // Update FPS every second
    if (deltaTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.fpsHistory.push(this.fps);
      
      // Keep only recent samples
      if (this.fpsHistory.length > this.SAMPLE_SIZE) {
        this.fpsHistory.shift();
      }

      // Check for lag and adjust mode
      this.checkPerformance();
      
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      this.notifyListeners();
    }

    this.animationFrameId = requestAnimationFrame(this.measureFPS);
  };

  private checkPerformance() {
    const avgFPS = this.getAverageFPS();

    // ULTIMATE MODE - REPLENISH (After 5 failed recovery attempts)
    if (this.failedRecoveryAttempts >= this.REPLENISH_ATTEMPT_THRESHOLD && this.mode !== 'replenish') {
      console.error('🔄 REPLENISH MODE: HUNTING LAG SOURCES AND REBUILDING APP!');
      this.activateReplenishMode();
      return;
    }

    // CATASTROPHIC LAG - RESTART MODE (FPS < 10 OR nuclear mode too long)
    if (avgFPS < this.RESTART_FPS_THRESHOLD || 
        (this.mode === 'nuclear' && Date.now() - this.nuclearModeStartTime > this.NUCLEAR_DURATION_THRESHOLD)) {
      console.error('💀 RESTART MODE: NUCLEAR FAILED! RESTARTING APP!');
      this.failedRecoveryAttempts++;
      this.activateRestartMode();
      return;
    }

    // CRITICAL LAG - NUCLEAR MODE (FPS < 15)
    if (avgFPS < this.NUCLEAR_FPS_THRESHOLD && this.mode !== 'nuclear' && this.mode !== 'restart') {
      this.mode = 'nuclear';
      this.nuclearModeStartTime = Date.now();
      this.emergencyActivations++;
      console.error('☢️ NUCLEAR ANTI-LAG ACTIVATED! DESTROYING EVERYTHING!');
      this.activateNuclearMode();
      this.applyPerformanceMode();
      return;
    }

    // SEVERE LAG - EMERGENCY MODE (FPS < 30)
    if (avgFPS < this.EMERGENCY_FPS_THRESHOLD && this.mode !== 'nuclear' && this.mode !== 'emergency') {
      if (this.mode === 'overdrive' && this.lowFPSCounter >= this.EMERGENCY_TRIGGER_TIME / 60) {
        this.mode = 'emergency';
        this.emergencyActivations++;
        console.error('🚨 EMERGENCY MODE ACTIVATED! Taking extreme measures!');
        this.activateEmergencyMode();
        this.applyPerformanceMode();
      }
    }

    // Detect lag
    if (avgFPS < this.LOW_FPS_THRESHOLD) {
      this.lowFPSCounter++;
      this.highFPSCounter = 0;

      // Identify lag sources
      this.identifyLagSources();

      // Escalate performance mode (if not in emergency/nuclear)
      if (this.mode === 'normal' && this.lowFPSCounter >= this.SIMPLIFIED_TRIGGER_TIME / 60) {
        this.mode = 'simplified';
        console.warn('⚠️ Performance degraded. Switching to SIMPLIFIED mode.');
        this.applyPerformanceMode();
      } else if (this.mode === 'simplified' && this.lowFPSCounter >= (this.SIMPLIFIED_TRIGGER_TIME + this.OVERDRIVE_TRIGGER_TIME) / 60) {
        this.mode = 'overdrive';
        console.error('🔥 Severe lag detected. Switching to OVERDRIVE mode.');
        this.applyPerformanceMode();
      }
    } 
    // Recovery
    else if (avgFPS > this.RECOVERY_FPS_THRESHOLD) {
      this.highFPSCounter++;
      this.lowFPSCounter = 0;

      // Restore normal mode gradually (with more caution after emergency)
      if (this.highFPSCounter >= (this.mode === 'nuclear' || this.mode === 'emergency' ? 5 : 3)) {
        if (this.mode === 'nuclear' || this.mode === 'emergency') {
          this.mode = 'overdrive';
          console.log('⚠️ Recovering from emergency. Switching to OVERDRIVE mode.');
          this.applyPerformanceMode();
        } else if (this.mode === 'overdrive') {
          this.mode = 'simplified';
          console.log('✅ Performance improving. Switching to SIMPLIFIED mode.');
          this.applyPerformanceMode();
        } else if (this.mode === 'simplified') {
          this.mode = 'normal';
          console.log('🎉 Performance restored. Switching to NORMAL mode.');
          this.applyPerformanceMode();
        }
        this.highFPSCounter = 0;
        this.lagSources.clear();
      }
    }
  }

  private setupMutationObserver() {
    if (typeof window === 'undefined') return;

    this.mutationObserver = new MutationObserver((mutations) => {
      // Detect rapid DOM additions (lag source!)
      if (this.mode === 'emergency' || this.mode === 'nuclear') {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            // BLOCK suspicious elements from rendering
            if (node instanceof HTMLElement) {
              // Check if it's a lag-causing element
              const isSuspicious = 
                node.classList.contains('particle') ||
                node.classList.contains('box') ||
                node.tagName === 'CANVAS' ||
                node.classList.toString().includes('animate-');
              
              if (isSuspicious) {
                console.warn('🛑 BLOCKED SUSPICIOUS ELEMENT:', node.className);
                node.remove();
                this.mutationsBlocked++;
              }
            }
          });
        });
      }
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private activateEmergencyMode() {
    if (typeof document === 'undefined') return;

    console.log('🚨 EMERGENCY MODE: STOPPING THE SOURCE OF LAG...');

    // 1. Kill all intervals and timeouts (STOP THE SOURCE!)
    const highestTimeoutId = setTimeout(() => {}, 0) as any;
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
      clearInterval(i);
      this.intervalsKilled++;
    }

    // 2. Remove all animated elements
    const animated = document.querySelectorAll('[class*="animate-"]');
    animated.forEach(el => {
      el.classList.forEach(cls => {
        if (cls.includes('animate-')) {
          el.classList.remove(cls);
        }
      });
    });

    // 3. Disable all transitions
    const style = document.createElement('style');
    style.id = 'emergency-lag-killer';
    style.textContent = '* { animation: none !important; transition: none !important; }';
    document.head.appendChild(style);

    // 4. Remove excessive DOM nodes
    const allElements = document.querySelectorAll('*');
    if (allElements.length > 3000) {
      console.warn(`⚠️ Too many DOM nodes (${allElements.length}). Attempting cleanup...`);
      // Remove hidden elements
      allElements.forEach(el => {
        const computed = window.getComputedStyle(el);
        if (computed.display === 'none' || computed.visibility === 'hidden') {
          el.remove();
        }
      });
    }

    console.log('✅ Emergency measures applied!');
  }

  private activateNuclearMode() {
    if (typeof document === 'undefined') return;

    console.error('☢️ NUCLEAR MODE: DESTROYING EVERYTHING TO SAVE FPS!');

    // 1. Kill ALL styles
    const allStyles = document.querySelectorAll('style');
    allStyles.forEach(style => {
      if (!style.id.includes('nuclear')) {
        style.remove();
      }
    });

    // 2. Add nuclear stylesheet (removes EVERYTHING)
    const nuclearStyle = document.createElement('style');
    nuclearStyle.id = 'nuclear-lag-destroyer';
    nuclearStyle.textContent = `
      * {
        animation: none !important;
        transition: none !important;
        transform: none !important;
        filter: none !important;
        box-shadow: none !important;
        background: #ffffff !important;
        border: 1px solid #000000 !important;
      }
      body {
        background: #f0f0f0 !important;
      }
    `;
    document.head.appendChild(nuclearStyle);

    // 3. Remove ALL canvases
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => canvas.remove());

    // 4. Remove all SVGs
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => svg.remove());

    // 5. Kill all media
    const media = document.querySelectorAll('video, audio');
    media.forEach(el => {
      (el as HTMLMediaElement).pause();
      el.remove();
    });

    // 6. Show nuclear warning
    const warning = document.createElement('div');
    warning.id = 'nuclear-warning';
    warning.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: red;
      color: white;
      padding: 20px;
      font-size: 24px;
      font-weight: bold;
      z-index: 999999;
      border: 5px solid yellow;
    `;
    warning.textContent = '☢️ NUCLEAR ANTI-LAG ACTIVE! PERFORMANCE MODE EXTREME!';
    document.body.appendChild(warning);

    setTimeout(() => {
      const warningEl = document.getElementById('nuclear-warning');
      if (warningEl) warningEl.remove();
    }, 5000);

    console.error('☢️ Nuclear measures applied! Everything has been destroyed for FPS!');
    console.warn('⚠️ MutationObserver is now BLOCKING all suspicious elements from rendering!');
  }

  private activateRestartMode() {
    if (typeof window === 'undefined') return;

    console.error('💀 RESTART MODE: NUCLEAR FAILED! LAG IS TOO STRONG!');
    console.error('💀 RESTARTING APP IN 3 SECONDS TO CUT OFF LAG AT THE SOURCE!');

    // Show restart warning
    const restartWarning = document.createElement('div');
    restartWarning.id = 'restart-warning';
    restartWarning.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: black;
      color: red;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      font-weight: bold;
      z-index: 9999999;
      font-family: monospace;
    `;
    restartWarning.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 96px; margin-bottom: 20px;">💀</div>
        <div>RESTART MODE ACTIVATED</div>
        <div style="font-size: 24px; margin-top: 20px; color: yellow;">LAG TOO STRONG! RESTARTING APP...</div>
        <div style="font-size: 36px; margin-top: 20px; color: white;" id="restart-countdown">3</div>
      </div>
    `;
    document.body.innerHTML = '';
    document.body.appendChild(restartWarning);

    // Countdown
    let countdown = 3;
    const countdownInterval = setInterval(() => {
      countdown--;
      const countdownEl = document.getElementById('restart-countdown');
      if (countdownEl) {
        countdownEl.textContent = countdown.toString();
      }
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        // RESTART THE APP!
        window.location.reload();
      }
    }, 1000);

    this.mode = 'restart';
  }

  private activateReplenishMode() {
    if (typeof window === 'undefined') return;

    console.error('🔄 APP REPLENISHER ACTIVATED!');
    console.error('🔍 HUNTING FOR LAG SOURCES...');
    this.mode = 'replenish';
    this.replenishAttempts++;

    // 1. IDENTIFY ALL LAGGY COMPONENTS
    const laggyComponents: string[] = [];
    
    // Check for laggy elements
    const canvases = document.querySelectorAll('canvas');
    if (canvases.length > 3) {
      laggyComponents.push('canvas');
      console.warn('🎯 Found laggy component: CANVAS');
    }
    
    const animations = document.querySelectorAll('[class*="animate-"]');
    if (animations.length > 100) {
      laggyComponents.push('animations');
      console.warn('🎯 Found laggy component: ANIMATIONS');
    }
    
    const particles = document.querySelectorAll('.particle');
    if (particles.length > 50) {
      laggyComponents.push('particles');
      console.warn('🎯 Found laggy component: PARTICLES');
    }

    // 2. SAVE STATE TO "SERVER" (localStorage)
    const appState = {
      timestamp: Date.now(),
      lagSources: Array.from(this.lagSources),
      laggyComponents: laggyComponents,
      attempts: this.failedRecoveryAttempts,
      fps: this.fps,
      mode: this.mode,
      disabledComponents: Array.from(this.disabledComponents),
    };
    
    console.log('📤 SENDING DATA TO SERVER...');
    localStorage.setItem('app_replenish_state', JSON.stringify(appState));
    localStorage.setItem('app_safe_mode', 'true');
    localStorage.setItem('disabled_components', JSON.stringify(laggyComponents));

    // 3. SHOW REPLENISH SCREEN
    const replenishScreen = document.createElement('div');
    replenishScreen.id = 'replenish-screen';
    replenishScreen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: monospace;
      z-index: 9999999;
    `;
    
    replenishScreen.innerHTML = `
      <div style="text-align: center; max-width: 800px; padding: 40px;">
        <div style="font-size: 120px; margin-bottom: 30px; animation: pulse 2s ease-in-out infinite;">🔄</div>
        <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 20px; color: #00ff88;">APP REPLENISHER ACTIVE</h1>
        <div style="font-size: 24px; margin-bottom: 40px; color: #ffd700;">🔍 Hunting for lag sources...</div>
        
        <div id="replenish-status" style="background: rgba(0,0,0,0.5); padding: 30px; border-radius: 20px; border: 3px solid #00ff88; margin-bottom: 30px;">
          <div style="font-size: 18px; margin-bottom: 15px;">📊 Analysis Complete:</div>
          <div style="font-size: 16px; color: #ff6b6b; margin-bottom: 10px;">• Failed Recovery Attempts: ${this.failedRecoveryAttempts}</div>
          <div style="font-size: 16px; color: #ff6b6b; margin-bottom: 10px;">• Lag Sources Found: ${this.lagSources.size}</div>
          <div style="font-size: 16px; color: #ff6b6b; margin-bottom: 10px;">• Laggy Components: ${laggyComponents.length}</div>
          <div style="font-size: 16px; color: #ffd700; margin-top: 20px;">📤 Sending data to server...</div>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); height: 40px; border-radius: 20px; overflow: hidden; margin-bottom: 20px;">
          <div id="progress-bar" style="background: linear-gradient(90deg, #00ff88, #00d4ff); height: 100%; width: 0%; transition: width 0.5s;"></div>
        </div>
        
        <div id="server-status" style="font-size: 20px; color: #00d4ff; margin-bottom: 15px;">⏳ Server processing...</div>
        <div id="countdown" style="font-size: 48px; font-weight: bold; color: #ffd700;">14</div>
        <div style="font-size: 14px; color: #888; margin-top: 20px;">Wiping app and preparing safe mode...</div>
      </div>
      
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      </style>
    `;
    
    document.body.innerHTML = '';
    document.body.appendChild(replenishScreen);

    // 4. SIMULATE SERVER PROCESSING (14 seconds)
    let countdown = 14;
    let progress = 0;
    
    const updateInterval = setInterval(() => {
      countdown--;
      progress += (100 / 14);
      
      const countdownEl = document.getElementById('countdown');
      const progressBar = document.getElementById('progress-bar');
      const serverStatus = document.getElementById('server-status');
      
      if (countdownEl) countdownEl.textContent = countdown.toString();
      if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;
      
      if (serverStatus) {
        if (countdown > 10) {
          serverStatus.textContent = '📤 Uploading app state...';
        } else if (countdown > 7) {
          serverStatus.textContent = '🔍 Analyzing lag patterns...';
        } else if (countdown > 4) {
          serverStatus.textContent = '🛠️ Identifying laggy components...';
        } else if (countdown > 1) {
          serverStatus.textContent = '✅ Safe mode configuration ready!';
        } else {
          serverStatus.textContent = '🚀 Reloading with optimizations...';
        }
      }
      
      if (countdown <= 0) {
        clearInterval(updateInterval);
        // 5. RELOAD APP IN SAFE MODE
        window.location.reload();
      }
    }, 1000);
  }

  private identifyLagSources() {
    // Check for common lag sources
    if (typeof window === 'undefined') return;

    // Check for too many DOM nodes
    const nodeCount = document.querySelectorAll('*').length;
    if (nodeCount > 5000) {
      this.lagSources.add('Too many DOM elements');
    }

    // Check for heavy animations
    const animatedElements = document.querySelectorAll('[class*="animate-"]').length;
    if (animatedElements > 50) {
      this.lagSources.add('Too many animations');
    }

    // Check for memory usage (if available)
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      const usedMemoryMB = memory.usedJSHeapSize / 1048576;
      if (usedMemoryMB > 100) {
        this.lagSources.add('High memory usage');
      }
    }

    // Check for active timers/intervals
    const activeTimers = (window as any).setInterval.length || 0;
    if (activeTimers > 20) {
      this.lagSources.add('Too many timers');
    }
  }

  private applyPerformanceMode() {
    if (typeof document === 'undefined') return;

    const body = document.body;
    
    // Remove all performance classes first
    body.classList.remove('perf-normal', 'perf-simplified', 'perf-overdrive');
    
    // Apply current mode class
    body.classList.add(`perf-${this.mode}`);
    
    // Store in localStorage for components to read
    localStorage.setItem('performanceMode', this.mode);
    
    // Dispatch event for components to react
    window.dispatchEvent(new CustomEvent('performanceModeChange', { 
      detail: { mode: this.mode, fps: this.fps } 
    }));

    this.notifyListeners();
  }

  private getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return sum / this.fpsHistory.length;
  }

  public getStats(): PerformanceStats {
    return {
      currentFPS: this.fps,
      averageFPS: this.getAverageFPS(),
      mode: this.mode,
      lagSources: Array.from(this.lagSources),
      isMonitoring: this.animationFrameId !== null,
      emergencyActivations: this.emergencyActivations,
      intervalsKilled: this.intervalsKilled,
      mutationsBlocked: this.mutationsBlocked,
      replenishAttempts: this.replenishAttempts,
      componentsDisabled: Array.from(this.disabledComponents),
    };
  }

  public subscribe(callback: (stats: PerformanceStats) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners() {
    const stats = this.getStats();
    this.listeners.forEach(listener => listener(stats));
  }

  public getCurrentMode(): PerformanceMode {
    return this.mode;
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (enabled) {
      this.enable();
    } else {
      this.disable();
    }
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Helper to check if feature should be reduced based on mode
export function shouldReduceFeature(feature: 'animations' | 'sounds' | 'effects' | 'background'): boolean {
  const mode = performanceMonitor.getCurrentMode();
  
  if (mode === 'overdrive') {
    return true; // Reduce everything
  }
  
  if (mode === 'simplified') {
    return feature === 'animations' || feature === 'effects';
  }
  
  return false;
}

// Get performance-optimized class names
export function getPerformanceClasses(baseClasses: string): string {
  const mode = performanceMonitor.getCurrentMode();
  
  if (mode === 'overdrive') {
    // Strip all animation classes
    return baseClasses.replace(/animate-\S+/g, '').trim();
  }
  
  if (mode === 'simplified') {
    // Replace heavy animations with simpler ones
    return baseClasses
      .replace(/animate-gradient-shift/g, '')
      .replace(/animate-spin/g, '')
      .replace(/animate-bounce/g, 'animate-pulse')
      .trim();
  }
  
  return baseClasses;
}
