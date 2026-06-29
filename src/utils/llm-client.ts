/**
 * LLM Client Utility
 * Handles API calls to Groq API (super fast inference!)
 * Supports Llama 3, Mixtral, and more
 */

interface LLMRequest {
  model: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

interface LLMResponse {
  text: string;
  cached: boolean;
  model: string;
  timestamp: number;
}

export class LLMClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.groq.com/openai/v1/chat/completions';
  private cache: Map<string, LLMResponse>;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || '';
    this.cache = new Map();
  }

  /**
   * Generate completion using specified model
   * @param request - LLM request configuration
   * @returns LLM response with text and metadata
   */
  async generate(request: LLMRequest): Promise<LLMResponse> {
    const cacheKey = this.getCacheKey(request);
    
    // Check cache first (90% hit rate expected)
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour TTL
      return { ...cached, cached: true };
    }

    // Build messages array for chat format
    const messages = [];
    if (request.systemPrompt) {
      messages.push({
        role: 'system',
        content: request.systemPrompt
      });
    }
    messages.push({
      role: 'user',
      content: request.prompt
    });

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: request.model,
          messages: messages,
          temperature: request.temperature || 0.7,
          max_tokens: request.maxTokens || 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';

      const result: LLMResponse = {
        text: text,
        cached: false,
        model: request.model,
        timestamp: Date.now(),
      };

      // Store in cache
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error('LLM generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate cache key from request parameters
   */
  private getCacheKey(request: LLMRequest): string {
    return `${request.model}:${request.systemPrompt}:${request.prompt}`;
  }

  /**
   * Clear cache (useful for testing or memory management)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Pre-configured clients for common models
export const tutorLLM = new LLMClient();

// Groq model constants (super fast!)
export const MODELS = {
  LLAMA3_70B: 'llama3-70b-8192',      // Best for complex reasoning
  LLAMA3_8B: 'llama3-8b-8192',        // Fast and efficient
  MIXTRAL: 'mixtral-8x7b-32768',      // Great for creative tasks
  GEMMA_7B: 'gemma-7b-it',            // Good general model
} as const;

// Default prompts for different agent types
export const SYSTEM_PROMPTS = {
  TUTOR: `You are a helpful, patient AI tutor for K-8 students. 
Explain concepts clearly using simple language and engaging examples. 
Keep responses under 100 words. Be encouraging and positive.`,
  
  CONTENT_GEN: `You are an educational content creator for K-8 students.
Generate engaging, age-appropriate lessons with clear learning objectives.
Include interactive elements and knowledge checks.`,
} as const;
