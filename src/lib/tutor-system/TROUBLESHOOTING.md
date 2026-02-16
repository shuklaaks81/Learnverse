# Tutor System - Troubleshooting Guide

Common issues and their solutions when working with the Tutor System.

## Quick Diagnosis

Use this flowchart to quickly identify issues:

```
Is the app working?
├─ YES → Everything is fine! 🎉
│
└─ NO
    ├─ Error on question submission?
    │  ├─ Validation error (red box) → See "Input Validation Issues"
    │  ├─ "Rate limit" message → See "Rate Limiting Issues"
    │  ├─ "Thinking..." spinner hangs → See "API Timeout Issues"
    │  └─ Random 500 error → See "Server Errors"
    │
    ├─ No responses showing up?
    │  ├─ Page is blank → See "Frontend Issues"
    │  ├─ Responses don't save → See "Database Issues"
    │  └─ Responses are slow → See "Performance Issues"
    │
    └─ Something else?
       → See "General Debugging" at the bottom
```

## Input Validation Issues

### Error: "Question is too short"

**Symptoms:**
- Form shows red error message
- Can't submit question
- Browser console shows: `INVALID_QUESTION`

**Solutions:**

1. **Check question length:**
   ```javascript
   const question = "What?";  // Too short (< 3 chars)
   question.length >= 3     // Must be true
   ```
   **Fix**: Ask a more complete question (minimum 3 characters)

2. **Question is empty:**
   ```javascript
   const question = "";
   // Or: "   " (just spaces)
   ```
   **Fix**: Type some text before submitting

3. **Question has special characters:**
   ```javascript
   const question = "What is <script>";  // Contains < or >
   ```
   **Fix**: Use normal question phrasing without HTML-like syntax

---

### Error: "Question is too long"

**Symptoms:**
- Form shows red error message
- Character counter exceeds 500

**Solution:**
```javascript
if (question.length > 500) {
  // Too long!
}
```

**Fix**: Make your question more concise (max 500 characters)

---

## Rate Limiting Issues

### Error: "You've reached your daily limit"

**Symptoms:**
- Submit form shows: "You've reached your daily limit of 10 questions"
- Shows reset time: "Come back tomorrow at midnight UTC"
- No more questions allowed

**Understanding Rate Limits:**
```
Daily Limit: 10 questions per student per day
Reset: Midnight UTC (00:00 UTC)
Tracking: Per student ID
```

**Solutions:**

1. **Check your current usage:**
   ```javascript
   // In browser console
   const stats = await fetch('/api/tutor/student/YOUR_ID/stats').then(r => r.json());
   console.log(stats.data.today);
   // {
   //   questionsAsked: 10,
   //   questionsRemaining: 0,
   //   resetAt: "2024-01-16T00:00:00Z"
   // }
   ```

2. **Calculate time until reset:**
   ```javascript
   const resetTime = new Date('2024-01-16T00:00:00Z');
   const now = new Date();
   const hoursLeft = (resetTime - now) / (1000 * 60 * 60);
   console.log(`${hoursLeft.toFixed(1)} hours until reset`);
   ```

3. **For testing (development only):**
   ```bash
   # Reset limits for a specific student (requires admin key)
   curl -X POST http://localhost:3000/api/tutor/admin/reset-limits \
     -H "Content-Type: application/json" \
     -d '{
       "studentId": "test-student",
       "apiKey": "your-admin-key"
     }'
   ```

4. **For production:**
   - Contact admin to reset if absolutely necessary
   - Verify if this is a real student (not testing)
   - Check for bot activity (unusual patterns)

---

### Rate Limit Not Resetting

**Symptoms:**
- Still showing "limit reached" after midnight
- Reset time shows past time

**Debugging:**

1. **Check server time:**
   ```bash
   # Server time should be UTC
   date -u
   # Should show current UTC time
   ```

2. **Check rate limit key in Redis:**
   ```bash
   redis-cli
   > KEYS "rate-limit:*"
   # Lists all rate limit keys
   
   > GET "rate-limit:student-123:2024-01-15"
   # Should return the count
   ```

