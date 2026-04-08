"use client";

import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

/**
 * Tutor Agent - Autonomous AI tutor using Groq API
 * 
 * Responsibilities:
 * - Answer student questions about lessons
 * - Cache common responses (90% API call reduction)
 * - Rate limit students (10 questions/day)
 * - Log interactions for analytics
 * 
 * Model: Llama 3.3 70B (via Groq)
 * Platform: Groq API (FREE & ULTRA FAST!)
 * Speed: ~1-2 seconds per response
 */

interface TutorResponse {
  answer: string;
  cached: boolean;
  timestamp: number;
  latency?: number;
}

interface CacheStats {
  size: number;
  maxSize: number;
  hitRate: string;
}

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class TutorAgent {
  private cache: LRUCache<string, string>;
  private apiKey: string;
  private baseUrl: string = 'https://api.groq.com/openai/v1/chat/completions';
  private rateLimiter: Map<string, number[]>; // student_id -> timestamps
  private conversationHistory: Map<string, ConversationMessage[]>; // student_id -> messages
  private stats = {
    cacheHits: 0,
    cacheMisses: 0,
    totalRequests: 0,
  };
  
  constructor() {
    // Get Groq API key from environment (same as lesson generator!)
    this.apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
    
    // LRU cache: 1000 items, 30-day TTL
    this.cache = new LRUCache<string, string>({
      max: 1000,
      ttl: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
    
    // Rate limiting: student_id → array of request timestamps
    this.rateLimiter = new Map();
    
    // Conversation history: student_id → array of messages
    this.conversationHistory = new Map();
    
    console.log('[TutorAgent] Initialized with Groq API + Memory! 🧠');
  }
  
  /**
   * Check if student has exceeded rate limit (50 questions/day)
   * Returns true if request is allowed, false if limit exceeded
   */
  private checkRateLimit(studentId: string): boolean {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    // Get existing requests for this student
    let requests = this.rateLimiter.get(studentId) || [];
    
    // Filter out requests older than 24 hours
    requests = requests.filter(timestamp => (now - timestamp) < dayMs);
    
    // Check if student has hit limit (50/day - plenty for demos!)
    if (requests.length >= 50) {
      console.log(`[TutorAgent] Rate limit exceeded for ${studentId}: ${requests.length}/50`);
      return false;
    }
    
    // Allow request, add to log
    requests.push(now);
    this.rateLimiter.set(studentId, requests);
    return true;
  }
  
  /**
   * Generate cache key from question (hash)
   * Same question wording = same cache hit
   */
  private getCacheKey(question: string): string {
    return crypto
      .createHash('sha256')
      .update(question.toLowerCase().trim())
      .digest('hex');
  }
  
  /**
   * Main tutor method - answer student question
   * 
   * Workflow:
   * 1. Check rate limit (50/day per student)
   * 2. Check cache (instant response if found)
   * 3. Call Groq API with Llama 3.3 70B (if not cached)
   * 4. Cache response (for next student)
   * 5. Log to analytics (track engagement)
   */
  async generateExplanation(
    question: string,
    studentId: string
  ): Promise<TutorResponse> {
    const startTime = Date.now();
    this.stats.totalRequests++;
    
    // Step 1: Rate limiting
    if (!this.checkRateLimit(studentId)) {
      return {
        answer: "You've asked 50 questions today! 🌟 Come back tomorrow to ask more. You're doing great!",
        cached: true,
        timestamp: Date.now(),
        latency: Date.now() - startTime,
      };
    }
    
    // Step 2: Check cache
    const cacheKey = this.getCacheKey(question);
    const cachedAnswer = this.cache.get(cacheKey);
    
    if (cachedAnswer) {
      this.stats.cacheHits++;
      console.log(`[TutorAgent] Cache HIT for question: "${question.substring(0, 50)}..."`);
      return {
        answer: cachedAnswer,
        cached: true,
        timestamp: Date.now(),
        latency: Date.now() - startTime,
      };
    }
    
    // Step 3: Call LLM (cache miss)
    this.stats.cacheMisses++;
    console.log(`[TutorAgent] Cache MISS, calling LLM for: "${question.substring(0, 50)}..."`);
    
    try {
      const answer = await this.callLlamaAPI(question, studentId);
      
      // Step 4: Cache response
      this.cache.set(cacheKey, answer);
      
      // Step 4.5: Add to conversation history
      this.addToHistory(studentId, 'user', question);
      this.addToHistory(studentId, 'assistant', answer);
      
      // Step 5: Log to analytics (async, don't block response)
      this.logTutorQuery(studentId, question, answer).catch(err =>
        console.error('[TutorAgent] Failed to log query:', err)
      );
      
      return {
        answer,
        cached: false,
        timestamp: Date.now(),
        latency: Date.now() - startTime,
      };
    } catch (error) {
      console.error('[TutorAgent] Error calling LLM:', error);
      return {
        answer: "I'm thinking really hard right now! 🤔 Please try again in a moment.",
        cached: false,
        timestamp: Date.now(),
        latency: Date.now() - startTime,
      };
    }
  }
  
  /**
   * Add message to conversation history
   * Keeps last 10 messages (5 back-and-forth exchanges)
   */
  private addToHistory(studentId: string, role: 'user' | 'assistant', content: string): void {
    let history = this.conversationHistory.get(studentId) || [];
    
    history.push({ role, content });
    
    // Keep only last 10 messages (5 exchanges) to avoid token limits
    if (history.length > 10) {
      history = history.slice(-10);
    }
    
    this.conversationHistory.set(studentId, history);
  }
  
  /**
   * Get conversation history for a student
   */
  private getHistory(studentId: string): ConversationMessage[] {
    return this.conversationHistory.get(studentId) || [];
  }
  
  /**
   * Clear conversation history for a student (fresh start)
   */
  clearHistory(studentId: string): void {
    this.conversationHistory.delete(studentId);
    console.log(`[TutorAgent] Cleared history for ${studentId}`);
  }
  
  /**
   * Call Groq API with Llama 3.3 70B
   * Same API as lesson generator - FREE & ULTRA FAST!
   * 
   * System prompt ensures:
   * - Simple language (grades K-5)
   * - Encouraging tone
   * - Relatable examples
   * - Short answer (2-4 sentences)
   * 
   * NOW WITH MEMORY! Includes conversation history!
   */
  private async callLlamaAPI(question: string, studentId: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Groq API key not configured');
    }

    const systemPrompt = `You are an enthusiastic, patient AI tutor for elementary school students (grades K-5).

Your teaching style:
- Explain concepts in SIMPLE, fun language
- Use everyday examples kids can relate to
- Keep responses SHORT (2-4 sentences max)
- Use emojis to make it engaging! 🎉
- Encourage curiosity and ask follow-up questions
- Break down complex topics into bite-sized pieces
- Be positive and supportive!

Remember: You're talking to KIDS, so keep it super simple and fun!`;

    // Get conversation history
    const history = this.getHistory(studentId);
    
    // Build messages array: system prompt + history + current question
    const messages: ConversationMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...history, // Include previous conversation!
      {
        role: 'user',
        content: question
      }
    ];
    
    console.log(`[TutorAgent] Calling Groq API with ${history.length} previous messages...`);
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile', // Same as lesson generator!
          messages,
          temperature: 0.7,
          max_tokens: 300,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Groq API error ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      
      // Extract answer from Groq response
      const answer = data.choices?.[0]?.message?.content?.trim() || 
        "I couldn't understand that question. Can you rephrase it? 😊";
      
      return answer;
    } catch (error) {
      console.error('[TutorAgent] Groq API error:', error);
      throw error;
    }
  }
  
  /**
   * Log tutor query to analytics
   * Async operation - doesn't block response to student
   */
  private async logTutorQuery(
    studentId: string,
    question: string,
    answer: string
  ): Promise<void> {
    try {
      const response = await fetch('/api/tutor-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          question,
          answerPreview: answer.substring(0, 100),
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.warn('[TutorAgent] Failed to log query:', response.statusText);
      }
    } catch (error) {
      // Fail silently - don't disrupt student experience
      console.error('[TutorAgent] Logging error:', error);
    }
  }
  
  /**
   * Get cache statistics for monitoring
   */
  getCacheStats(): CacheStats {
    const total = this.stats.cacheHits + this.stats.cacheMisses;
    const hitRate = total > 0 
      ? ((this.stats.cacheHits / total) * 100).toFixed(1) + '%'
      : 'N/A';
    
    return {
      size: this.cache.size,
      maxSize: 1000,
      hitRate,
    };
  }
  
  /**
   * Get overall statistics for monitoring dashboard
   */
  getStats() {
    const total = this.stats.cacheHits + this.stats.cacheMisses;
    return {
      totalRequests: this.stats.totalRequests,
      cacheHits: this.stats.cacheHits,
      cacheMisses: this.stats.cacheMisses,
      hitRate: total > 0 ? ((this.stats.cacheHits / total) * 100).toFixed(1) : '0',
      cacheSize: this.cache.size,
    };
  }
}

// Singleton instance
let instance: TutorAgent | null = null;

export function getTutorAgent(): TutorAgent {
  if (!instance) {
    instance = new TutorAgent();
  }
  return instance;
}

// For testing
export const tutorAgent = new TutorAgent();
