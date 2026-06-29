/**
 * Database Schema for Learnverse Bootstrap Phase
 * PostgreSQL schema for Railway deployment
 * Bootstrap budget: $1/month (Railway free tier)
 */

export interface Student {
  id: string; // UUID
  kid_id: string; // From localStorage kidId
  name: string;
  avatar: string;
  grade_level: number; // 1-8
  coins: number;
  streak: number;
  created_at: Date;
  last_active: Date;
}

export interface Lesson {
  id: string; // UUID
  lesson_id: string; // e.g., "101", "102"
  title: string;
  subject: 'math' | 'science' | 'english' | 'history' | 'art';
  grade_level: number; // 1-8
  content: Record<string, any>; // JSONB - full lesson structure
  ai_generated: boolean; // true if from Content Gen Agent
  quality_score: number; // 0-100 (human review score)
  created_at: Date;
  updated_at: Date;
}

export interface LessonProgress {
  id: string; // UUID
  student_id: string; // Foreign key to Student.id
  lesson_id: string; // Foreign key to Lesson.id
  completed: boolean;
  score: number; // 0-100
  time_spent: number; // seconds
  attempts: number;
  completed_at?: Date;
  created_at: Date;
}

export interface TutorInteraction {
  id: string; // UUID
  student_id: string; // Foreign key to Student.id
  question: string;
  answer: string;
  cached: boolean; // Was response from cache?
  latency: number; // milliseconds
  helpful: boolean | null; // Student feedback (thumbs up/down)
  created_at: Date;
}

export interface AgentLog {
  id: string; // UUID
  agent_type: 'tutor' | 'content_gen' | 'code_agent';
  action: string; // e.g., "generate_lesson", "answer_question"
  success: boolean;
  error_message?: string;
  metadata: Record<string, any>; // JSONB - additional context
  cost_usd: number; // Track API costs
  created_at: Date;
}

// SQL Migration Script (copy to Railway dashboard)
export const SCHEMA_SQL = `
-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kid_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  grade_level INTEGER CHECK (grade_level >= 1 AND grade_level <= 8),
  coins INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  subject VARCHAR(50) NOT NULL,
  grade_level INTEGER CHECK (grade_level >= 1 AND grade_level <= 8),
  content JSONB NOT NULL,
  ai_generated BOOLEAN DEFAULT false,
  quality_score INTEGER DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Lesson progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  time_spent INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 1,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, lesson_id)
);

-- Tutor interactions table
CREATE TABLE IF NOT EXISTS tutor_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  cached BOOLEAN DEFAULT false,
  latency INTEGER DEFAULT 0,
  helpful BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agent logs table
CREATE TABLE IF NOT EXISTS agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type VARCHAR(50) NOT NULL,
  action VARCHAR(255) NOT NULL,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  metadata JSONB,
  cost_usd DECIMAL(10, 6) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_kid_id ON students(kid_id);
CREATE INDEX IF NOT EXISTS idx_lessons_lesson_id ON lessons(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lessons_subject_grade ON lessons(subject, grade_level);
CREATE INDEX IF NOT EXISTS idx_progress_student ON lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON lesson_progress(completed);
CREATE INDEX IF NOT EXISTS idx_tutor_student ON tutor_interactions(student_id);
CREATE INDEX IF NOT EXISTS idx_tutor_created ON tutor_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_logs_type ON agent_logs(agent_type);
CREATE INDEX IF NOT EXISTS idx_agent_logs_created ON agent_logs(created_at);
`;

// Query helpers
export const QUERIES = {
  // Get student by kidId
  getStudent: `SELECT * FROM students WHERE kid_id = $1`,
  
  // Create new student
  createStudent: `
    INSERT INTO students (kid_id, name, avatar, grade_level, coins, streak)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
  
  // Get lessons by subject and grade
  getLessons: `
    SELECT * FROM lessons 
    WHERE subject = $1 AND grade_level = $2
    ORDER BY created_at DESC`,
  
  // Track lesson progress
  upsertProgress: `
    INSERT INTO lesson_progress (student_id, lesson_id, completed, score, time_spent, attempts, completed_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (student_id, lesson_id)
    DO UPDATE SET
      completed = $3,
      score = GREATEST(lesson_progress.score, $4),
      time_spent = lesson_progress.time_spent + $5,
      attempts = lesson_progress.attempts + 1,
      completed_at = CASE WHEN $3 THEN $7 ELSE lesson_progress.completed_at END
    RETURNING *`,
  
  // Log tutor interaction
  logTutorInteraction: `
    INSERT INTO tutor_interactions (student_id, question, answer, cached, latency)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
  
  // Log agent action
  logAgentAction: `
    INSERT INTO agent_logs (agent_type, action, success, error_message, metadata, cost_usd)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
};
