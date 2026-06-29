/**
 * AI BUDDY CONVERSATION MEMORY SYSTEM
 * Remembers what you talked about and learns from conversations
 */

export interface ConversationTurn {
  userMessage: string;
  aiResponse: string;
  timestamp: number;
  topic?: string;
  wasCorrect?: boolean;
}

export interface MemoryContext {
  recentTopics: string[];
  strugglingWith: string[];
  goodAt: string[];
  questionsAsked: number;
  correctAnswers: number;
  lastInteractionTime: number;
  mood: 'confused' | 'confident' | 'curious' | 'frustrated' | 'excited';
  successRate: number;
}

export class ConversationMemory {
  private buddyId: string;
  private history: ConversationTurn[] = [];
  private context: MemoryContext = {
    recentTopics: [],
    strugglingWith: [],
    goodAt: [],
    questionsAsked: 0,
    correctAnswers: 0,
    lastInteractionTime: Date.now(),
    mood: 'curious',
    successRate: 1.0
  };

  constructor(buddyId: string) {
    this.buddyId = buddyId;
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(`buddy_memory_${this.buddyId}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.history = data.history || [];
        this.context = data.context || this.context;
      } catch (e) {
        console.error('Failed to load memory:', e);
      }
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;

    localStorage.setItem(`buddy_memory_${this.buddyId}`, JSON.stringify({
      history: this.history.slice(-50), // Keep last 50 messages
      context: this.context
    }));
  }

  addTurn(userMessage: string, aiResponse: string, topic?: string, wasCorrect?: boolean) {
    const turn: ConversationTurn = {
      userMessage,
      aiResponse,
      timestamp: Date.now(),
      topic,
      wasCorrect
    };

    this.history.push(turn);
    this.context.questionsAsked++;
    
    if (wasCorrect === true) {
      this.context.correctAnswers++;
    }

    // Update topic tracking
    if (topic && !this.context.recentTopics.includes(topic)) {
      this.context.recentTopics.push(topic);
      if (this.context.recentTopics.length > 5) {
        this.context.recentTopics.shift();
      }
    }

    // Detect struggles (3+ questions on same topic with wrong answers)
    if (topic && wasCorrect === false) {
      const topicMisses = this.history.filter(h => 
        h.topic === topic && h.wasCorrect === false
      ).length;
      
      if (topicMisses >= 3 && !this.context.strugglingWith.includes(topic)) {
        this.context.strugglingWith.push(topic);
      }
    }

    // Detect strengths (5+ correct on topic)
    if (topic && wasCorrect === true) {
      const topicCorrect = this.history.filter(h =>
        h.topic === topic && h.wasCorrect === true
      ).length;
      
      if (topicCorrect >= 5 && !this.context.goodAt.includes(topic)) {
        this.context.goodAt.push(topic);
      }
    }

    this.context.lastInteractionTime = Date.now();
    this.context.successRate = this.getSuccessRate();
    this.saveToStorage();
  }

  getRecentHistory(count: number = 5): ConversationTurn[] {
    return this.history.slice(-count);
  }

  getContext(): MemoryContext {
    return { ...this.context };
  }

  updateMood(mood: MemoryContext['mood']) {
    this.context.mood = mood;
    this.saveToStorage();
  }

  hasDiscussedRecently(topic: string): boolean {
    return this.context.recentTopics.includes(topic);
  }

  isStrugglingWith(topic: string): boolean {
    return this.context.strugglingWith.includes(topic);
  }

  isGoodAt(topic: string): boolean {
    return this.context.goodAt.includes(topic);
  }

  getSuccessRate(): number {
    if (this.context.questionsAsked === 0) return 1;
    return this.context.correctAnswers / this.context.questionsAsked;
  }

  clear() {
    this.history = [];
    this.context = {
      recentTopics: [],
      strugglingWith: [],
      goodAt: [],
      questionsAsked: 0,
      correctAnswers: 0,
      lastInteractionTime: Date.now(),
      mood: 'curious',
      successRate: 1.0
    };
    this.saveToStorage();
  }
}
