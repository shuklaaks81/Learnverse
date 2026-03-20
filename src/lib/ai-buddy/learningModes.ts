/**
 * LEARNING MODES ENGINE
 * Different teaching approaches based on context
 */

import { MemoryContext } from './conversationMemory';
import { EducationalTopic } from './educationalLibrary';

export type LearningMode = 'explain' | 'practice' | 'quiz' | 'explore' | 'encourage';

export interface ModeDecision {
  mode: LearningMode;
  reason: string;
  confidence: number;
}

export class LearningModesEngine {
  /**
   * Decide which learning mode to use based on context
   */
  decideBestMode(
    topic: EducationalTopic | null,
    memory: MemoryContext,
    message: string
  ): ModeDecision {
    const msg = message.toLowerCase();
    
    // === EXPLICIT REQUESTS ===
    if (msg.includes('explain') || msg.includes('what is') || msg.includes('what\'s')) {
      return { mode: 'explain', reason: 'user asked for explanation', confidence: 1.0 };
    }
    
    if (msg.includes('practice') || msg.includes('give me') || msg.includes('another one')) {
      return { mode: 'practice', reason: 'user wants practice', confidence: 1.0 };
    }
    
    if (msg.includes('quiz') || msg.includes('test me') || msg.includes('am i ready')) {
      return { mode: 'quiz', reason: 'user wants to be quizzed', confidence: 1.0 };
    }
    
    if (msg.includes('fun fact') || msg.includes('tell me something') || msg.includes('interesting')) {
      return { mode: 'explore', reason: 'user wants exploration', confidence: 1.0 };
    }
    
    // === MOOD-BASED DECISIONS ===
    if (memory.mood === 'frustrated' || memory.mood === 'confused') {
      return { mode: 'encourage', reason: 'user needs encouragement', confidence: 0.9 };
    }
    
    // === SUCCESS RATE ANALYSIS ===
    const successRate = memory.questionsAsked > 0 
      ? memory.correctAnswers / memory.questionsAsked 
      : 1;
    
    if (successRate < 0.5 && memory.questionsAsked >= 3) {
      return { mode: 'explain', reason: 'low success rate, needs more explanation', confidence: 0.85 };
    }
    
    if (successRate > 0.8 && memory.questionsAsked >= 5) {
      return { mode: 'quiz', reason: 'high success rate, ready for challenge', confidence: 0.8 };
    }
    
    // === TOPIC-BASED DECISIONS ===
    if (topic) {
      // If struggling with this topic
      if (memory.strugglingWith.includes(topic.id)) {
        return { mode: 'encourage', reason: 'struggling with topic, needs support', confidence: 0.9 };
      }
      
      // If good at this topic
      if (memory.goodAt.includes(topic.id)) {
        return { mode: 'practice', reason: 'proficient in topic, can practice', confidence: 0.75 };
      }
      
      // First time with topic
      if (!memory.recentTopics.includes(topic.id)) {
        return { mode: 'explain', reason: 'new topic, needs introduction', confidence: 0.8 };
      }
    }
    
    // === DEFAULT ===
    return { mode: 'explain', reason: 'default mode', confidence: 0.6 };
  }

  /**
   * Generate response based on mode
   */
  generateResponse(
    mode: LearningMode,
    topic: EducationalTopic | null,
    memory: MemoryContext,
    userMessage: string,
    personality: string[]
  ): string {
    const isFunny = personality.includes('funny');
    const isExciting = personality.includes('exciting');
    const isEncouraging = personality.includes('encouraging');
    
    switch (mode) {
      case 'explain':
        return this.explainMode(topic, memory, isFunny, isExciting);
      
      case 'practice':
        return this.practiceMode(topic, isFunny);
      
      case 'quiz':
        return this.quizMode(topic, memory);
      
      case 'explore':
        return this.exploreMode(topic, isExciting);
      
      case 'encourage':
        return this.encourageMode(memory, isEncouraging, isFunny);
      
      default:
        return 'Let\'s learn together! What do you want to know? 😊';
    }
  }

