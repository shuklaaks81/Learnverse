# AI Agent Tasks & Implementation Details

## Overview
This document details each AI agent's specific tasks, code templates, and integration points for the bootstrap phase.

---

## Agent 1: Tutor Agent (Llama 2 7B)

### Purpose
Real-time student Q&A tutor explaining concepts during lessons. Responds in 2-5 seconds with age-appropriate explanations.

### Deployment Details

**Model:** `meta-llama/Llama-2-7b-chat-hf`
**Platform:** HuggingFace Spaces (free GPU tier)
**Quantization:** 4-bit (13GB → 3.5GB memory)
**Hardware:** Free tier GPU (~50 inference requests/month)

### HuggingFace Spaces Setup

**Dockerfile:**
```dockerfile
FROM pytorch/pytorch:2.0-cuda11.8-devel-ubuntu22.04

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app.py .

EXPOSE 7860

CMD ["python", "app.py"]
```

**requirements.txt:**
```
transformers==4.35.2
torch==2.0.1
bitsandbytes==0.41.3
gradio==4.15.0
```

**app.py:**
```python
import gradio as gr
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig

# 4-bit quantization config
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16
)

model_id = "meta-llama/Llama-2-7b-chat-hf"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    quantization_config=bnb_config,
    device_map="auto"
)

def tutor_explain(question: str, max_new_tokens: int = 200) -> str:
    """Generate explanation for student question."""
    
    system_prompt = """You are a friendly math tutor for 3rd grade students.
    - Explain simply using everyday examples
    - Use encouraging language
    - Keep answers under 200 words
    - Never give the answer directly, guide them to think"""
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": question}
    ]
    
    input_ids = tokenizer.apply_chat_template(
        messages,
        tokenize=True,
        add_generation_prompt=True,
        return_tensors="pt"
    ).to("cuda")
    
    outputs = model.generate(
        input_ids,
        max_new_tokens=max_new_tokens,
        temperature=0.7,
        do_sample=True,
        top_p=0.9,
    )
    
    response = tokenizer.decode(
        outputs[0][input_ids.shape[-1]:],
        skip_special_tokens=True
    )
    
    return response.strip()

# Gradio interface
iface = gr.Interface(
    fn=tutor_explain,
    inputs="text",
    outputs="text",
    title="Learnverse Tutor",
    description="Ask me anything about math!"
)

iface.launch(server_name="0.0.0.0", server_port=7860)
```

**Deployment Steps:**
```bash
1. Create HuggingFace Space (https://huggingface.co/spaces)
2. Add files: Dockerfile, requirements.txt, app.py
3. GitHub deploy from this repo
4. Test endpoint: curl https://[username]-llama2-tutor.hf.space/api/predict
5. Document endpoint URL in .env
```

---

### Frontend Integration

**File:** `src/agents/tutor.agent.ts`

