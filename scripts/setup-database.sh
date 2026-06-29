#!/bin/bash

# Database Setup Script for Learnverse Phase 2
# This script creates the PostgreSQL schema for tutor analytics

set -e  # Exit on error

echo "🗄️  Learnverse Database Setup"
echo "=============================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable not set"
  echo ""
  echo "To set it:"
  echo "  export DATABASE_URL='postgresql://user:password@host:port/database'"
  echo ""
  echo "Get your connection string from:"
  echo "  https://railway.app/dashboard → PostgreSQL → Connect tab"
  exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
  echo "❌ Error: psql not installed"
  echo ""
  echo "Install PostgreSQL client:"
  echo "  macOS:  brew install postgresql@15"
  echo "  Ubuntu: sudo apt-get install postgresql-client"
  exit 1
fi

echo "✅ psql is installed"
echo ""

echo "Running database schema setup..."
echo ""

# Create tables
psql "$DATABASE_URL" << 'EOF'

-- tutor_logs table: Stores tutor question-answer history
CREATE TABLE IF NOT EXISTS tutor_logs (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  question TEXT NOT NULL,
  answer_preview VARCHAR(500),
  model_used VARCHAR(50) DEFAULT 'llama-2-7b',
  latency_ms INTEGER,
  cached BOOLEAN DEFAULT FALSE,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_student_timestamp UNIQUE(student_id, timestamp)
);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_tutor_logs_student ON tutor_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_tutor_logs_created ON tutor_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_tutor_logs_cached ON tutor_logs(cached);

-- cache_stats table: Aggregate cache performance metrics
CREATE TABLE IF NOT EXISTS cache_stats (
  id SERIAL PRIMARY KEY,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  total_requests INTEGER DEFAULT 0,
  cache_hits INTEGER DEFAULT 0,
  cache_misses INTEGER DEFAULT 0,
  avg_latency_ms FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_cache_stats_period UNIQUE(period_start, period_end)
);

CREATE INDEX IF NOT EXISTS idx_cache_stats_period ON cache_stats(period_start, period_end);

-- lessons table: Store generated lesson content
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  lesson_id VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(50) NOT NULL,
  grade_level INTEGER NOT NULL,
  content_json JSONB,
  generated_by VARCHAR(50) DEFAULT 'mistral-7b',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lessons_subject ON lessons(subject);
CREATE INDEX IF NOT EXISTS idx_lessons_grade ON lessons(grade_level);

-- student_progress table: Track per-student learning progress
CREATE TABLE IF NOT EXISTS student_progress (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL UNIQUE,
  total_questions_asked INTEGER DEFAULT 0,
  total_lessons_completed INTEGER DEFAULT 0,
  avg_response_time_ms FLOAT,
  cache_hit_rate FLOAT,
  last_active TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_progress_id ON student_progress(student_id);

-- daily_metrics table: Aggregate system metrics by day
CREATE TABLE IF NOT EXISTS daily_metrics (
  id SERIAL PRIMARY KEY,
  metric_date DATE UNIQUE NOT NULL,
  total_questions INTEGER DEFAULT 0,
  unique_students INTEGER DEFAULT 0,
  cache_hit_rate FLOAT,
  avg_latency_ms FLOAT,
  api_errors INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_daily_metrics_date ON daily_metrics(metric_date);

EOF

echo ""
echo "✅ Database schema created successfully!"
echo ""
echo "Tables created:"
echo "  - tutor_logs (tutor interaction history)"
echo "  - cache_stats (cache performance metrics)"
echo "  - lessons (generated lesson content)"
echo "  - student_progress (per-student progress)"
echo "  - daily_metrics (daily aggregate metrics)"
echo ""

# Test the connection with a simple query
echo "Testing database connection..."
COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM tutor_logs;")
echo "✅ Connection successful! Current tutor_logs count: $COUNT"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env.local with DATABASE_URL"
echo "  2. Restart npm run dev"
echo "  3. Test API at: http://localhost:3000/api/tutor-log"
echo ""
echo "Query examples:"
echo "  psql \"\$DATABASE_URL\" -c \"SELECT COUNT(*) FROM tutor_logs;\""
echo "  psql \"\$DATABASE_URL\" -c \"SELECT * FROM tutor_logs ORDER BY created_at DESC LIMIT 10;\""