  private explainMode(
    topic: EducationalTopic | null,
    memory: MemoryContext,
    isFunny: boolean,
    isExciting: boolean
  ): string {
    if (!topic) {
      return 'I\'d love to explain! Can you be more specific about what you want to learn? 🤔';
    }
    
    // Choose explanation level based on memory
    let explanation = '';
    const successRate = memory.questionsAsked > 0 
      ? memory.correctAnswers / memory.questionsAsked 
      : 0.5;
    
    if (successRate < 0.5 || !memory.recentTopics.includes(topic.id)) {
      explanation = topic.content.simple;
    } else if (successRate < 0.8) {
      explanation = topic.content.detailed;
    } else {
      explanation = topic.content.advanced;
    }
    
    if (topic.examples.length > 0) {
      const example = topic.examples[Math.floor(Math.random() * topic.examples.length)];
      explanation += `\n\nExample: ${example}`;
    }
    
    if (isFunny) {
      explanation += ' 😄';
    } else if (isExciting) {
      explanation += ' 🔥';
    }
    
    return explanation;
  }

  private practiceMode(topic: EducationalTopic | null, isFunny: boolean): string {
    if (!topic || topic.category !== 'math') {
      return 'Great! Want to practice? Try asking me a question or give me a problem! 💪';
    }
    
    // Generate practice problems for math
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    
    let problem = '';
    if (topic.id === 'addition') {
      problem = `Try this one! What is ${num1} + ${num2}? ➕`;
    } else if (topic.id === 'subtraction') {
      const bigger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      problem = `Try this! What is ${bigger} - ${smaller}? ➖`;
    } else if (topic.id === 'multiplication') {
      problem = `Let's practice! What is ${num1} × ${num2}? ✖️`;
    } else if (topic.id === 'division') {
      const product = num1 * num2;
      problem = `Here's one! What is ${product} ÷ ${num1}? ➗`;
    }
    
    if (isFunny) {
      problem += ' (No pressure, but I believe in you! 😄)';
    }
    
    return problem;
  }

  private quizMode(topic: EducationalTopic | null, memory: MemoryContext): string {
    if (!topic) {
      return 'Quiz time! What topic should I quiz you on? 📝';
    }
    
    return `Okay, quiz time on ${topic.name}! ${memory.goodAt.includes(topic.id) ? 'I know you know this! 😊' : 'You got this! 💪'} Ready?`;
  }

  private exploreMode(topic: EducationalTopic | null, isExciting: boolean): string {
    if (topic && topic.funFacts && topic.funFacts.length > 0) {
      const fact = topic.funFacts[Math.floor(Math.random() * topic.funFacts.length)];
      return `Fun fact about ${topic.name}: ${fact} ${isExciting ? '🤯' : '✨'}`;
    }
    
    return 'Want to explore something interesting? Ask me about any topic! 🌟';
  }

  private encourageMode(
    memory: MemoryContext,
    isEncouraging: boolean,
    isFunny: boolean
  ): string {
    const messages = [];
    
    if (isEncouraging) {
      messages.push(
        `You're doing AMAZING! 💪 Learning is tough, but you're brave for trying!`,
        `Don't give up! Every expert was once a beginner! You've got this! 🌟`,
        `I'm so proud of you for sticking with this! Let's break it down together! ✨`
      );
    } else if (isFunny) {
      messages.push(
        `Hey, even Einstein struggled sometimes! You're doing great! 😄`,
        `Learning is like a video game - the hard levels make you stronger! 🎮`,
        `Rome wasn't built in a day, and neither is knowledge! Keep going! 🏛️`
      );
    } else {
      messages.push(
        `It's okay to find things difficult! That's how we learn! 🤗`,
        `Take your time! There's no rush. Let's work through this together! 💙`,
        `You're making progress, even if it doesn't feel like it! 🌱`
      );
    }
    
    return messages[Math.floor(Math.random() * messages.length)];
  }
}