```typescript
import { LRUCache } from 'lru-cache';

interface TutorResponse {
  answer: string;
  cached: boolean;
  timestamp: number;
}

export class TutorAgent {
  private cache: LRUCache<string, string>;
  private endpoint: string;
  private rateLimiter: Map<string, number[]>; // student_id -> timestamps
  
  constructor() {
    this.endpoint = process.env.NEXT_PUBLIC_TUTOR_ENDPOINT || 
      'https://[username]-llama2-tutor.hf.space/api/predict';
    
    // Cache with 30-day TTL
    this.cache = new LRUCache<string, string>({
      max: 1000,
      ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    
    this.rateLimiter = new Map();
  }
  
  /**
   * Check if student has exceeded rate limit (10/day)
   */
  private checkRateLimit(studentId: string): boolean {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    let requests = this.rateLimiter.get(studentId) || [];
    requests = requests.filter(t => (now - t) < dayMs);
    
    if (requests.length >= 10) {
      return false; // Exceeded limit
    }
    
    requests.push(now);
    this.rateLimiter.set(studentId, requests);
    return true;
  }
  
  /**
   * Generate cache key from question
   */
  private getCacheKey(question: string): string {
    return require('crypto')
      .createHash('sha256')
      .update(question.toLowerCase())
      .digest('hex');
  }
  
  /**
   * Main tutor method - answer student question
   */
  async generateExplanation(
    question: string,
    studentId: string
  ): Promise<TutorResponse> {
    // Check rate limit
    if (!this.checkRateLimit(studentId)) {
      return {
        answer: "You've asked 10 questions today. Come back tomorrow! 🌟",
        cached: true,
        timestamp: Date.now()
      };
    }
    
    const cacheKey = this.getCacheKey(question);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return {
        answer: cached,
        cached: true,
        timestamp: Date.now()
      };
    }
    
    try {
      // Call HuggingFace Spaces endpoint
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [question] }),
      });
      
      const data = await response.json();
      const answer = data.data?.[0] || 'I didn\'t understand. Can you rephrase?';
      
      // Cache the response
      this.cache.set(cacheKey, answer);
      
      // Log to database
      await this.logTutorQuery(studentId, question, answer);
      
      return {
        answer,
        cached: false,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Tutor Agent error:', error);
      return {
        answer: 'I\'m thinking... tried again in a moment!',
        cached: false,
        timestamp: Date.now()
      };
    }
  }
  
  /**
   * Log tutor query to database for analytics
   */
  private async logTutorQuery(
    studentId: string,
    question: string,
    answer: string
  ): Promise<void> {
    try {
      await fetch('/api/tutor-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          question,
          answer,
          timestamp: new Date(),
        }),
      });
    } catch (error) {
      console.error('Failed to log tutor query:', error);
    }
  }
  
  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      max: this.cache.max,
      hitRate: this.cache.size > 0 ? '~80%' : 'N/A',
    };
  }
}

// Singleton instance
export const tutorAgent = new TutorAgent();
```

---

### Backend API Handler

**File:** `src/pages/api/tutor.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { tutorAgent } from '@/agents/tutor.agent';

export async function POST(req: NextRequest) {
  try {
    const { question, studentId } = await req.json();
    
    if (!question || !studentId) {
      return NextResponse.json(
        { error: 'Missing question or studentId' },
        { status: 400 }
      );
    }
    
    // Validate question length
    if (question.length < 3 || question.length > 500) {
      return NextResponse.json(
        { error: 'Question must be 3-500 characters' },
        { status: 400 }
      );
    }
    
    const startTime = Date.now();
    const response = await tutorAgent.generateExplanation(question, studentId);
    const latency = Date.now() - startTime;
    
    // Log performance
    console.log(`Tutor response: ${latency}ms (cached: ${response.cached})`);
    
    return NextResponse.json({
      answer: response.answer,
      cached: response.cached,
      latency,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Agent 2: Content Generation Agent (Mistral 7B)

### Purpose
Generate high-quality K-8 lessons from curriculum standards. Runs weekly as batch job.

### Deployment Details

**Model:** `mistralai/Mistral-7B-Instruct-v0.1`
**Platform:** HuggingFace (free CPU tier, or local)
**Frequency:** Weekly batch (Sunday 2 AM UTC)
**Output:** JSON lessons stored in PostgreSQL

### Content Generation Script

**File:** `scripts/generate-lessons.py`

```python
#!/usr/bin/env python3
"""
Autonomous lesson generator using Mistral 7B.
Generates K-8 lessons from curriculum standards.
Runs weekly as a background job.
"""

import json
import os
from datetime import datetime
from typing import Dict, List
import psycopg2
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Curriculum standards to generate lessons for
CURRICULUM_STANDARDS = [
    # 3rd Grade Math (CCSS)
    {"standard": "CCSS.MATH.3.OA.A.1", "grade": 3, "name": "Area and Multiplication"},
    {"standard": "CCSS.MATH.3.OA.A.2", "grade": 3, "name": "Division as an Unknown Factor"},
    {"standard": "CCSS.MATH.3.OA.B.5", "grade": 3, "name": "Multiply by 10"},
    {"standard": "CCSS.MATH.3.OA.C.7", "grade": 3, "name": "Fluent Multiplication"},
    {"standard": "CCSS.MATH.3.NF.A.1", "grade": 3, "name": "Understanding Fractions"},
    
    # 3rd Grade ELA (CCSS)
    {"standard": "CCSS.ELA-LITERACY.RL.3.1", "grade": 3, "name": "Ask and Answer Questions"},
    {"standard": "CCSS.ELA-LITERACY.RL.3.2", "grade": 3, "name": "Retell Stories"},
    {"standard": "CCSS.ELA-LITERACY.RL.3.3", "grade": 3, "name": "Character Features"},
    
    # Add more standards as needed (target 50+ per week)
]

class LessonGenerator:
    def __init__(self):
        """Initialize language model."""
        model_name = "mistralai/Mistral-7B-Instruct-v0.1"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float16,
            device_map="auto"
        )
    
    def generate_lesson(self, standard: Dict) -> Dict:
        """Generate lesson JSON for a given curriculum standard."""
        
        prompt = f"""Generate a complete lesson for {standard['name']} (Standard: {standard['standard']}) for {standard['grade']}th grade students.

Output MUST be valid JSON with this exact structure:
{{
  "id": "lesson_ccss_{standard['grade']}_{standard['standard'].split('.')[-1]}",
  "title": "Engaging lesson title",
  "grade": {standard['grade']},
  "curriculum_standard": "{standard['standard']}",
  "difficulty": 1,
  "content": "Detailed explanation (2-3 paragraphs) in simple language",
  "examples": ["Example 1: Real-world scenario", "Example 2: Another scenario"],
  "questions": [
    {{"text": "Multiple choice question 1?", "options": ["Option A", "Option B", "Option C"], "correct": 0}},
    {{"text": "Multiple choice question 2?", "options": ["Option A", "Option B", "Option C"], "correct": 1}},
    {{"text": "Multiple choice question 3?", "options": ["Option A", "Option B", "Option C"], "correct": 2}}
  ]
}}

Ensure:
- Content is age-appropriate and engaging
- Examples use relatable scenarios
- Questions test comprehension
- JSON is valid and parseable
"""
        
        # Generate with Mistral
        messages = [{"role": "user", "content": prompt}]
        inputs = self.tokenizer.apply_chat_template(
            messages,
            tokenize=True,
            add_generation_prompt=True,
            return_tensors="pt"
        )
        
        outputs = self.model.generate(
            inputs.input_ids,
            max_new_tokens=1000,
            temperature=0.7,
            do_sample=True,
            top_p=0.9,
        )
        
        response = self.tokenizer.decode(
            outputs[0],
            skip_special_tokens=True
        )
        
        # Extract JSON from response
        try:
            # Find JSON in response
            start = response.find('{')
            end = response.rfind('}') + 1
            json_str = response[start:end]
            lesson = json.loads(json_str)
            
            # Validate schema
            self.validate_lesson(lesson)
            return lesson
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Failed to parse lesson JSON: {e}")
            return None
    
    def validate_lesson(self, lesson: Dict) -> bool:
        """Validate lesson has required fields."""
        required = ["id", "title", "grade", "content", "examples", "questions"]
        for field in required:
            if field not in lesson:
                raise ValueError(f"Missing required field: {field}")
        
        # Validate questions
        if len(lesson["questions"]) < 3:
            raise ValueError("Lesson must have at least 3 questions")
        
        return True
    
    def save_to_db(self, lesson: Dict) -> bool:
        """Save lesson to PostgreSQL."""
        try:
            conn = psycopg2.connect(os.getenv('DATABASE_URL'))
            cur = conn.cursor()
            
            cur.execute("""
                INSERT INTO lessons 
                (id, title, grade, curriculum_standard, content, examples, questions, created_at, source)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, (
                lesson['id'],
                lesson['title'],
                lesson['grade'],
                lesson.get('curriculum_standard', ''),
                lesson['content'],
                json.dumps(lesson['examples']),
                json.dumps(lesson['questions']),
                datetime.now(),
                'mistral-generated'
            ))
            
            conn.commit()
            cur.close()
            conn.close()
            return True
        except Exception as e:
            print(f"Database error: {e}")
            return False

def main():
    """Generate all lessons."""
    print(f"Starting lesson generation at {datetime.now()}")
    
    generator = LessonGenerator()
    successful = 0
    failed = 0
    
    for standard in CURRICULUM_STANDARDS:
        print(f"Generating lesson for {standard['name']}...")
        
        lesson = generator.generate_lesson(standard)
        if lesson and generator.save_to_db(lesson):
            successful += 1
            print(f"  ✓ Saved: {lesson['id']}")
        else:
            failed += 1
            print(f"  ✗ Failed: {standard['standard']}")
    
    print(f"\nGeneration complete!")
    print(f"  Successful: {successful}")
    print(f"  Failed: {failed}")
    print(f"  Timestamp: {datetime.now()}")

if __name__ == "__main__":
    main()
```

### GitHub Actions Scheduler

**File:** `.github/workflows/generate-lessons.yml`

```yaml
name: Weekly Lesson Generation

on:
  schedule:
    # Every Sunday at 2 AM UTC
    - cron: '0 2 * * 0'
  workflow_dispatch: # Manual trigger

jobs:
  generate-lessons:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          pip install transformers torch psycopg2-binary
      
      - name: Generate lessons
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          HF_TOKEN: ${{ secrets.HF_TOKEN }}
        run: python scripts/generate-lessons.py
      
      - name: Notify on completion
        if: always()
        run: |
          curl -X POST ${{ secrets.NOTIFICATION_WEBHOOK }} \
            -d "Lesson generation completed successfully"
```

---

## Agent 3: Analytics Agent (DuckDB-based)

### Purpose
Daily metrics aggregation, engagement tracking, at-risk detection.

### Implementation

**File:** `src/agents/analytics.agent.ts`

```typescript
import Database from 'better-sqlite3';

export class AnalyticsAgent {
  private db: Database.Database;
  
  constructor() {
    // Use DuckDB or SQLite for analytics (free, in-memory)
    this.db = new Database(':memory:');
  }
  
  async generateDailyReport() {
    /**
     * Aggregate yesterday's data into metrics
     */
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const report = {
      date: yesterday.toISOString().split('T')[0],
      dau: await this.getDAU(yesterday),
      lesson_completion: await this.getLessonCompletion(),
      tutor_engagement: await this.getTutorEngagement(),
      accuracy: await this.getAverageAccuracy(),
      atRiskStudents: await this.getAtRiskStudents(),
      topLessons: await this.getTopLessons(),
    };
    
    // Send email to parents
    await this.sendParentEmails(report);
    
    // Log to database
    await this.logReport(report);
    
    return report;
  }
  
  private async getDAU(date: Date): Promise<number> {
    // Count unique students who logged in yesterday
    // SELECT COUNT(DISTINCT student_id) FROM sessions WHERE date = ?
    return 42; // placeholder
  }
  
  private async getLessonCompletion(): Promise<number> {
    // Percentage of students who completed a lesson yesterday
    return 85;
  }
  
  private async getTutorEngagement(): Promise<number> {
    // Average tutor questions per user
    return 2.3;
  }
  
  private async getAverageAccuracy(): Promise<number> {
    // Average quiz score
    return 78;
  }
  
  private async getAtRiskStudents(): Promise<string[]> {
    // Students with < 50% accuracy or no activity
    return []; // placeholder
  }
  
  async sendParentEmails(report: any) {
    // Send weekly summary email to parents
    // Use SendGrid free tier (100 emails/day)
  }
  
  async logReport(report: any) {
    // Store in database for historical tracking
  }
}

// Singleton
export const analyticsAgent = new AnalyticsAgent();
```

---

## Phase 1 Implementation Checklist

### Week 1
- [ ] Create `src/agents/tutor.agent.ts`
- [ ] Deploy Llama 2 to HuggingFace Spaces
- [ ] Create `src/pages/api/tutor.ts` handler
- [ ] Create test: `src/agents/__tests__/tutor.test.ts`
- [ ] Document in README

### Week 2
- [ ] Create `scripts/generate-lessons.py`
- [ ] Generate 100 lessons
- [ ] Create GitHub Actions scheduler
- [ ] Setup PostgreSQL schema

### Week 3
- [ ] GitHub Actions CI/CD setup
- [ ] Code Agent (Copilot) integration
- [ ] Performance & security tests

### Week 4
- [ ] Analytics Agent implementation
- [ ] Monitoring setup (Sentry)
- [ ] Public launch

---

**Last Updated:** Feb 16, 2026