3. **Verify reset logic:**
   ```bash
   # In Redis, keys should auto-expire at midnight
   > TTL "rate-limit:student-123:2024-01-15"
   # Should show seconds until midnight UTC
   ```

**Solutions:**

1. **If key hasn't expired:**
   ```bash
   redis-cli
   > DEL "rate-limit:student-123:2024-01-15"
   > FLUSHDB  # Nuclear option (clears all cache)
   ```

2. **If timezone is wrong:**
   ```bash
   # Verify RATE_LIMIT_RESET_HOUR env var
   echo $RATE_LIMIT_RESET_HOUR
   # Should be '0' (midnight UTC)
   ```

---

## API Timeout Issues

### Error: "I'm thinking really hard right now..." (spinner doesn't end)

**Symptoms:**
- Question submitted successfully
- "Thinking..." spinner appears
- Spinner continues for > 30 seconds
- No response appears

**Possible Causes:**

1. **Network timeout (10 seconds):**
   ```
   Submitted → [waiting 10s] → Timeout
   Returns: "I'm thinking really hard!"
   ```

2. **Slow Claude API:**
   - Anthropic API is slow or overloaded
   - Model is taking longer than expected

3. **Redis connection issue:**
   - Cache check is hanging
   - Database connect is slow

**Solutions:**

1. **Check network connectivity:**
   ```bash
   # Verify internet connection
   ping google.com
   
   # Check Claude API status
   curl https://api.anthropic.com/health
   ```

2. **Check logs for timeout:**
   ```bash
   # In browser console
   fetch('/api/tutor/ask', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ question: 'Test?', studentId: 'test' })
   })
   .then(r => r.json())
   .catch(err => console.error('Error:', err));
   ```

3. **Increase timeout temporarily for testing:**
   ```bash
   # In .env.development
   NEXT_PUBLIC_API_TIMEOUT_MS=20000  # 20 seconds instead of 10
   ```

4. **Try a simpler question:**
   - Sometimes complex questions timeout
   - Try: "What is 2+2?" first
   - Then try your original question

5. **Check Claude API key:**
   ```bash
   # Verify in .env
   echo $ANTHROPIC_API_KEY
   # Should start with "sk-ant-v3-"
   
   # Test directly
   curl https://api.anthropic.com/v1/messages \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -d '{"model":"claude-3-5-haiku-20241022","max_tokens":10,"messages":[{"role":"user","content":"hi"}]}'
   ```

---

### Response Is Too Slow

**Symptoms:**
- Response takes 5+ seconds regularly
- Other systems are responsive
- Only tutor is slow

**Debugging:**

1. **Check cache hit rate:**
   ```bash
   # In admin dashboard
   GET /api/tutor/cache/stats
   
   # Look for: hitRate should be > 0.60
   ```

2. **Check if response is cached:**
   ```javascript
   // In browser console
   const response = await fetch('/api/tutor/ask', {...});
   const header = response.headers.get('X-Cache-Hit');
   console.log('From cache?', header === 'true');
   ```

3. **Measure latency:**
   ```javascript
   const start = Date.now();
   const response = await fetch('/api/tutor/ask', {...});
   const time = Date.now() - start;
   console.log(`Response took ${time}ms`);
   
   // < 100ms = excellent (cached)
   // < 1000ms = good
   // < 5000ms = acceptable
   // > 5000ms = investigate
   ```

**Solutions:**

1. **Improve cache hit rate:**
   ```bash
   # Ask repeated questions to build cache
   
   # Check what's most cached:
   SELECT question, COUNT(*) as hits 
   FROM tutor_interactions 
   WHERE cached = true 
   GROUP BY question 
   ORDER BY hits DESC;
   ```

2. **Increase cache TTL:**
   ```bash
   # In .env
   REDIS_TTL_SECONDS=259200  # 72 hours instead of 24
   ```

3. **Check Claude API performance:**
   - Varies based on server load
   - Try again in a few minutes
   - Use cached responses in meantime

---

## Server Errors

