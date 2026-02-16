# Tutor System Module

The Tutor System is an AI-powered tutoring component that provides intelligent educational responses to student questions using Claude Haiku 3.5.

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Student Question                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────┐
        │   Cache Check (Redis)        │
        │   - Check if seen before     │
        │   - Return cached if found   │
        └────────────┬────────────────┘
                     │ Miss
                     ▼
        ┌─────────────────────────────┐
        │  Rate Limit Check            │
        │  - 10 questions/student/day  │
        │  - Resets at midnight UTC    │
        └────────────┬────────────────┘
            Pass │      │ Limit Exceeded
                 ▼      └──────────────────────┐
        ┌─────────────────────────────┐        │
        │   Call Claude API (Haiku)    │        │
        │   - Stream response          │        │
        │   - Parse markdown           │        │
        │   - Generate followups       │        │
        └────────────┬────────────────┘        │
                     ▼                          │
        ┌─────────────────────────────┐        │
        │   Cache Response (Redis)     │        │
        │   - 24-hour TTL              │        │
        └────────────┬────────────────┘        │
                     │                          │
                     ▼                          │
        ┌─────────────────────────────┐        │
        │   Log to Database            │        │
        │   - Question & answer        │        │
        │   - Metadata (cached flag)   │        │
        │   - Performance metrics      │        │
        └────────────┬────────────────┘        │
                     │                          │
                     └──────────┬───────────────┘
                                ▼
                    ┌─────────────────────────────┐
                    │   Return to Student          │
                    │   - Response text            │
                    │   - Follow-up questions      │
                    │   - Related topics           │
                    └─────────────────────────────┘
```

## Key Components

### 1. **Response Generator** (`response-generator.ts`)
Handles all Claude API interactions and response formatting.

**Functions:**
- `generateTutorResponse()` - Main entry point for generating responses
- `streamResponse()` - Handles streaming responses from API
- `parseMarkdownResponse()` - Converts markdown to structured format
- `generateFollowupQuestions()` - Creates contextual follow-up questions

**Features:**
- Streaming responses for better UX
- Markdown parsing for rich formatting
- Follow-up question generation
- Error recovery with fallback responses

### 2. **Response Cache** (`response-cache.ts`)
Efficient caching of tutor responses using Redis.

**Functions:**
- `getCachedResponse()` - Retrieve cached response
- `setCachedResponse()` - Store response with TTL
- `invalidateCache()` - Clear specific responses
- `getCacheStats()` - Monitor cache performance

**Cache Strategy:**
- Key: `tutor:question:{questionHash}`
- Value: Complete response object
- TTL: 24 hours (86,400 seconds)
- Automatic cleanup when space needed

### 3. **Rate Limiter** (`rate-limiter.ts`)
Controls student question frequency.

**Functions:**
- `checkRateLimit()` - Verify limit before API call
- `recordQuestion()` - Log question for tracking
- `getRemainingQuestions()` - Get user's remaining quota
- `resetLimits()` - Reset daily limits (called by scheduler)

**Rate Limit Model:**
- **Limit**: 10 questions per student per day
- **Unique Key**: `rate-limit:{studentId}:{date}`
- **Reset**: Midnight UTC automatically
- **Tracking**: Individual student counters

### 4. **Database Logger** (`database-logger.ts`)
Persistent logging of tutor interactions.

**Functions:**
- `logInteraction()` - Record question/answer pair
- `getStudentHistory()` - Retrieve student's conversation history
- `getAnalytics()` - Generate usage statistics
- `cleanupOldLogs()` - Archive old records

**Log Schema:**
```sql
CREATE TABLE tutor_interactions (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  question TEXT NOT NULL,
  answer_preview VARCHAR(500),
  cached BOOLEAN DEFAULT FALSE,
  latency_ms INTEGER,
  timestamp BIGINT,
  metadata JSONB
);

CREATE INDEX idx_student_timestamp 
  ON tutor_interactions(student_id, timestamp);
```

### 5. **System Orchestrator** (`tutor-system.ts`)
Coordinates all components in the request flow.

**Main Functions:**
- `answerQuestion()` - Main entry point
  - Validates input
  - Checks cache
  - Checks rate limit
  - Calls API if needed
  - Logs interaction
  - Returns response

**Error Handling:**
- Graceful fallbacks at each stage
- Continues functioning if cache/database unavailable
- Friendly user messages for rate limits

## Usage

### Basic Question Flow

```typescript
import { answerQuestion } from '@/lib/tutor-system';

const response = await answerQuestion({
  question: 'What is photosynthesis?',
  studentId: 'student-123',
  context: {
    gradeLevel: 'middle-school',
    subject: 'biology'
  }
});

// Returns:
// {
//   answer: 'Photosynthesis is...',
//   followUpQuestions: [
//     'How do chloroplasts work?',
//     'What is the role of sunlight?'
//   ],
//   relatedTopics: ['cellular respiration', 'energy cycles'],
//   cached: false,
//   latencyMs: 1245
// }
```

### Checking Rate Limit

```typescript
import { checkRateLimit, getRemainingQuestions } from '@/lib/tutor-system/rate-limiter';

const allowed = await checkRateLimit('student-123');
if (!allowed) {
  const remaining = await getRemainingQuestions('student-123');
  console.log(`Try again tomorrow! Questions reset at midnight UTC.`);
}
```

### Accessing Student History

```typescript
import { getStudentHistory } from '@/lib/tutor-system/database-logger';

const history = await getStudentHistory('student-123', {
  limit: 20,
  offset: 0,
  sortBy: 'timestamp-desc'
});

