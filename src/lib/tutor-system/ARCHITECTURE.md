# Tutor System - Architecture Overview

High-level architecture documentation for the Tutor System module.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Frontend (Next.js)                          │
│  - Question input form                                              │
│  - Response display with formatting                                 │
│  - Follow-up question suggestions                                   │
│  - Chat history viewer                                              │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
            ╔════════════════════════════════════╗
            ║    REST API Layer                  ║
            ║  - Input validation                ║
            ║  - Request routing                 ║
            ║  - Response serialization          ║
            ╚════════════┬═══════════════════════╝
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
   │   Cache     │ │   Tutor     │ │  Database   │
   │  (Redis)    │ │  Orchestrator│ │  Logger     │
   │             │ │             │ │             │
   │ - Store     │ │ - Coordinate│ │ - Insert    │
   │ - Retrieve  │ │ - Validate  │ │ - Query     │
   │ - Expire    │ │ - Route     │ │ - Archive   │
   └─────────────┘ └──────┬──────┘ └─────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
   │     Rate     │ │   Response   │ │    Claude    │
   │ Limiter      │ │  Generator   │ │   API        │
   │              │ │              │ │              │
   │ - Check      │ │ - Prompt     │ │ - Models:    │
   │   limits     │ │   engineering│ │   Haiku 3.5  │
   │ - Track      │ │ - Streaming  │ │ - Streaming  │
   │   usage      │ │ - Fallbacks  │ │ - Cost       │
   └──────────────┘ └──────────────┘ └──────────────┘
