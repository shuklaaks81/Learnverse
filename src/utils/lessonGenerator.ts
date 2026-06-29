/**
 * AI Lesson Generator using Groq
 * Generates interactive educational lessons on-demand
 * FREE & ULTRA-FAST! 🚀
 */

export interface LessonRequest {
  subject: string;      // Math, Science, Reading, etc.
  topic: string;        // Fractions, Solar System, Verbs, etc.
  gradeLevel: string;   // K, 1, 2, 3, 4, 5
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GeneratedLesson {
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
          max_tokens: 4000,
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
    return `Create a HIGHLY EDUCATIONAL, comprehensive interactive lesson for grade ${request.gradeLevel} students.

Subject: ${request.subject}
Topic: ${request.topic}
Difficulty: ${request.difficulty}

CRITICAL EDUCATIONAL REQUIREMENTS:
1. Explain WHY, not just WHAT (include reasoning and understanding)
2. Connect to real-world applications and everyday life
3. Build concepts step-by-step with clear explanations
4. Include multiple detailed examples with explanations of HOW they work
5. Add comprehension checks to ensure understanding
6. Include critical thinking questions that make students think deeper
7. Add review/recap activities to reinforce learning
8. Make connections to prior knowledge students might have

IMPORTANT: Return ONLY valid JSON with no extra text, markdown, or formatting.

Generate a lesson with this exact structure:

{
  "title": "Engaging lesson title with emoji",
  "activities": [
    {
      "type": "intro",
      "data": {
        "title": "Lesson title",
        "description": "Clear learning objectives - what students will learn and WHY it matters",
        "emoji": "Relevant emoji"
      }
    },
    {
      "type": "teach",
      "data": {
        "concept": "Main concept explained in detail - include WHY it works this way, not just WHAT it is. Use simple language but be thorough. Explain the reasoning.",
        "examples": ["Detailed Example 1 with explanation of HOW and WHY", "Detailed Example 2 with step-by-step breakdown", "Detailed Example 3 showing a different approach", "Example 4 with real-world application"],
        "visualAid": "Description of visual aid that helps understanding - be specific about what to show and why it helps",
        "funFact": "Educational fun fact that deepens understanding or connects to real world - make it meaningful, not just entertaining"
      }
    },
    {
      "type": "teach",
      "data": {
        "concept": "Build on previous concept - take it deeper. Explain a related aspect or show WHY this matters in real life.",
        "examples": ["Real-world example students can relate to", "Example showing common mistakes and how to avoid them", "Example connecting to something they already know", "Challenge example for deeper thinking"],
        "visualAid": "Another helpful visual description",
        "funFact": "Another meaningful fact that adds educational value"
      }
    },
    {
      "type": "dragdrop",
      "data": {
        "question": "Practice question that tests UNDERSTANDING, not just memorization. Make them think about WHY.",
        "items": [
          { "id": "1", "content": "Item that requires understanding the concept", "correctZone": "zone-id" }
        ],
        "zones": [
          { "id": "zone-id", "label": "Zone label that explains WHY items go here" }
        ]
      }
    },
    {
      "type": "matching",
      "data": {
        "instruction": "Match instruction that emphasizes understanding connections and relationships",
        "pairs": [
          { "id": "1", "left": "Concept or problem", "right": "Explanation or solution with reasoning" }
        ]
      }
    },
    {
      "type": "teach",
      "data": {
        "concept": "RECAP and REVIEW - summarize what was learned, reinforce key points, explain how it all connects",
        "examples": ["Summary example tying everything together", "Common mistake to avoid", "How to remember this concept", "Next steps in learning"],
        "visualAid": "Summary visual showing the big picture",
        "funFact": "Final insight that makes students think differently about the topic"
      }
    },
    {
      "type": "celebration",
      "data": {
        "message": "Congratulations message that reinforces what they learned and WHY it matters",
        "coinsEarned": 100,
        "starsEarned": 5
      }
    }
  ]
}

EDUCATIONAL EXCELLENCE REQUIREMENTS:
- Include 10-15 activities total for DEEP, THOROUGH learning
- Start with clear learning objectives (what AND why)
- Include 3-4 DETAILED teach activities that build on each other
- Each teach activity should explain WHY, not just WHAT
- Include 5-8 varied practice activities that test UNDERSTANDING
- Add at least one recap/review activity before celebration
- Every example should include an EXPLANATION of how/why it works
- Connect concepts to real-world applications students can relate to
- Include critical thinking elements - make them reason, not just memorize
- Progress from simple to complex - scaffold the learning
- Use age-appropriate language but don't oversimplify - kids can handle depth!
- Make it engaging AND educational - learning should be fun but meaningful
- Ensure complete understanding before moving to practice
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
