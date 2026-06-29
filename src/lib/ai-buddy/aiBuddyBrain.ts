/**
 * AI BUDDY BRAIN - MASTER INTELLIGENCE SYSTEM
 * Combines memory, learning modes, and knowledge to create smart responses
 */

import { ConversationMemory, MemoryContext } from './conversationMemory';
import { EducationalLibrary, EducationalTopic } from './educationalLibrary';
import { LearningModesEngine, LearningMode } from './learningModes';

export interface AIBuddyConfig {
  buddyId: string;
  name: string;
  subjects: string[];
  personality: string[];
}

export interface ResponseMetadata {
  topic?: string;
  mode: LearningMode;
  confidence: number;
  wasCorrect?: boolean;
}

export class AIBuddyBrain {
  private memory: ConversationMemory;
  private library: EducationalLibrary;
  private modesEngine: LearningModesEngine;
  private config: AIBuddyConfig;

  constructor(config: AIBuddyConfig) {
    this.config = config;
    this.memory = new ConversationMemory(config.buddyId);
    this.library = new EducationalLibrary();
    this.modesEngine = new LearningModesEngine();
  }

  /**
   * MAIN INTELLIGENCE FUNCTION
   * Processes user message and generates smart response
   */
  async generateResponse(userMessage: string): Promise<{ response: string; metadata: ResponseMetadata }> {
    const msg = userMessage.toLowerCase();
    
    // === 1. CHECK FOR ADVANCED MATH (too complex) ===
    if (this.isAdvancedMath(userMessage)) {
      return {
        response: this.handleAdvancedMath(),
        metadata: { mode: 'explain', confidence: 1.0 }
      };
    }
    
    // === 2. CHECK FOR GREETINGS ===
    if (this.isGreeting(msg)) {
      return {
        response: this.handleGreeting(),
        metadata: { mode: 'explore', confidence: 1.0 }
      };
    }
    
    // === 3. CHECK FOR SIMPLE MATH ===
    const mathResult = this.tryMath(userMessage);
    if (mathResult) {
      this.memory.addTurn(userMessage, mathResult.response, mathResult.topic, true);
      return {
        response: mathResult.response,
        metadata: { topic: mathResult.topic, mode: 'explain', confidence: 1.0, wasCorrect: true }
      };
    }
    
    // === 4. FIND MATCHING EDUCATIONAL TOPICS ===
    const matchingTopics = this.library.findMatchingTopics(msg);
    const bestTopic = matchingTopics.length > 0 ? matchingTopics[0] : null;
    
    // === 5. GET MEMORY CONTEXT ===
    const context = this.memory.getContext();
    
    // === 6. DETECT USER MOOD ===
    this.updateMood(msg, context);
    
    // === 7. DECIDE BEST LEARNING MODE ===
    const modeDecision = this.modesEngine.decideBestMode(bestTopic, context, userMessage);
    
    // === 8. GENERATE RESPONSE BASED ON MODE ===
    let response = this.modesEngine.generateResponse(
      modeDecision.mode,
      bestTopic,
      context,
      userMessage,
      this.config.personality
    );
    
    // === 9. ADD CONTEXTUAL TOUCHES ===
    response = this.addContextualTouches(response, context, bestTopic);
    
    // === 10. SAVE TO MEMORY ===
    const topicId = bestTopic ? bestTopic.id : undefined;
    this.memory.addTurn(userMessage, response, topicId);
    
    return {
      response,
      metadata: {
        topic: topicId,
        mode: modeDecision.mode,
        confidence: modeDecision.confidence
      }
    };
  }

  private isAdvancedMath(message: string): boolean {
    const hasVariables = /[a-z]\s*[\^²³⁴⁵⁶⁷⁸⁹⁰ⁿ]|[xyz]\s*[n><=]|fermat|theorem|calculus|derivative|integral/i.test(message);
    const hasComplexSymbols = /[∑∏∫∂√π≠≤≥∞]/i.test(message);
    const isFormula = /[xyz]\s*[n]\s*[+=]|for\s+n\s*>/i.test(message);
    return hasVariables || hasComplexSymbols || isFormula;
  }

  private handleAdvancedMath(): string {
    const isFunny = this.config.personality.includes('funny');
    const isExciting = this.config.personality.includes('exciting');
    
    if (isFunny) {
      return `WHOA WHOA WHOA! 🤯 That's like SUPER advanced college-level math! My brain is melting! 🧠💥 I'm great with regular math like 2+2, but that's way beyond my powers! Maybe ask your teacher or Google that one! 😅`;
    } else if (isExciting) {
      return `WOW! That looks like ADVANCED math! 🔥 Like college or even UNIVERSITY level! 🎓 That's too complex for me, but I'm impressed you're thinking about it! Ask a math teacher - they'll love this! ⚡`;
    }
    return `Whoa! That looks like really advanced mathematics! 🤓 That's beyond what I can help with - it's college-level or higher! Try asking a teacher or looking it up online. But I CAN help with things like addition, subtraction, times tables, and other school math! 📚`;
  }

  private isGreeting(msg: string): boolean {
    return /^(hi|hello|hey|sup|hiya|greetings|yo)(\s|!|$)/i.test(msg);
  }

  private handleGreeting(): string {
    const context = this.memory.getContext();
    const timeSinceLastInteraction = Date.now() - context.lastInteractionTime;
    const isFirstTime = context.questionsAsked === 0;
    
    if (isFirstTime) {
      return `Hi! I'm ${this.config.name}! 😊 ${this.getPersonalityIntro()} What do you want to learn today?`;
    } else if (timeSinceLastInteraction > 1000 * 60 * 60) { // > 1 hour
      return `Hey! Welcome back! 🌟 Last time we talked about ${context.recentTopics[context.recentTopics.length - 1] || 'cool stuff'}! Want to continue or learn something new?`;
    } else {
      return `Hi again! Ready to keep learning? ${context.mood === 'excited' ? 'You\'re doing amazing! 🎉' : '😊'}`;
    }
  }

  private getPersonalityIntro(): string {
    if (this.config.personality.includes('funny')) return 'Let\'s have fun while we learn! 😄';
    if (this.config.personality.includes('exciting')) return 'Get ready for AWESOME learning! ⚡';
    if (this.config.personality.includes('encouraging')) return 'I believe in you! 💪';
    if (this.config.personality.includes('patient')) return 'We\'ll take it slow and steady! 🤗';
    if (this.config.personality.includes('creative')) return 'Let\'s explore together! ✨';
    return 'I\'m here to help! 🌟';
  }

  private tryMath(message: string): { response: string; topic: string } | null {
    const msg = message.toLowerCase();
    
    // Extract numbers
    const numbers = message.match(/\d+/g);
    if (!numbers || numbers.length < 2) return null;
    
    const num1 = parseInt(numbers[0]);
    const num2 = parseInt(numbers[1]);
    
    // Addition
    if (msg.includes('+') || msg.includes('plus') || msg.includes('add')) {
      const sum = num1 + num2;
      return {
        response: this.formatMathResponse(num1, num2, sum, '+', 'addition'),
        topic: 'addition'
      };
    }
    
    // Subtraction
    if (msg.includes('-') || msg.includes('minus') || msg.includes('subtract')) {
      const diff = num1 - num2;
      return {
        response: this.formatMathResponse(num1, num2, diff, '-', 'subtraction'),
        topic: 'subtraction'
      };
    }
    
    // Multiplication
    if (msg.includes('×') || msg.includes('*') || msg.includes('times') || msg.includes('multiply')) {
      const product = num1 * num2;
      return {
        response: this.formatMathResponse(num1, num2, product, '×', 'multiplication'),
        topic: 'multiplication'
      };
    }
    
    // Division
    if (msg.includes('÷') || msg.includes('/') || msg.includes('divide')) {
      if (num2 === 0) {
        return {
          response: 'Oops! Can\'t divide by zero! That\'s undefined in math! Try a different number! 🚫',
          topic: 'division'
        };
      }
      const quotient = Math.floor(num1 / num2);
      const remainder = num1 % num2;
      const response = remainder === 0
        ? this.formatMathResponse(num1, num2, quotient, '÷', 'division')
        : `${num1} ÷ ${num2} = ${quotient} with a remainder of ${remainder}! 📊`;
      return { response, topic: 'division' };
    }
    
    return null;
  }

  private formatMathResponse(num1: number, num2: number, result: number, operator: string, operation: string): string {
    const isFunny = this.config.personality.includes('funny');
    const isExciting = this.config.personality.includes('exciting');
    const context = this.memory.getContext();
    
    let response = `${num1} ${operator} ${num2} = ${result}!`;
    
    // Add personality
    if (isFunny) {
      const phrases = ['Easy peasy! 🍋', 'Nailed it! 🎯', 'Boom! You got it! 💥'];
      response += ' ' + phrases[Math.floor(Math.random() * phrases.length)];
    } else if (isExciting) {
      response += ' AWESOME! 🔥';
    } else {
      response += ' Great job! ✨';
    }
    
    // Add encouragement if struggling
    if (context.mood === 'confused' || context.mood === 'frustrated') {
      response += ' See? You\'re getting it! Keep going! 💪';
    }
    
    // Offer more practice if doing well
    if (context.successRate > 0.8 && context.questionsAsked >= 3) {
      response += ' Want to try a harder one?';
    }
    
    return response;
  }

  private updateMood(msg: string, context: MemoryContext) {
    if (msg.includes('hard') || msg.includes('difficult') || msg.includes('confused') || msg.includes('don\'t understand')) {
      this.memory.updateMood('confused');
    } else if (msg.includes('frustrated') || msg.includes('give up') || msg.includes('can\'t do')) {
      this.memory.updateMood('frustrated');
    } else if (msg.includes('excited') || msg.includes('cool') || msg.includes('awesome') || msg.includes('love')) {
      this.memory.updateMood('excited');
    } else if (context.successRate > 0.7 && context.questionsAsked >= 3) {
      this.memory.updateMood('confident');
    } else {
      this.memory.updateMood('curious');
    }
  }

  private addContextualTouches(response: string, context: MemoryContext, topic: EducationalTopic | null): string {
    // Add milestone celebrations
    if (context.questionsAsked === 10) {
      response += '\n\n🎉 Wow! You\'ve asked 10 questions! You\'re so curious!';
    } else if (context.questionsAsked === 25) {
      response += '\n\n🌟 25 questions! You\'re a learning superstar!';
    }
    
    // Celebrate success streaks
    if (context.correctAnswers >= 5 && context.successRate >= 0.8) {
      response += '\n\n🔥 You\'re on fire! Keep it up!';
    }
    
    // Suggest related topics
    if (topic && topic.relatedTopics.length > 0 && Math.random() > 0.7) {
      const related = topic.relatedTopics[0];
      response += `\n\n💡 Want to learn about ${related} next?`;
    }
    
    return response;
  }

  // === PUBLIC UTILITY METHODS ===

  getMemoryContext(): MemoryContext {
    return this.memory.getContext();
  }

  clearMemory() {
    this.memory.clear();
  }

  getRandomFunFact(): string {
    return this.library.getRandomFunFact();
  }
}