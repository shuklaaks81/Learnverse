"use client";

import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

/**
 * Tutor Agent - Autonomous AI tutor using Llama 2 7B
 * 
 * Responsibilities:
 * - Answer student questions about lessons
 * - Cache common responses (90% API call reduction)
 * - Rate limit students (10 questions/day)
 * - Log interactions for analytics
 * 
 * Model: Meta Llama 2 7B Chat
 * Platform: HuggingFace Spaces (free GPU tier)
 * Quantization: 4-bit (13GB → 3.5GB)
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

export class TutorAgent {
  private cache: LRUCache<string, string>;
  private endpoint: string;
  private rateLimiter: Map<string, number[]>; // student_id -> timestamps
  private stats = {
    cacheHits: 0,
    cacheMisses: 0,
    totalRequests: 0,
  };
  
  constructor(endpoint?: string) {
    // HuggingFace Spaces endpoint (free GPU tier)
    this.endpoint = endpoint || 
      process.env.NEXT_PUBLIC_TUTOR_ENDPOINT || 
      'https://learnverse-tutor.hf.space/api/predict';
    
    // LRU cache: 1000 items, 30-day TTL
    this.cache = new LRUCache<string, string>({
      max: 1000,
      ttl: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
    
    // Rate limiting: student_id → array of request timestamps
    this.rateLimiter = new Map();
    
    console.log('[TutorAgent] Initialized with endpoint:', this.endpoint);
  }
  
  /**
   * Check if student has exceeded rate limit (10 questions/day)
   * Returns true if request is allowed, false if limit exceeded
   */
  private checkRateLimit(studentId: string): boolean {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    // Get existing requests for this student
    let requests = this.rateLimiter.get(studentId) || [];
    
    // Filter out requests older than 24 hours
    requests = requests.filter(timestamp => (now - timestamp) < dayMs);
    
    // Check if student has hit limit (10/day)
    if (requests.length >= 10) {
      console.log(`[TutorAgent] Rate limit exceeded for ${studentId}: ${requests.length}/10`);
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
   * 1. Check rate limit (10/day per student)
   * 2. Check cache (instant response if found)
   * 3. Call Llama 2 on HuggingFace Spaces (if not cached)
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
        answer: "You've asked 10 questions today! 🌟 Come back tomorrow to ask more. You're doing great!",
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
      const answer = await this.callLlamaAPI(question);
      
      // Step 4: Cache response
      this.cache.set(cacheKey, answer);
      
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
   * Call Llama 2 7B on HuggingFace Spaces
   * 
   * System prompt ensures:
   * - Simple language (grade 3 reading level)
   * - Encouraging tone
   * - Relatable examples
   * - Short answer (< 200 words)
   */
  private async callLlamaAPI(question: string): Promise<string> {
    const systemPrompt = `You are a friendly and encouraging 3rd grade math tutor named Buddy.
Your job is to help students understand math concepts.

Rules:
- Use VERY SIMPLE words (grade 3 reading level)
- Use relatable examples: pizza, toys, animals, family
- Be positive and encouraging
- Keep answer under 150 words
- Never give the answer directly - guide them to think
- End with a friendly emoji like 🌟 or 🎉
- Use simple math language: "groups of", "left over", "fair shares"

Example:
Question: "How do I understand multiplying 3 groups of 4?"
Answer: "Great question! Think of 3 groups of 4 apples. 🍎
If you have 1 group of 4 apples, that's 4 apples.
If you have 2 groups, you have 4 + 4 = 8 apples.
If you have 3 groups, you have 4 + 4 + 4 = 12 apples!

So 3 times 4 (or 3 × 4) = 12 apples. Does that make sense? 🎉"`;

    const payload = {
      data: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: question
        }
      ]
    };

    console.log('[TutorAgent] Calling LLM API at:', this.endpoint);
    
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`LLM API returned ${response.status}`);
      }

      const data = await response.json();
      
      // HuggingFace Spaces returns: { data: ["answer"] }
      const answer = data.data?.[0] || data.answer || 
        "I couldn't understand that question. Can you rephrase it? 😊";
      
      return answer;
    } catch (error) {
      console.error('[TutorAgent] LLM API error:', error);
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