### HTTP 500: Internal Server Error

**Symptoms:**
- Submit question → Get "500 Internal Server Error"
- No response body
- Browser console shows: "Failed to fetch"

**Debugging:**

1. **Check server logs:**
   ```bash
   # Development
   npm run dev
   # Watch terminal output for error messages
   
   # Production
   tail -f /var/log/learnverse/error.log
   
   # Docker
   docker logs <container-id>
   ```

2. **Check specific endpoint:**
   ```bash
   # Test with curl
   curl -X POST http://localhost:3000/api/tutor/ask \
     -H "Content-Type: application/json" \
     -d '{"question":"Test?","studentId":"test"}'
   
   # Should return 200 or 429, not 500
   ```

3. **Check database connection:**
   ```bash
   # From server
   psql $DATABASE_URL -c "SELECT 1"
   # Should respond with (1)
   ```

4. **Check Redis connection:**
   ```bash
   redis-cli ping
   # Should respond with PONG
   ```

**Solutions:**

1. **Restart services:**
   ```bash
   # Development
   Ctrl+C
   npm run dev
   
   # Docker
   docker-compose restart
   
   # Production
   systemctl restart learnverse-tutor
   ```

2. **Check environment variables:**
   ```bash
   # Verify .env file exists and has values
   cat .env.production
   
   # Check critical vars are set
   echo "ANTHROPIC_API_KEY: $ANTHROPIC_API_KEY"
   echo "DATABASE_URL: $DATABASE_URL"
   echo "REDIS_URL: $REDIS_URL"
   ```

3. **Check disk space:**
   ```bash
   df -h
   # Should have > 1GB free
   ```

4. **Check memory:**
   ```bash
   free -h
   # Node.js typically uses 100-500MB
   ```

---

### Error: "Cannot connect to database"

**Symptoms:**
- Page loads but questions fail
- Browser console: "DATABASE_ERROR"
- Server logs show: "Connection refused"

**Debugging:**

1. **Check DATABASE_URL:**
   ```bash
   # Verify format
   echo $DATABASE_URL
   # Should be: postgresql://user:pass@host:5432/dbname
   
   # Test connection
   psql $DATABASE_URL -c "SELECT version()"
   ```

2. **Check if database is running:**
   ```bash
   # Local
   sudo service postgresql status
   
   # Docker
   docker ps | grep postgres
   
   # Cloud (AWS RDS, etc.)
   # Check console for database instance status
   ```

3. **Check network connectivity:**
   ```bash
   # If remote database
   ping database.host.com
   
   # Check port is accessible
   nc -zv database.host.com 5432
   ```

**Solutions:**

1. **Start database:**
   ```bash
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   
   # Docker
   docker-compose up -d postgres
   ```

2. **Verify credentials:**
   ```bash
   # Make sure user has correct password
   # Make sure user has database access
   psql postgresql://user:pass@host:5432/learnverse \
     -c "SELECT 1"
   ```

3. **Reset connection pool:**
   ```javascript
   // In Node.js app
   pool.drain()
   pool.clear()
   // Reconnect
   ```

---

### Error: "Cannot connect to Redis"

**Symptoms:**
- Page crashes or is very slow
- Server logs: "REDIS_CONNECTION_ERROR"
- Cache is not working

**Debugging:**

1. **Check Redis is running:**
   ```bash
   redis-cli ping
   # Should respond: PONG
   ```

2. **Check REDIS_URL:**
   ```bash
   echo $REDIS_URL
   # Should be: redis://[user:password@]host:port/[db]
   
   # Test with redis-cli
   redis-cli -u "$REDIS_URL" ping
   ```

3. **Check Redis memory:**
   ```bash
   redis-cli INFO memory
   # Check used_memory is reasonable
   ```

**Solutions:**

1. **Start Redis:**
   ```bash
   # macOS
   brew services start redis
   
   # Linux
   sudo systemctl start redis-server
   
   # Docker
   docker-compose up -d redis
   ```

2. **Clear Redis if corrupted:**
   ```bash
   redis-cli FLUSHALL
   # This clears all cached responses (they'll rebuild)
   ```