history.interactions.forEach(interaction => {
  console.log(interaction.question);
  console.log(interaction.answerPreview);
});
```

## Configuration

### Environment Variables

```bash
# Claude API
ANTHROPIC_API_KEY=your-key-here

# Redis Cache
REDIS_URL=redis://localhost:6379
REDIS_TTL_SECONDS=86400  # 24 hours

# Database
DATABASE_URL=postgresql://user:pass@localhost/learnverse

# Rate Limiting
DAILY_QUESTION_LIMIT=10
RATE_LIMIT_RESET_HOUR=0  # Midnight UTC

# Features
ENABLE_RATE_LIMITING=true
ENABLE_CACHING=true
ENABLE_DATABASE_LOGGING=true
FALLBACK_MODE=offline  # Use cached responses if API unavailable
```

### Feature Flags

```typescript
// In your environment or config
const TUTOR_CONFIG = {
  rateLimitingEnabled: true,
  cachingEnabled: true,
  databaseLoggingEnabled: true,
  streamResponsesEnabled: true,
  followupQuestionsEnabled: true,
  
  limits: {
    dailyQuestionLimit: 10,
    maxCachedResponses: 1000,
    maxFollowupQuestions: 5
  },

  timeouts: {
    apiCallTimeout: 10000,  // 10 seconds
    streamTimeout: 30000,   // 30 seconds
  }
};
```

## Performance Characteristics

### Response Time by Source

| Source | Latency | User Experience |
|--------|---------|-----------------|
| Redis Cache | < 50ms | Instant |
| Claude API | 1-5s | Slightly delayed |
| Streaming | 2-10s | Progressive reveal |
| Error/Fallback | < 100ms | Immediate |

### Cache Hit Rate

- **Target**: 60-80% for repeated questions
- **Monitoring**: Track via `getCacheStats()`
- **Optimization**: Increase cache TTL if hit rate low

### Database Performance

- **Logging**: Async, < 100ms impact per request
- **Query Performance**: Indexed on student_id and timestamp
- **Storage**: ~1KB per interaction

## Error Scenarios & Recovery

### Scenario 1: API Timeout

```
Question → Rate Check ✓ → API Call (timeout after 10s)
          → Use cached response if available
          → Return: "I'm thinking really hard! Please try again."
```

### Scenario 2: Rate Limit Exceeded

```
Question → Rate Check ✗
         → Return: "You've reached your daily limit (10 questions today).
                    Come back tomorrow at midnight UTC!"
         → Log attempt (optional)
```

### Scenario 3: Cache Miss, API Error

```
Question → Cache Miss → Rate Check ✓ → API Call (fails)
         → Return fallback + suggestion to try later
         → Track error for monitoring
```

### Scenario 4: Database Connection Lost

```
Question → Rate Check ✓ → API Call ✓ → Log to DB (fails)
         → Return response anyway + log warning
         → Cache response for later
         → Attempt retry on next request
```

## Monitoring & Analytics

### Key Metrics

```typescript
// Via analytics endpoint
GET /api/analytics/tutor/stats?studentId=...

{
  totalQuestions: 247,
  uniqueTopics: 45,
  cacheHitRate: 0.72,
  averageResponseTime: 1250,  // ms
  questionsToday: 3,
  questionsUntilLimit: 7,
  topTopics: [
    { topic: 'photosynthesis', count: 23 },
    { topic: 'mitochondria', count: 18 }
  ],
  lastAccessedTime: 1640000000000
}
```

### Logging & Debugging

```bash
# Enable debug logging
DEBUG=learnverse:tutor:* npm run dev

# View logs
tail -f .logs/tutor-system.log

# Monitor rate limits
node scripts/monitor-rate-limits.js

# Check cache health
node scripts/check-cache-health.js

# View database logs
psql -d learnverse -c "SELECT * FROM tutor_interactions 
  WHERE student_id = 'student-123' 
  ORDER BY timestamp DESC LIMIT 10"
```

## Security Considerations

1. **API Key Rotation**: Implement key rotation every 90 days
2. **Input Validation**: Sanitize questions before API calls
3. **Rate Limiting**: Prevent abuse via 10-question daily limit
4. **Database Access**: Use parameterized queries to prevent SQL injection
5. **Cache Isolation**: Ensure students only see their own cached responses
6. **Error Messages**: Avoid leaking sensitive system info in error responses

## Testing

See [Integration Tests](../../__tests__/integration/tutor-system.test.ts) for comprehensive test cases.

**Test Coverage:**
- ✅ Cache hit/miss scenarios
- ✅ Rate limit enforcement
- ✅ API integration
- ✅ Database logging
- ✅ Error recovery
- ✅ Performance benchmarks

## Future Enhancements

1. **Multi-language Support**: Translate questions/answers
2. **Custom Knowledge Base**: Add school-specific curriculum
3. **Voice Interaction**: Speech-to-text input
4. **Advanced Analytics**: Learning progress tracking
5. **Peer Questions**: Anonymous question sharing between students
6. **AI Fine-tuning**: Adapt responses to student level

## Troubleshooting

### "Database URL not set" Warning
**Solution**: Add `DATABASE_URL` env var or enable logging will fall back to console.

### Cache Not Working
**Check**: Redis connection, verify `REDIS_URL` is set and server is running
```bash
redis-cli ping  # Should return PONG
```

### Rate Limit Always Triggers
**Check**: Current time vs `RATE_LIMIT_RESET_HOUR`, verify student counter in Redis

### API Calls Slow
**Check**: 
- Network latency to Anthropic API
- Model availability and load
- Consider using cached responses more
- Add `?cached=true` parameter to force cache

## API Reference

See [API Documentation](./API.md) for complete endpoint specifications.

## License

Part of the Learnverse educational platform. See root LICENSE file.
