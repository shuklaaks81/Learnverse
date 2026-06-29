#!/bin/bash
# Quick setup script for Railway PostgreSQL database
# Run: npm run db:migrate

echo "🚀 Learnverse Database Migration"
echo "================================"

# Check if DATABASE_URL exists
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL not found in environment"
  echo "Add DATABASE_URL to your .env.local file"
  echo "Get it from: https://railway.app/dashboard"
  exit 1
fi

echo "✅ DATABASE_URL found"
echo ""

# Run the migration
echo "📊 Creating tables..."

psql $DATABASE_URL << 'EOF'

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

EOF

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migration complete!"
  echo "🎉 Database is ready for 10M students!"
  echo ""
  echo "Next steps:"
  echo "  1. Run: npm run dev"
  echo "  2. Test tutor: POST /api/tutor"
  echo "  3. Monitor: railway logs --follow"
else
  echo ""
  echo "❌ Migration failed"
  echo "Check your DATABASE_URL and try again"
  exit 1
fi
