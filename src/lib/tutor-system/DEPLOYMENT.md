# Tutor System Deployment Guide

Production deployment instructions and best practices for the Tutor System.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Database Initialization](#database-initialization)
4. [Dependencies & Services](#dependencies--services)
5. [Performance Tuning](#performance-tuning)
6. [Monitoring & Logging](#monitoring--logging)
7. [Security Hardening](#security-hardening)
8. [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All tests passing (`npm test`)
- [ ] Code reviewed and merged to main
- [ ] Environment variables documented
- [ ] Database migrations tested
- [ ] Redis instance provisioned
- [ ] Claude API key obtained and verified
- [ ] Rate limiting values finalized
- [ ] Monitoring alerts configured
- [ ] Disaster recovery plan in place
- [ ] Security audit completed

## Environment Setup

### Required Environment Variables

```bash
# Claude API Configuration
ANTHROPIC_API_KEY=sk-ant-v3-...          # Get from https://console.anthropic.com
ANTHROPIC_API_URL=https://api.anthropic.com/v1  # Standard endpoint

# Redis Cache
REDIS_URL=redis://user:pass@host:6379/0  # Full connection string
REDIS_TTL_SECONDS=86400                  # 24 hours
REDIS_PASSWORD=your-secure-password      # For production
REDIS_SSL=true                           # Enable SSL in production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/learnverse
DATABASE_POOL_SIZE=20
DATABASE_IDLE_TIMEOUT=900000             # 15 minutes
DATABASE_CONNECTION_TIMEOUT=3000         # 3 seconds

# Rate Limiting
DAILY_QUESTION_LIMIT=10
RATE_LIMIT_RESET_HOUR=0                  # Midnight UTC
RATE_LIMIT_TIMEZONE=UTC

# Features & Flags
ENABLE_RATE_LIMITING=true
ENABLE_CACHING=true
ENABLE_DATABASE_LOGGING=true
ENABLE_FOLLOWUP_QUESTIONS=true
FALLBACK_MODE=cached                     # cached or offline

# Logging
LOG_LEVEL=info                           # debug, info, warn, error
LOG_FORMAT=json                          # json or text
LOG_FILE=/var/log/learnverse/tutor.log

# Monitoring & Observability
SENTRY_DSN=https://...@sentry.io/...    # Error tracking
DATADOG_API_KEY=dd_...                   # Metrics
ENABLE_METRICS=true

# Admin & Security
ADMIN_API_KEY=your-secure-admin-key
MAX_QUESTION_LENGTH=500
MAX_RESPONSE_CACHE_SIZE=1000
```

### Environment Configuration File

Create `.env.production`:

```bash
# Copy template and fill in values
cp .env.example .env.production

# Edit with production values
nano .env.production

# Verify configuration
npm run check-env
```

## Database Initialization

### Schema Setup

```bash
# 1. Connect to PostgreSQL
psql postgresql://user:pass@host:5432/learnverse

# 2. Create tutor_interactions table
CREATE TABLE tutor_interactions (
  id BIGSERIAL PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  answer_preview VARCHAR(500),
  cached BOOLEAN DEFAULT FALSE,
  latency_ms INTEGER,
  tokens_used INTEGER,
  model VARCHAR(50),
  timestamp BIGINT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT question_length CHECK (LENGTH(question) <= 500)
);

# 3. Create indexes for performance
CREATE INDEX idx_student_timestamp 
  ON tutor_interactions(student_id, timestamp DESC);

CREATE INDEX idx_timestamp 
  ON tutor_interactions(timestamp DESC);

CREATE INDEX idx_created_at 
  ON tutor_interactions(created_at DESC);

# 4. Create rate_limits table
CREATE TABLE rate_limits (
  id BIGSERIAL PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL UNIQUE,
  questions_today INTEGER DEFAULT 0,
  reset_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_reset 
  ON rate_limits(student_id, reset_at);

# 5. Create cache_stats table (for monitoring)
CREATE TABLE cache_stats (
  id BIGSERIAL PRIMARY KEY,
  cache_size INTEGER,
  hit_rate DECIMAL(5,2),
  evictions INTEGER,
  memory_usage_kb INTEGER,
  timestamp BIGINT NOT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cache_stats_timestamp 
  ON cache_stats(timestamp DESC);
```

### Running Migrations

```bash
# Using migration tool if available
npm run migrate:up

# Or manually verify tables exist
psql $DATABASE_URL -c "\dt tutor_*"
```

## Dependencies & Services

### Redis Setup

```bash
# Docker compose stack
version: '3.9'

services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes --requirepass $REDIS_PASSWORD
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: learnverse
      POSTGRES_PASSWORD: $DB_PASSWORD
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  redis-data:
  postgres-data:
```

### Starting with Docker Compose

```bash
# Start all services
docker-compose up -d

# Verify services are healthy
docker-compose ps

# Check logs
docker-compose logs -f redis
docker-compose logs -f postgres

# Stop services
docker-compose down
```

### Managed Redis Options

**AWS ElastiCache:**
```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id learnverse-tutor \
  --cache-node-type cache.r6g.large \
  --engine redis \
  --engine-version 7.0
```

**Heroku Redis:**
```bash
heroku addons:create heroku-redis:premium-0 -a learnverse
# Auto-sets REDIS_URL
```

**Upstash (Serverless):**
```
https://console.upstash.com
- Create database
- Copy REDIS_URL from console
- No management needed
```

## Performance Tuning

### Redis Configuration

```redis
# redis.conf for production
timeout 300
tcp-keepalive 60
databases 16

# Memory management
maxmemory 1gb
maxmemory-policy allkeys-lru  # LRU eviction when full

# Persistence
save 900 1        # Save if 1 key changed in 900 seconds
save 300 10       # Save if 10 keys changed in 300 seconds
save 60 10000     # Save if 10000 keys changed in 60 seconds
appendonly yes
appendfsync everysec

# Replication
replica-read-only yes
```

### Database Connection Pooling

```typescript
// In database initialization
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,                    // Max pool size
  idleTimeoutMillis: 900000,  // 15 minutes
  connectionTimeoutMillis: 3000,
});

export default pool;
```

### Cache Size Management

```typescript
// Implement cache eviction policy
const CACHE_CONFIG = {
  maxSize: 1000,              // Max cached responses
  ttl: 86400,                 // 24 hours
  evictionPolicy: 'lru',      // Remove least recently used
  monitorInterval: 3600000,   // Check every hour
};

async function monitorCache() {
  const stats = await getCacheStats();
  if (stats.size > CACHE_CONFIG.maxSize * 0.9) {
    // Trigger cleanup
    await evictLRU(Math.ceil(CACHE_CONFIG.maxSize * 0.1));
  }
}
```

### API Rate Optimization

```typescript
// Batch operations for efficiency
async function batchLogInteractions(interactions: InteractionLog[]) {
  // Insert multiple rows in one query
  const query = `
    INSERT INTO tutor_interactions
    (student_id, question, answer, cached, latency_ms, timestamp)
    VALUES ${interactions.map((_, i) => 
      `($${i*6+1}, $${i*6+2}, $${i*6+3}, $${i*6+4}, $${i*6+5}, $${i*6+6})`
    ).join(',')}
  `;
  
  const params = interactions.flatMap(i => [
    i.studentId, i.question, i.answer, i.cached, i.latencyMs, i.timestamp
  ]);
  
  return pool.query(query, params);
}
```

## Monitoring & Logging

### Structured Logging

```typescript
// Use JSON-based logging
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log interactions
logger.info('Tutor response generated', {
  studentId: 'student-123',
  question: 'What is photosynthesis?',
  cached: false,
  latencyMs: 1245,
  tokensUsed: 342
});
```

### Key Metrics to Track

```typescript
// Using Datadog or similar
import statsd from 'node-statsd';

const client = new StatsDClient({
  host: process.env.DATADOG_HOST,
  port: 8125,
});

// Track metrics
client.increment('tutor.questions.asked');              // Counter
client.histogram('tutor.response.latency_ms', latency); // Latency
client.gauge('tutor.cache.size', cacheSize);            // Cache size
client.increment('tutor.cache.hits', 1);                // Cache hit
client.increment('tutor.rate_limit.exceeded');          // Rate limit hit
client.histogram('tutor.api.tokens', tokensUsed);       // Token usage
```

### Health Check Endpoint

```typescript
// GET /health/tutor
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    anthropic: await checkAnthropic(),
    timestamp: new Date().toISOString()
  };

  const healthy = Object.values(checks).every(c => c === true);

  return Response.json(checks, {
    status: healthy ? 200 : 503
  });
}

async function checkDatabase() {
  try {
    const result = await pool.query('SELECT 1');
    return result.rows.length > 0;
  } catch {
    return false;
  }
}

async function checkRedis() {
  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}

async function checkAnthropic() {
  // Simple API call check
  try {
    const result = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 10,
      messages: [{
        role: 'user',
        content: 'ping'
      }]
    });
    return !!result.id;
  } catch {
    return false;
  }
}
```

### Alerting Rules

```yaml
# Prometheus/Datadog alerting rules
alerts:
  - name: HighErrorRate
    condition: rate(errors[5m]) > 0.05
    duration: 5m
    action: page

  - name: SlowResponses
    condition: histogram_quantile(0.95, response_time_ms) > 5000
    duration: 10m
    action: notify

  - name: CacheHitRateLow
    condition: cache_hit_rate < 0.50
    duration: 30m
    action: notify

  - name: RedisDown
    condition: up{service="redis"} == 0
    duration: 1m
    action: page

  - name: DatabaseDown
    condition: up{service="postgres"} == 0
    duration: 1m
    action: page

  - name: HighRateLimitViolations
    condition: rate(rate_limit_exceeded[5m]) > 10
    duration: 5m
    action: notify
```

## Security Hardening

### API Key Management

```bash
# Rotate API keys regularly
kubectl create secret generic anthropic-api-key \
  --from-literal=ANTHROPIC_API_KEY=sk-ant-v3-... \
  -n learnverse

# Verify no keys in logs
grep -r "sk-ant-" logs/
grep -r "ANTHROPIC" logs/
```

### Input Validation

```typescript
// Validate student questions
function validateQuestion(question: string): boolean {
  if (!question || typeof question !== 'string') return false;
  if (question.length < 3) return false;
  if (question.length > 500) return false;
  
  // Check for malicious patterns
  const malicious = /[\<\>\{\}]/g;
  if (malicious.test(question)) return false;
  
  return true;
}
```

### Rate Limiting by IP

```typescript
// Add IP-based rate limiting in addition to student-based
import rateLimit from 'express-rate-limit';

const ipLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minute
  max: 100                   // 100 requests per minute per IP
});

app.use('/api/tutor/', ipLimiter);
```

### CORS & HTTPS

```typescript
// Enforce HTTPS and CORS
import cors from 'cors';

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true,
  maxAge: 3600
}));

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(`https://${req.header('host')}${req.url}`);
  }
  next();
});
```

### SQL Injection Prevention

```typescript
// Always use parameterized queries
// GOOD ✓
const result = await pool.query(
  'SELECT * FROM tutor_interactions WHERE student_id = $1',
  [studentId]  // Parameter is escaped
);

// BAD ✗
const result = await pool.query(
  `SELECT * FROM tutor_interactions WHERE student_id = '${studentId}'`
);
```

## Backup & Disaster Recovery

### Database Backups

```bash
# Daily automated backup
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz

# Verify backups
ls -lh /backups/db-*.sql.gz

# Test restore
pg_restore -d learnverse_test < /backups/db-20240115.sql
```

### Redis Persistence

```bash
# Enable AOF (Append-Only File) for durability
appendonly yes
appendfsync everysec

# Monitor persistence
INFO persistence

# Backup snapshot
redis-cli BGSAVE
```

### Disaster Recovery Plan

```
1. Database Down
   - Switch to read replica
   - Restore from latest backup
   - Estimated recovery: 5-15 minutes

2. Redis Down
   - Restart Redis instance
   - Cache will rebuild from API calls
   - No data loss if persistence enabled

3. API Key Compromised
   - Rotate ANTHROPIC_API_KEY immediately
   - Audit API usage logs
   - Monitor for unusual activity

4. Complete Data Loss
   - Restore from backup
   - Rebuild cache gradually
   - Notify affected students
```

## Troubleshooting

### Common Issues & Solutions

#### "REDIS_URL not set"
```bash
# Set environment variable
export REDIS_URL=redis://localhost:6379

# Or in .env.production
REDIS_URL=redis://localhost:6379
```

#### "Database connection timeout"
```bash
# Check database connectivity
psql $DATABASE_URL -c "SELECT 1"

# Increase pool size if many connections
DATABASE_POOL_SIZE=50

# Check connection limit
psql -c "SELECT max_conn, used_conn FROM pg_stat_connections"
```

#### "API rate limits exceeded"
```bash
# Check API usage
curl https://api.anthropic.com/v1/usage \
  -H "anthropic-version: 2023-06-01" \
  -H "x-api-key: $ANTHROPIC_API_KEY"

# Implement exponential backoff
const delay = Math.pow(2, retryCount) * 1000;
```

#### "Cache hit rate too low"
```bash
# Analyze cached questions
SELECT question, COUNT(*) as hits 
FROM tutor_interactions 
WHERE cached = true 
GROUP BY question 
ORDER BY hits DESC 
LIMIT 10;

# Increase TTL if beneficial
REDIS_TTL_SECONDS=172800  # 48 hours
```

## Monitoring Dashboard

Create a Grafana dashboard with:
- Questions asked per hour
- Average response time
- Cache hit rate trend
- Rate limit violations
- Error rate
- Redis memory usage
- Database connection count
- API token usage

## Post-Deployment Checklist

After deploying to production:

- [ ] Monitor error rates for first hour
- [ ] Verify rate limiting is working
- [ ] Check cache hit rate (target: 60%+)
- [ ] Test with sample questions
- [ ] Verify database logging
- [ ] Monitor API costs
- [ ] Set up alerts
- [ ] Document deployment in wiki
- [ ] Notify team of deployment
- [ ] Schedule post-mortem review

## Support & Escalation

- **Critical Issues**: Immediate team notification
- **Performance Degradation**: Alert on-call engineer
- **API Errors**: Review logs and recent deployments
- **Contact**: ops@learnverse.dev

## Related Documentation

- [README](./README.md) - System overview
- [API Documentation](./API.md) - Endpoint reference
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues
