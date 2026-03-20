# Database Setup Scripts

## Quick Start

### 1. Get Your Database URL
```bash
# Sign up for Railway (free tier)
railway login
railway init
railway add postgres
railway variables
```

Copy your `DATABASE_URL` and add to `.env.local`:
```
DATABASE_URL=postgresql://...
```

### 2. Run Migration
```bash
npm run db:migrate
```

This creates:
- ✅ 5 tables (students, lessons, progress, tutor_interactions, agent_logs)
- ✅ 9 performance indexes
- ✅ Foreign key constraints
- ✅ Data validation checks

### 3. Verify Setup
```bash
# Check tables exist
psql $DATABASE_URL -c "\dt"

# Check student count (should be 0)
psql $DATABASE_URL -c "SELECT COUNT(*) FROM students"
```

## What Gets Created

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `students` | Kid accounts from localStorage | kid_id, coins, streak |
| `lessons` | AI-generated + manual lessons | lesson_id, content (JSONB) |
| `lesson_progress` | Track completions & scores | student_id, lesson_id, score |
| `tutor_interactions` | All Q&A with tutor agent | question, answer, cached |
| `agent_logs` | Monitor all agent actions | agent_type, cost_usd |

## Cost Estimate
- **Railway Free Tier:** $0/month
  - 512 MB RAM
  - 1 GB storage
  - Supports ~10K students

- **Upgrade ($5/mo):** 
  - 8 GB RAM
  - 100 GB storage  
  - Supports ~1M students

## Troubleshooting

### "psql: command not found"
Install PostgreSQL client:
```bash
# macOS
brew install postgresql

# Ubuntu
sudo apt-get install postgresql-client
```

### Migration fails
Run SQL manually:
1. Open Railway dashboard → PostgreSQL → Query tab
2. Copy contents of `src/db/schema.ts` → `SCHEMA_SQL`
3. Paste and execute

### Need to reset?
```bash
# Drop all tables (DANGER!)
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-run migration
npm run db:migrate
```
