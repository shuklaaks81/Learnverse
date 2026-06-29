# Phase 2: Quick Start Guide

**Status:** 🚀 Ready to begin  
**Timeline:** Week 2  
**Budget:** $0-15/month (within free tier)  
**Success Goal:** Persistent database logging + analytics ready

---

## 🎯 What You'll Do This Week

By Friday, you'll have:
- ✅ PostgreSQL database on Railway
- ✅ Database schema created (5 tables)
- ✅ Learnverse logging to database
- ✅ Analytics queries ready
- ✅ Cost <$15/month lifetime

---

## ⏱️ Time Breakdown

| Step | Time | Effort |
|------|------|--------|
| Create Railway account | 5 min | Click-only |
| Create PostgreSQL database | 2 min | Auto-provisioned |
| Create schema | 5 min | Run script |
| Get connection string | 2 min | Copy-paste |
| Update .env.local | 2 min | Paste URL |
| Test database | 3 min | Run script |
| Verify logging works | 5 min | Manual test |
| **Total** | **~25 minutes** | **Easy** |

---

## 📋 Step-by-Step Process

### Step 1: Create Railway Account (5 min)

Go to: https://railway.app

1. Click **"Start Free"**
2. Sign in with GitHub (easiest)
3. Create a new project (auto-created)
4. You'll see empty dashboard

### Step 2: Create PostgreSQL Database (2 min)

1. In Railway dashboard, click **"+ New"**
2. Select **"Database"**
3. Select **"PostgreSQL"**
4. Railway automatically provisions the database
5. Wait 30-60 seconds for setup complete

### Step 3: Get Connection String (2 min)

1. Click on the PostgreSQL service
2. Click the **"Connect"** tab
3. You should see something like:
   ```
   postgresql://user:password@host:port/database
   ```
4. **Copy the ENTIRE string** (you'll need it next)

### Step 4: Update .env.local (2 min)

Open `.env.local` in your editor and add:

```bash
# Add this line at the end of .env.local
DATABASE_URL=postgresql://user:password@host:port/database
```

**Replace** `postgresql://...` with what you copied from Railway.

Save the file.

### Step 5: Run Database Setup Script (5 min)

In terminal:

```bash
# Make script executable
chmod +x scripts/setup-database.sh

# Run setup
bash scripts/setup-database.sh
```

You should see:
```
✅ PostgreSQL connection successful
✅ Database schema created successfully!
```

If you get an error, check:
- [ ] CONNECTION_URL is correct (copy from Railway again)
- [ ] PostgreSQL is ready (wait another 30 seconds)
- [ ] psql is installed (see troubleshooting below)

### Step 6: Restart Development Server (1 min)

```bash
# Kill current server (if running)
Ctrl+C

# Restart
npm run dev
```

You should see:
```
▲ Next.js 16
✓ Ready in 1234ms
```

### Step 7: Test Database Logging (5 min)

```bash
# Make test script executable
chmod +x scripts/test-database.sh

# Run tests
bash scripts/test-database.sh
```

Expected output:
```
✅ PostgreSQL connection successful
✅ All tables exist
✅ Test record inserted
✅ All database tests passed!
```

### Step 8: Manual Test (5 min)

1. Open: http://localhost:3000/kid/tutor
2. Type a question: "What is 5+3?"
3. Click send
4. Wait for response

Then check the database:

```bash
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM tutor_logs;"
```

You should see the record count increased by 1!

---

## ✅ Phase 2 Success Checklist

- [ ] Railway PostgreSQL created
- [ ] Connection string copied to .env.local
- [ ] DB setup script ran without errors
- [ ] All 5 tables exist in database
- [ ] Development server running
- [ ] Test script shows all green checkmarks
- [ ] Asked question in tutor page
- [ ] Record appears in tutor_logs table

---

## 🆘 Troubleshooting

### "Connection refused" or "Cannot connect to PostgreSQL"

**Cause:** Railway database not ready or wrong connection string

**Solution:**
1. Go to Railway dashboard
2. Click PostgreSQL service
3. Wait for "Status: Running" indicator
4. Try connecting again

### "psql: command not found"

**Cause:** PostgreSQL client not installed

**Solution:**
```bash
# macOS
brew install postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Or use Railway web interface instead of psql
```

### "password authentication failed" or "permission denied"

**Cause:** Wrong connection string

**Solution:**
1. Go to Railway dashboard → PostgreSQL → Connect
2. Copy the **full connection string** again
3. Paste exactly into .env.local
4. No edits needed!

### "DATABASE_URL not set"

**Cause:** .env.local file not updated or not found

**Solution:**
1. Create `.env.local` in project root if missing
2. Add: `DATABASE_URL=postgresql://...`
3. Restart `npm run dev`
4. Check: `echo $DATABASE_URL` in terminal

### "Disk quota exceeded"

**Cause:** Database too large

**Solution:** Not applicable for Phase 2 (free tier has 5GB)

---

## 📊 What's Happening Now

**Before (Phase 1):** Tutor responses logged to console only
```
[TUTOR-LOG] { studentId, question, cached, latency }
→ Console output only, lost on server restart
```

**After (Phase 2):** Logged to PostgreSQL database
```
[TUTOR-LOG] Database: { logId: 42, studentId, question, cached, latency }
→ Persisted in database, survives server restarts
→ Available for analytics & reporting
```

---

## 🎯 Next Steps After Phase 2

| Week | Task | Dependencies |
|------|------|--------------|
| W2 | Database logging | ✅ This week's work |
| W2 | Analytics dashboard | Database logging working |
| W3 | Content Generation Agent | Database + PostgreSQL |
| W4 | Beta Launch | All above complete |

---

## 💡 Tips & Tricks

### Query Your Data

```bash
# Count total logs
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM tutor_logs;"

# See last 10 interactions
psql "$DATABASE_URL" -c "
  SELECT student_id, question, cached, latency_ms, created_at 
  FROM tutor_logs 
  ORDER BY created_at DESC 
  LIMIT 10;
"

# Cache hit rate (past 24h)
psql "$DATABASE_URL" -c "
  SELECT 
    COUNT(*) FILTER (WHERE cached) * 100.0 / COUNT(*) as hit_rate_percent
  FROM tutor_logs 
  WHERE created_at > NOW() - INTERVAL '24 hours';
"
```

### Monitor Costs

Visit: https://huggingface.co/billing → Check monthly estimate

**Expected costs:**
- Phase 2: Free ($5/month credit still available)
- Light usage: <$2/month
- Medium usage: $5-10/month

### Auto-Backup Your Database

Railway automatically backs up to 7 days. For longer retention, add to your cron:

```bash
# Weekly backup script
0 2 * * 0 pg_dump "$DATABASE_URL" > ~/backup-$(date +%Y%m%d).sql
```

---

## 📞 Support

**Issue?** Check:
1. PHASE2_RAILWAY_SETUP.md (full detailed guide)
2. Troubleshooting section above
3. Railway docs: https://docs.railway.app
4. PostgreSQL docs: https://postgresql.org

**All set?** Move to next phase: Content Generation Agent (Week 2 continued)

---

## 🎉 You Did It!

Once you complete all steps above:
- ✅ Persistent data storage
- ✅ Analytics foundation ready
- ✅ Logging infrastructure complete
- ✅ Ready for next phase

**Estimated time to complete:** 25 minutes  
**Estimated cost:** $0 (free tier)  
**Difficulty:** Easy (no coding required)

Let's go! 🚀