3. **Check for connection issues:**
   ```bash
   # If on different machine
   redis-cli -h redis.example.com -p 6379 ping
   
   # Check firewall allows port 6379
   sudo ufw allow 6379/tcp
   ```

---

### Error: "Invalid API key"

**Symptoms:**
- Questions fail to respond
- Logs show: "Invalid authentication credentials"
- Or: "Incorrect API key provided"

**Debugging:**

1. **Verify API key format:**
   ```bash
   echo $ANTHROPIC_API_KEY
   # Should start with "sk-ant-v3-"
   # Should be at least 30 characters
   ```

2. **Check API key is valid:**
   ```bash
   # Test with curl
   curl https://api.anthropic.com/v1/messages \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "content-type: application/json" \
     -d '{
       "model": "claude-3-5-haiku-20241022",
       "max_tokens": 10,
       "messages": [{"role": "user", "content": "test"}]
     }'
   ```

**Solutions:**

1. **Get new API key:**
   - Go to https://console.anthropic.com/account/keys
   - Create new API key
   - Update in .env and restart

2. **Check key hasn't expired:**
   ```bash
   # Keys don't expire, but check if revoked
   # In console.anthropic.com
   ```

3. **Verify environment variable loaded:**
   ```bash
   # In Node.js app
   console.log('API Key length:', process.env.ANTHROPIC_API_KEY?.length);
   # Should be > 30
   ```

---

## Frontend Issues

### Responses Not Showing

**Symptoms:**
- Submit question → "Thinking..." → Spinner goes away
- But no response appears
- Browser console is empty

**Debugging:**

1. **Check response is being fetched:**
   ```javascript
   // In browser console
   const response = await fetch('/api/tutor/ask', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       question: 'What is gravity?',
       studentId: 'test-student'
     })
   });
   
   const data = await response.json();
   console.log('Response:', data);
   ```

2. **Check component is rendering:**
   ```javascript
   // In browser console
   document.querySelectorAll('[data-testid="tutor-response"]');
   // Should find element if response is rendered
   ```

3. **Check state is updating:**
   ```javascript
   // Use React DevTools
   // Inspect TutorComponent state
   // Verify 'response' state has data
   ```

**Solutions:**

1. **Check for JS errors:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for red error messages
   - Fix any errors shown

2. **Verify response structure:**
   ```javascript
   // Response should have:
   const data = {
     success: true,
     data: {
       answer: "...",
       followUpQuestions: [...],
       relatedTopics: [...]
     }
   };
   ```

3. **Check error response:**
   ```javascript
   // If error:
   const data = {
     success: false,
     error: {
       code: "...",
       message: "..."
     }
   };
   // Look at error code for clue
   ```

---

### History Not Saving

**Symptoms:**
- Answer questions successfully
- Refresh page → History is empty
- Previous questions are gone

**Debugging:**

1. **Check if database logging is enabled:**
   ```bash
   echo $ENABLE_DATABASE_LOGGING
   # Should be 'true'
   ```

2. **Check if database insert worked:**
   ```bash
   psql $DATABASE_URL -c \
     "SELECT COUNT(*) FROM tutor_interactions WHERE student_id = 'test-student'"
   # Should return number > 0
   ```

3. **Check API response includes log:**
   ```javascript
   // In browser console
   const response = ... // Your API call
   console.log(response.data.metadata);
   // Should have timestamp, cached: false initially
   ```

**Solutions:**

1. **Check DATABASE_URL is set:**
   ```bash
   echo $DATABASE_URL
   # Should not be empty
   ```

2. **Check database table exists:**
   ```bash
   psql $DATABASE_URL -c "\dt tutor_interactions"
   # Should show table definition
   ```

3. **Check database is not full:**
   ```bash
   psql $DATABASE_URL -c \
     "SELECT pg_size_pretty(pg_database_size('learnverse'))"
   # Should be reasonable size (< 10GB)
   ```

