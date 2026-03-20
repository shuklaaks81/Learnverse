/**
 * LLM Client Utility
 * Handles API calls to Hugging Face Inference API (free tier)
 * Supports Llama 2 7B for tutor agent
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
  private baseUrl: string = 'https://api-inference.huggingface.co/models';
  private cache: Map<string, LLMResponse>;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.HUGGINGFACE_API_KEY || '';
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

    // Build prompt with system context
    const fullPrompt = request.systemPrompt 
      ? `${request.systemPrompt}\n\n${request.prompt}`
      : request.prompt;

    try {
      const response = await fetch(`${this.baseUrl}/${request.model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            temperature: request.temperature || 0.7,
            max_new_tokens: request.maxTokens || 500,
            return_full_text: false,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const text = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;

      const result: LLMResponse = {
        text: text || '',
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

// Model constants
export const MODELS = {
  LLAMA_2_7B: 'meta-llama/Llama-2-7b-chat-hf',
  MISTRAL_7B: 'mistralai/Mistral-7B-Instruct-v0.1',
  CODELLAMA: 'codellama/CodeLlama-7b-hf',
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
