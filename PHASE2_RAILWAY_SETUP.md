# Phase 2: Railway PostgreSQL Setup Guide

## Overview

Railway provides free PostgreSQL tier ($5/month credit) perfect for Phase 1. This guide sets up your database infrastructure for persistent data storage.

---

## Step 1: Create Railway Account & Project

### 1a. Sign Up
1. Visit: https://railway.app
2. Click **"Start Free"**
3. Sign in with GitHub (recommended)
4. Deploy a **New Project**

### 1b. Create PostgreSQL Database
1. Click **"+ New"** → **"Database"** → **PostgreSQL**
2. Click **"Create"**
3. Railway creates your database (takes 1-2 minutes)

### 1c. Get Connection String
1. Click on your PostgreSQL service
2. Go to **"Connect"** tab
3. Copy: **PostgreSQL connection string**
   - Format: `postgresql://user:password@host:port/database`
   - Save this for `.env.local`

---

## Step 2: Create Database Schema

### 2a. Connect to Your Database

**Option 1: Using psql** (if installed)
```bash
psql postgresql://user:password@host:port/database
```

**Option 2: Using Railway Web Console**
1. Click on PostgreSQL service
2. Go to **"Data"** tab
3. Click **"Query"** editor

### 2b. Run Schema Creation

Copy and paste this SQL script:

```sql
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
CREATE INDEX idx_tutor_logs_student ON tutor_logs(student_id);
CREATE INDEX idx_tutor_logs_created ON tutor_logs(created_at);
CREATE INDEX idx_tutor_logs_cached ON tutor_logs(cached);

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

CREATE INDEX idx_cache_stats_period ON cache_stats(period_start, period_end);

-- lessons table: Store generated lesson content
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  lesson_id VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(50) NOT NULL,  -- 'math', 'science', 'ela'
  grade_level INTEGER NOT NULL,  -- 3-5
  content_json JSONB,
  generated_by VARCHAR(50) DEFAULT 'mistral-7b',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lessons_subject ON lessons(subject);
CREATE INDEX idx_lessons_grade ON lessons(grade_level);

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

CREATE INDEX idx_student_progress_id ON student_progress(student_id);

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

CREATE INDEX idx_daily_metrics_date ON daily_metrics(metric_date);
```

---

## Step 3: Update Learnverse Environment

### 3a. Add Railway Connection String to `.env.local`

```bash
# .env.local
DATABASE_URL=postgresql://user:password@host:port/database
```

### 3b. Get from Railway
1. Click PostgreSQL service
2. **Connect** tab
3. Copy the full connection string
4. Paste into `.env.local`

---

## Step 4: Update Tutor API to Log to Database

### 4a. Modify `/src/pages/api/tutor-log.ts`

Instead of just console logging, connect to PostgreSQL:

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { studentId, question, answer, cached, latency } = req.body;
    
    // Log to PostgreSQL
    const result = await pool.query(
      `INSERT INTO tutor_logs (student_id, question, answer_preview, cached, latency_ms, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [studentId, question, answer.substring(0, 500), cached, latency, Date.now()]
    );
    
    res.status(200).json({ 
      success: true, 
      logId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Logging error:', error);
    res.status(500).json({ error: 'Failed to log' });
  }
}
```

### 4b. Install PostgreSQL Client

```bash
npm install pg
```

---

## Step 5: Test Database Connection

### 5a. Create Test Script

```bash
# test-db.sh
#!/bin/bash
DATABASE_URL="$1"
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM tutor_logs;"
echo "✅ Database connection successful!"
```

### 5b. Run Test

```bash
chmod +x test-db.sh
./test-db.sh "postgresql://user:password@host:port/database"
```

---

## Step 6: Monitor Database Usage

### Railway Dashboard
1. Visit https://railway.app/dashboard
2. Click on PostgreSQL service
3. View:
   - Metrics (CPU, Memory, Connections)
   - Logs
   - Data browser
   - Query editor

### Cost Monitoring
- **Free tier:** $5/month credit
- **Overages:** $0.29 per PostgreSQL connection-hour
- **Limit:** Set to avoid surprises

---

## Phase 2 Database Roadmap

| Week | Task | Files |
|------|------|-------|
| W2 | Setup PostgreSQL schema | This guide |
| W2 | Connect tutor-log endpoint | /src/pages/api/tutor-log.ts |
| W2 | Setup monitoring dashboard | /lab/monitoring |
| W2 | Generate initial lessons | Mistral 7B agent |
| W3 | Analytics dashboard | /lab/analytics |
| W3 | Performance tracking | PostgreSQL queries |
| W4 | Beta launch metrics | NPS, retention, DAU |

---

## Quick Commands

### Get Connection String
```bash
# From Railway CLI
railway link
railway run env | grep DATABASE_URL
```

### Connect Locally
```bash
psql "$DATABASE_URL"
```

### Check Tables
```sql
\dt  -- list all tables
SELECT COUNT(*) FROM tutor_logs;
```

### View Logs
```sql
SELECT student_id, question, cached, latency_ms 
FROM tutor_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## Common Issues

### "Connection refused"
- **Cause:** Railway PostgreSQL not ready
- **Solution:** Wait 2-3 minutes, try again

### "Password authentication failed"
- **Cause:** Wrong connection string
- **Solution:** Copy from Railway dashboard again

### "too many connections"
- **Cause:** Connection pool exhausted
- **Solution:** Increase `max_connections` or use connection pooler

### "Disk quota exceeded"
- **Cause:** Database too large
- **Solution:** Archive old tutor_logs, keep only 90 days

---

## Next Steps After Setup

1. ✅ **Test INSERT:** Run test query from Step 5
2. ✅ **Deploy to Vercel:** Push code with DATABASE_URL secret
3. ✅ **Monitor logs:** Check "/api/tutor-log" endpoint responses
4. ⏳ **Setup Mistral Agent:** For lesson generation (Week 2)
5. ⏳ **Create analytics views:** Query templates (Week 3)

---

## References

- **Railway Docs:** https://docs.railway.app
- **PostgreSQL Docs:** https://www.postgresql.org/docs
- **Node.js pg client:** https://node-postgres.com
- **Connection pooling:** https://node-postgres.com/features/pooling

**Total Setup Time:** 10-15 minutes
**Cost:** Free ($5/month credit included)
**Status:** Ready for Phase 2 execution