4. **Enable logging fallback:**
   ```bash
   # If DB is down, should log to console
   ENABLE_DATABASE_LOGGING=true
   # Check stderr output: tail -f error.log
   ```

---

## Performance Issues

### App Is Generally Slow

**Symptoms:**
- Every page takes 2+ seconds to load
- Responses are delayed
- Interface feels sluggish

**Debugging:**

1. **Check browser performance:**
   ```javascript
   // In browser console
   const timing = performance.getEntriesByType('navigation')[0];
   console.log('Load time:', timing.loadEventEnd - timing.fetchStart, 'ms');
   ```

2. **Check API response time:**
   ```javascript
   const start = Date.now();
   const response = await fetch('/api/tutor/ask', {...});
   console.log('API took:', Date.now() - start, 'ms');
   ```

3. **Check network tab in DevTools:**
   - F12 → Network tab
   - Submit a question
   - Look at response times

**Solutions:**

1. **Update Next.js and dependencies:**
   ```bash
   npm update
   npm install
   npm run build
   ```

2. **Check server resources:**
   ```bash
   top  # Or Activity Monitor on macOS
   # Look for high CPU or memory usage
   ```

3. **Clear cache and rebuild:**
   ```bash
   rm -rf .next
   npm run build
   npm run dev
   ```

---

## General Debugging

### How to Get Help

When reporting an issue, include:

1. **Steps to reproduce:**
   ```
   1. Go to http://...
   2. Click "Ask Question"
   3. Type "What is gravity?"
   4. Click submit
   5. See error...
   ```

2. **Expected behavior:**
   ```
   Should see response after 2-5 seconds
   ```

3. **Actual behavior:**
   ```
   Get 500 error message
   ```

4. **Screenshots/logs:**
   ```
   Browser console errors:
   - "Failed to fetch"
   
   Server log errors:
   - "Cannot connect to database"
   ```

5. **Environment:**
   ```
   - OS: macOS 14.1
   - Node: 18.17.0
   - npm: 9.6.7
   - Browser: Chrome 120
   ```

### Enable Debug Logging

```bash
# Add to .env.development
DEBUG=learnverse:tutor:*

# Run app
npm run dev

# Look for detailed logs in terminal
```

### Check All Services

```bash
#!/bin/bash
echo "Checking services..."

echo "📦 Node.js:"
node --version

echo "🔴 Redis:"
redis-cli ping || echo "FAILED"

echo "🗄️ PostgreSQL:"
psql $DATABASE_URL -c "SELECT version()" || echo "FAILED"

echo "🤖 Claude API:"
curl -s https://api.anthropic.com/v1/models \
  -H "x-api-key: $ANTHROPIC_API_KEY" | grep -q "claude" && echo "OK" || echo "FAILED"

echo "✅ All checks done!"
```

### Reset Everything (Last Resort)

```bash
#!/bin/bash
# WARNING: This will clear all data!

echo "Clearing cache..."
redis-cli FLUSHALL

echo "Clearing rate limits..."
psql $DATABASE_URL -c "DELETE FROM rate_limits;"

echo "Clearing interactions (keep for analytics)..."
# psql $DATABASE_URL -c "DELETE FROM tutor_interactions;"

echo "Restarting app..."
npm run dev

echo "✅ Reset complete! (But you lost data in cache & rate limits)"
```

---

## Still Not Working?

If none of these solutions work:

1. **Check the logs more carefully:**
   ```bash
   # Search for actual error message
   grep -i "error" .logs/*.log | head -20
   ```

2. **Isolate the problem:**
   ```bash
   # Test each component separately
   - Test database: psql command above
   - Test Redis: redis-cli ping above
   - Test API: curl command above
   ```

3. **Search GitHub Issues:**
   - Look for similar error messages
   - Check if there's a known workaround

4. **Contact Support:**
   - Include detailed logs from above
   - Include diagnostics from "Check All Services"
   - Include exact steps to reproduce
   - Email: support@learnverse.dev

---

## See Also

- [Architecture Overview](./ARCHITECTURE.md)
- [API Documentation](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Contributing Guide](./CONTRIBUTING.md)
