/**
 * AI Lesson Generator using Groq
 * Generates interactive educational lessons on-demand
 * FREE & ULTRA-FAST! 🚀
 */

interface LessonRequest {
  subject: string;      // Math, Science, Reading, etc.
  topic: string;        // Fractions, Solar System, Verbs, etc.
  gradeLevel: string;   // K, 1, 2, 3, 4, 5
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GeneratedLesson {
  title: string;
  activities: Array<{
    type: 'intro' | 'teach' | 'animation' | 'dragdrop' | 'matching' | 'minigame' | 'drawing' | 'celebration';
    data: any;
  }>;
}

export class LessonGenerator {
  private apiKey: string;
  private baseUrl: string = 'https://api.groq.com/openai/v1/chat/completions';
  
  constructor() {
    // Get Groq API key from environment
    this.apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
  }

  /**
   * Generate a complete interactive lesson using Groq AI
   */
  async generateLesson(request: LessonRequest): Promise<GeneratedLesson> {
    const prompt = this.buildPrompt(request);
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile', // Groq's fastest free model!
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational content creator for kids. Generate engaging, age-appropriate interactive lessons in JSON format. ONLY return valid JSON, no other text.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: "json_object" }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Groq API error ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      if (!content) {
        throw new Error('No response from Groq AI');
      }
      
      // Clean the response - remove markdown code blocks and extra text
      let cleanedContent = content.trim();
      
      // Remove markdown code blocks (```json ... ``` or ``` ... ```)
      if (cleanedContent.includes('```')) {
        const codeBlockMatch = cleanedContent.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
          cleanedContent = codeBlockMatch[1].trim();
        }
      }
      
      // Find JSON object boundaries
      const jsonStart = cleanedContent.indexOf('{');
      const jsonEnd = cleanedContent.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanedContent = cleanedContent.substring(jsonStart, jsonEnd + 1);
      }
      
      // Parse JSON response
      try {
        const lesson = JSON.parse(cleanedContent);
        return lesson;
      } catch (parseError) {
        console.error('Failed to parse AI response:', content);
        console.error('Cleaned content:', cleanedContent);
        throw new Error('AI returned invalid JSON format');
      }
      
    } catch (error) {
      console.error('Lesson generation failed:', error);
      throw error;
    }
  }

  /**
   * Build the AI prompt for lesson generation
   */
  private buildPrompt(request: LessonRequest): string {
    return `Create an interactive educational lesson for grade ${request.gradeLevel} students.

Subject: ${request.subject}
Topic: ${request.topic}
Difficulty: ${request.difficulty}

IMPORTANT: Return ONLY valid JSON with no extra text, markdown, or formatting.

Generate a lesson with this exact structure:

{
  "title": "Engaging lesson title with emoji",
  "activities": [
    {
      "type": "intro",
      "data": {
        "title": "Lesson title",
        "description": "What students will learn",
        "emoji": "Relevant emoji"
      }
    },
    {
      "type": "teach",
      "data": {
        "concept": "Main concept explained simply",
        "examples": ["Example 1", "Example 2", "Example 3"],
        "visualAid": "Description of what to show",
        "funFact": "Interesting fact about the topic"
      }
    },
    {
      "type": "dragdrop",
      "data": {
        "question": "Practice question",
        "items": [
          { "id": "1", "content": "Item text", "correctZone": "zone-id" }
        ],
        "zones": [
          { "id": "zone-id", "label": "Zone label" }
        ]
      }
    },
    {
      "type": "matching",
      "data": {
        "instruction": "Match instruction",
        "pairs": [
          { "id": "1", "left": "Question", "right": "Answer" }
        ]
      }
    },
    {
      "type": "celebration",
      "data": {
        "message": "Congratulations message",
        "coinsEarned": 50,
        "starsEarned": 3
      }
    }
  ]
}

Requirements:
- Include 5-8 activities total
- Start with intro, then teach, then practice activities, end with celebration
- Make it fun, educational, and age-appropriate
- Use emojis and engaging language
- Ensure kids actually LEARN the concept first before practicing
- Return ONLY the JSON object, nothing else`;
  }

  /**
   * Generate multiple lessons at once (batch processing)
   */
  async generateLessonBatch(requests: LessonRequest[]): Promise<GeneratedLesson[]> {
    const promises = requests.map(req => this.generateLesson(req));
    return Promise.all(promises);
  }

  /**
   * Check if Groq API is configured
   */
  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }
}

// Export singleton instance
export const lessonGenerator = new LessonGenerator();