```

## Component Responsibilities

### 1. REST API Layer
**File**: `route.ts` (in `/api/tutor/*` endpoints)

**Responsibilities:**
- Receive HTTP requests from frontend
- Validate request parameters
- Route to appropriate handlers
- Format and return responses
- Handle CORS and authentication

**Key Functions:**
- POST /api/tutor/ask - Answer question
- GET /api/tutor/student/:id/history - Get conversation history
- GET /api/tutor/student/:id/stats - Get usage statistics

---

### 2. Tutor System Orchestrator
**File**: `tutor-system.ts`

**Responsibilities:**
- Coordinate request flow
- Manage state transitions
- Implement error recovery
- Track performance metrics
- Return responses to API layer

**Key Functions:**
```
answerQuestion()
├── validateInput()
├── getCachedResponse()
├── checkRateLimit()
├── generateResponse()
├── setCachedResponse()
├── logInteraction()
└── return response
```

**Error Handling:**
- Catches errors at each stage
- Implements graceful fallbacks
- Logs errors for monitoring
- Returns friendly user messages

---

### 3. Response Cache
**File**: `response-cache.ts`

**Responsibilities:**
- Store frequently asked questions
- Retrieve cached responses quickly
- Manage cache size and TTL
- Provide cache statistics

**Cache Key Structure:**
```
Key: tutor:question:{hash}
Hash: MD5(normalizeQuestion(question))

Example:
"tutor:question:a1b2c3d4e5f6g7h8i9j0"

Value: Serialized TutorResponse object
TTL: 24 hours (86,400 seconds)
```

**Performance:**
- Cache hits: < 50ms
- Cache misses: Trigger API call
- Memory overhead: ~1KB per cached response

---

### 4. Rate Limiter
**File**: `rate-limiter.ts`

**Responsibilities:**
- Check daily question limit
- Track student question count
- Reset limits at midnight UTC
- Provide remaining count

**Rate Limit Model:**
```
Key: rate-limit:{studentId}:{dateString}
Example: "rate-limit:student-123:2024-01-15"

Value: {
  questionsAsked: 3,
  resetAt: 1640000000000,  // ISO timestamp
  dailyLimit: 10
}

Logic:
if questionsAsked >= dailyLimit:
  return { allowed: false, resetAt: tomorrow_midnight }
else:
  increment questionsAsked
  return { allowed: true, remaining: limit - asked }
```

**Reset Logic:**
```typescript
function calculateResetTime(currentTime: Date): Date {
  const reset = new Date(currentTime);
  reset.setUTCHours(0, 0, 0, 0);  // Midnight UTC
  
  if (reset <= currentTime) {
    reset.setDate(reset.getDate() + 1);  // Tomorrow
  }
  
  return reset;
}
```

---

### 5. Response Generator
**File**: `response-generator.ts`

**Responsibilities:**
- Create Claude API requests
- Stream and parse responses
- Generate follow-up questions
- Handle API errors

**Request Flow:**
```
generateTutorResponse({question, context})
├── Build system prompt (educational guidelines)
├── Build user message (student question + context)
├── Call anthropic.messages.create() with streaming
├── Collect streamed tokens
├── Parse markdown formatting
├── Generate follow-up questions
├── Return structured response
└── Measure latency
```

**System Prompt:** (Educational focus)
```
You are a friendly, patient AI tutor helping a student learn.

Guidelines:
1. Explain concepts clearly and simply
2. Use analogies and real-world examples
3. Ask guiding questions to check understanding
4. Encourage curiosity and deeper exploration
5. Be encouraging and positive

Student Level: [gradeLevel]
Subject: [subject]
```

**Response Structure:**
```
{
  answer: "Main explanation...",
  followUpQuestions: [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ],
  relatedTopics: [
    "Topic 1",
    "Topic 2"
  ],
  metadata: {
    cached: false,
    latencyMs: 1245,
    tokensUsed: 342
  }
}
```

---

### 6. Database Logger
**File**: `database-logger.ts`

**Responsibilities:**
- Log all interactions
- Store for analytics
- Provide query capabilities
- Clean up old records

**Schema:**
```sql
tutor_interactions (
  id: BIGINT PRIMARY KEY,
  student_id: VARCHAR(255),
  question: TEXT,
  answer: TEXT,
  cached: BOOLEAN,
  latency_ms: INTEGER,
  tokens_used: INTEGER,
  timestamp: BIGINT,
  metadata: JSONB
)

Indexes:
- idx_student_timestamp (student_id, timestamp)
- idx_timestamp (timestamp)
```

**Logging:**
- Async operation (doesn't block API response)
- Includes both cached and fresh responses
- Falls back to console if DB unavailable
- Includes error tracking

---

## Data Flow Diagram

### Happy Path (Cache Hit)

```
Student Question
    │
    ▼
Validate Input ✓
    │
    ▼
Check Cache ✓ (HIT)
    │
    ▼
Return Cached Response
    │
    ├─→ Log to Database (async)
    │
    └─→ Return to Student (< 50ms)
```

### Standard Path (Cache Miss, API Call)

```
Student Question
    │
    ▼
Validate Input ✓
    │
    ▼
Check Cache ✗ (MISS)
    │
    ▼
Check Rate Limit ✓
    │
    ▼
Call Claude API
    │
    ├─→ Stream tokens
    ├─→ Parse response
    └─→ Generate follow-ups
    │
    ▼
Cache Response ✓
    │
    ├─→ Log to Database (async)
    │
    └─→ Return to Student (1-10s)
```

### Error Path (Rate Limit Hit)

```
Student Question
    │
    ▼
Validate Input ✓
    │
    ▼
Check Cache ✗
    │
    ▼
Check Rate Limit ✗ (EXCEEDED)
    │
    ▼
Return Error Message
    │
    ├─→ "You've reached your 10-question limit"
    ├─→ "Resets at: [tomorrow midnight UTC]"
    │
    └─→ Log attempt (optional)
```

---

## Technology Stack

### API & Runtime
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Runtime**: Node.js 18+

### External Services
- **LLM**: Claude 3.5 Haiku (via Anthropic API)
- **Cache**: Redis (7.0+)
- **Database**: PostgreSQL (12+)

### Libraries
- `@anthropic-ai/sdk` - Claude API client
- `redis` - Redis client
- `pg` - PostgreSQL client
- `zod` - Schema validation
- `winston` - Logging

### Deployment
- **Hosting**: Vercel, AWS Lambda, or Docker
- **Cache Hosting**: Redis Cloud, AWS ElastiCache, Upstash
- **Database Hosting**: AWS RDS, Google Cloud SQL, Railway

---

## Scalability Considerations

### Horizontal Scaling

**Current Limits:**
- Single server can handle ~100 requests/second
- Cache TTL: 24 hours (varies by usage)
- Database: Connection pool of 20

**Scaling Strategy:**
```
Load Balancer
├─ Server 1
├─ Server 2
└─ Server 3

Shared Resources:
├─ Redis Cluster (shared cache)
├─ PostgreSQL (shared database)
└─ Anthropic API (external, scalable)
```

**Monitoring for Growth:**
- Track API response times
- Monitor cache hit rates
- Check database connection pool utilization
- Review Claude API token consumption

### Database Optimization

For large student populations:
1. **Partitioning**: Partition by student_id
2. **Archival**: Move old interactions to archive table
3. **Read Replicas**: Use for analytics queries
4. **Indexing**: Add indexes on frequently queried fields

```sql
-- Partition by student range
CREATE TABLE tutor_interactions_a PARTITION OF tutor_interactions
  FOR VALUES FROM ('a') TO ('m');

CREATE TABLE tutor_interactions_n PARTITION OF tutor_interactions
  FOR VALUES FROM ('n') TO ('z');
```

---

## Security Architecture

### Input Validation
```
User Input
    │
    ▼
Validate length (< 500 chars)
    │
    ▼
Check for malicious patterns
    │
    ▼
Normalize whitespace
    │
    ▼
Pass to API
```

### Authentication
- Rate limiting per student_id
- IP-based rate limiting (optional)
- API key for admin endpoints
- No user accounts needed (localStorage-based)

### Data Protection
- Cache entries don't leak between students
- Database logs are isolated per student
- No sensitive data in error messages
- API keys secure in environment variables

---

## Testing Strategy

### Unit Tests
- Response generator formatting
- Rate limit calculations
- Cache key generation
- Input validation

### Integration Tests
- Full request flow (cache → API → log)
- Error scenarios
- Edge cases (rate limits, timeouts)

### End-to-End Tests
- Frontend to API to services
- Performance benchmarks
- Load testing

---

## Monitoring & Observability

### Key Metrics
```
Request Metrics:
├─ Requests per second
├─ Response time (p50, p95, p99)
└─ Error rate

Cache Metrics:
├─ Hit rate (%)
├─ Size (items)
└─ Evictions per hour

API Metrics:
├─ Token usage
├─ Cost per request
└─ Error rate

Rate Limit Metrics:
├─ Violations per hour
├─ Reset distribution
└─ Usage patterns by student
```

### Alerting

| Metric | Threshold | Action |
|--------|-----------|--------|
| Error Rate | > 5% | Page on-call |
| Response Time (p95) | > 5s | Notify team |
| Cache Hit Rate | < 50% | Investigate |
| Database Connections | > 18/20 | Scale pool |
| API Rate Limit | > 80% | Alert |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01-15 | Initial implementation |
| 1.1 | TBD | Multi-language support |
| 2.0 | TBD | Voice interface, fine-tuning |

---

## Related Documentation

- [README](./README.md) - User guide and API overview
- [API Documentation](./API.md) - Detailed endpoint specs
- [Deployment Guide](./DEPLOYMENT.md) - Production setup
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues
- [Contributing](./CONTRIBUTING.md) - Development guide
