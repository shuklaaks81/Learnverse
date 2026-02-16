# Tutor System - Contributing Guide

Guidelines for contributing to the Tutor System module.

## Table of Contents

1. [Getting Set Up](#getting-set-up)
2. [Code Standards](#code-standards)
3. [Architecture Guidelines](#architecture-guidelines)
4. [Testing Requirements](#testing-requirements)
5. [Debugging Tips](#debugging-tips)
6. [Pull Request Process](#pull-request-process)
7. [Common Tasks](#common-tasks)

## Getting Set Up

### Prerequisites

```bash
# Node 18+
node --version

# PostgreSQL 12+
psql --version

# Redis 7+
redis-cli --version
```

### Clone and Install

```bash
# Clone repository
git clone <repo-url>
cd learnverse

# Install dependencies
npm install

# Set up environment
cp .env.example .env.development
# Edit .env.development with local values
```

### Start Development Services

```bash
# Terminal 1: Start Redis
redis-server

# Terminal 2: Start PostgreSQL
postgres -D /usr/local/var/postgres

# Terminal 3: Start development server
npm run dev

# Terminal 4: Run tests (optional)
npm test -- --watch
```

### Verify Setup

```bash
# All of these should work without errors
npm run lint
npm test
npm run build
```

## Code Standards

### TypeScript Rules

**Always use strict types:**
```typescript
// ✅ GOOD
function answerQuestion(options: AnswerQuestionOptions): Promise<TutorResponse> {
  // implementation
}

// ❌ BAD - uses 'any'
function answerQuestion(options: any): any {
  // implementation
}
```

**Use interfaces for public APIs:**
```typescript
// ✅ In tutor-system.ts
export interface TutorResponse {
  answer: string;
  followUpQuestions: string[];
  relatedTopics: string[];
  metadata: ResponseMetadata;
}

// ❌ Avoid inline types for public APIs
export function answerQuestion(
  question: string,
  studentId: string,
  context?: any
): Promise<any>
```

**Handle errors explicitly:**
```typescript
// ✅ GOOD
try {
  const response = await callAPI();
  return response;
} catch (error) {
  if (error instanceof APIError) {
    logger.error('API call failed', { error });
    return fallbackResponse();
  }
  throw error; // Re-throw unknown errors
}

// ❌ BAD
try {
  const response = await callAPI();
  return response;
} catch (error) {
  console.log(error); // Don't just log, handle appropriately
}
```

### Naming Conventions

```typescript
// ✅ GOOD
- Functions: camelCase (getUserHistory, checkRateLimit)
- Constants: UPPER_CASE (DAILY_QUESTION_LIMIT, CACHE_TTL_SECONDS)
- Types/Interfaces: PascalCase (TutorResponse, RateLimitStatus)
- Private methods: _camelCase (shouldCache, _validateInput)
- Files: kebab-case with content (response-cache.ts, rate-limiter.ts)

// ❌ BAD
- Functions: snake_case (get_user_history)
- Constants: camelCase (dailyQuestionLimit)
- Files: camelCase (responseCache.ts)
```

### Code Organization

**Keep modules focused:**
```typescript
// ✅ NOT in response-generator.ts:
// - Caching logic (goes in response-cache.ts)
// - Rate limiting (goes in rate-limiter.ts)
// - Database logging (goes in database-logger.ts)

// ✅ Only in response-generator.ts:
// - Claude API calls
// - Prompt engineering
// - Response formatting
// - Follow-up question generation
```

## Architecture Guidelines

### Module/File Structure

```
src/lib/tutor-system/
├── index.ts              # Main export file
├── tutor-system.ts       # Orchestrator
├── response-generator.ts # Claude API logic
├── response-cache.ts     # Redis cache
├── rate-limiter.ts       # Rate limiting
├── database-logger.ts    # Database operations
├── types.ts              # Type definitions
└── errors.ts             # Custom error classes

src/app/api/tutor/
├── ask/
│   └── route.ts         # POST /api/tutor/ask
├── student/
│   └── [id]/
│       ├── history/
│       │   └── route.ts # GET /api/tutor/student/:id/history
│       └── stats/
│           └── route.ts # GET /api/tutor/student/:id/stats
└── admin/
    └── reset-limits/
        └── route.ts     # POST /api/tutor/admin/reset-limits
```

### Error Handling Pattern

```typescript
// ✅ Create custom errors for context
export class TutorError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'TutorError';
  }
}

export class RateLimitExceededError extends TutorError {
  constructor(resetAt: Date, remaining: number) {
    super(
      'RATE_LIMIT_EXCEEDED',
      `Daily limit reached. Reset at ${resetAt.toISOString()}`,
      429,
      { resetAt, remaining }
    );
  }
}

// ✅ Throw specific errors in modules
throw new RateLimitExceededError(resetTime, remaining);

// ✅ Catch and handle in API routes
try {
  return await answerQuestion(...);
} catch (error) {
  if (error instanceof RateLimitExceededError) {
    return Response.json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    }, { status: error.statusCode });
  }
  // Handle other errors...
}
```

### Async/Await Best Practices

```typescript
// ✅ GOOD - Clear error handling
async function answerQuestion(options: Options): Promise<TutorResponse> {
  try {
    const cached = await getCachedResponse(options.question);
    if (cached) return cached;

    const limited = await checkRateLimit(options.studentId);
    if (!limited) throw new RateLimitExceededError(...);

    const response = await generateResponse(options);
    await cacheResponse(response);
    await logInteraction(options, response);

    return response;
  } catch (error) {
    if (error instanceof TutorError) {
      throw error; // Re-throw known errors
    }
    logger.error('Unexpected error', { error, options });
    throw new TutorError('INTERNAL_ERROR', 'An unexpected error occurred');
  }
}

// ❌ BAD - No error context
async function answerQuestion(options) {
  const response = await generateResponse(options);
  await cacheResponse(response); // Could fail silently
  await logInteraction(options, response); // Might not execute
  return response;
}
```

## Testing Requirements

### Unit Tests

All public functions must have unit tests:

```typescript
// response-cache.test.ts
describe('Response Cache', () => {
  describe('setCachedResponse', () => {
    it('should store response with correct TTL', async () => {
      const response = { answer: 'test', ... };
      await setCachedResponse('question', response, 3600);
      
      const cached = await getCachedResponse('question');
      expect(cached).toEqual(response);
    });

    it('should expire after TTL', async () => {
      // Mock time or use jest.useFakeTimers()
      // Verify response expires
    });

    it('should handle invalid input gracefully', async () => {
      // Test with null, undefined, malformed data
    });
  });
});
```

### Integration Tests

Test component interactions:

```typescript
// tutor-system.test.ts
describe('Tutor System Integration', () => {
  it('should complete full question flow', async () => {
    // 1. Question submitted
    // 2. Cache checked (miss)
    // 3. Rate limit checked (pass)
    // 4. API called
    // 5. Response cached
    // 6. Interaction logged
    // 7. Response returned
    
    const response = await answerQuestion({
      question: 'What is photosynthesis?',
      studentId: 'test-123'
    });
    
    expect(response).toHaveProperty('answer');
    expect(response.metadata.cached).toBe(false);
    
    // Verify database contains log
    const history = await getStudentHistory('test-123');
    expect(history.interactions.length).toBeGreaterThan(0);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific file
npm test response-cache.test.ts

# Run with coverage
npm test -- --coverage

# Watch mode for development
npm test -- --watch
```

### Coverage Requirements

- **Minimum**: 70% line coverage
- **Critical paths**: 90%+ coverage
- **Goal**: Maintain >80% overall

```bash
# View coverage report
npm test -- --coverage
open coverage/index.html
```

## Debugging Tips

### Enable Debug Logging

```bash
# In .env.development
DEBUG=learnverse:tutor:*

# Or for specific modules
DEBUG=learnverse:tutor:response-generator
```

### Browser DevTools

```javascript
// In browser console
// Test API call
const response = await fetch('/api/tutor/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: 'What is gravity?',
    studentId: 'test-123'
  })
});

const data = await response.json();
console.log('Response:', data);

// Check cache stats
const stats = await fetch('/api/tutor/cache/stats').then(r => r.json());
console.log('Cache stats:', stats);
```

### Database Inspection

```bash
# Connect to database
psql $DATABASE_URL

# View recent interactions
SELECT * FROM tutor_interactions 
ORDER BY timestamp DESC 
LIMIT 5;

# Check rate limits
SELECT * FROM rate_limits 
WHERE student_id = 'test-123';

# View cache size
redis-cli INFO memory
```

### API Testing with curl

```bash
# Ask a question
curl -X POST http://localhost:3000/api/tutor/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is gravity?",
    "studentId": "test-123"
  }'

# Get student history
curl http://localhost:3000/api/tutor/student/test-123/history

# Get cache stats
curl http://localhost:3000/api/tutor/cache/stats
```

## Pull Request Process

### Before Creating PR

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/add-voice-input
   ```

2. **Make your changes:**
   - Keep commits focused and well-named
   - One feature per PR
   - Update tests and documentation

3. **Run all checks:**
   ```bash
   npm run lint     # Must pass
   npm test         # All tests pass
   npm run build    # Must compile
   ```

4. **Update documentation:**
   - Update README if needed
   - Add JSDoc comments
   - Update API documentation if endpoints change

### PR Title and Description

**Title format:**
```
[module] Brief description

Examples:
- [tutor] Add voice input support
- [cache] Fix TTL calculation bug
- [rate-limiter] Add student exemptions
```

**Description template:**
```markdown
## Description
Brief explanation of what changed and why.

## Changes
- Change 1
- Change 2
- Change 3

## Testing
How to verify this works:
1. Step 1
2. Step 2

## Screenshots/Logs (if applicable)
Before/after or relevant logs.

## Checklist
- [x] Tests added/updated
- [x] Documentation updated
- [x] Linting passes
- [x] No breaking changes
```

### Code Review Checklist

Before merging, verify:
- [ ] Tests pass locally
- [ ] Code follows style guide
- [ ] No sensitive data in code or logs
- [ ] Error handling covers edge cases
- [ ] Performance is acceptable (no new slowdowns)
- [ ] Documentation is updated
- [ ] Backward compatibility maintained (if applicable)

## Common Tasks

### Add a New Feature

1. **Identify the module:**
   - Cache changes? → `response-cache.ts`
   - Rate limit changes? → `rate-limiter.ts`
   - API changes? → `tutor-system.ts` + API route

2. **Add types:**
   ```typescript
   // In types.ts
   export interface NewFeatureOptions {
     // properties
   }
   ```

3. **Implement in module:**
   ```typescript
   // In appropriate module file
   export async function newFeature(options: NewFeatureOptions) {
     // Implementation
   }
   ```

4. **Export from index:**
   ```typescript
   // In index.ts
   export { newFeature } from './module-file';
   ```

5. **Add tests:**
   ```bash
   # Create test file if needed
   src/__tests__/unit/module-file.test.ts
   ```

6. **Update documentation:**
   - Add to API.md
   - Add example to README.md

### Fix a Bug

1. **Write a test that reproduces the bug:**
   ```typescript
   it('should handle [bug scenario]', async () => {
     // Test that fails before fix
   });
   ```

2. **Fix the code:**
   ```typescript
   // In appropriate file
   // Fix implementation
   ```

3. **Verify test passes:**
   ```bash
   npm test -- --testNamePattern="should handle bug scenario"
   ```

4. **Check for similar bugs:**
   ```bash
   # Search codebase for similar patterns
   grep -r "buggyPattern" src/
   ```

5. **Document the fix:**
   - Add comment explaining why bug occurred
   - Reference issue number if applicable

### Optimize Performance

1. **Benchmark before:**
   ```bash
   npm run benchmark  # If available
   # Or manually time with console.time()
   ```

2. **Make optimization:**
   - Follow optimization best practices
   - Keep changes focused

3. **Benchmark after:**
   ```bash
   npm run benchmark  # Verify improvement
   ```

4. **Document:**
   - Explain what was optimized
   - Show performance improvement %
   - Note any trade-offs (e.g., memory vs speed)

### Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update specific package
npm update package-name

# Run tests to verify compatibility
npm test

# If breaking changes, update code as needed
# Document breaking changes in PR
```

## Code Review Standards

### Good Comments

```typescript
// ✅ GOOD - Explains why, not what
// We cache responses because tutor questions are often repeated.
// The TTL of 24 hours balances freshness with hit rate.
const CACHE_TTL_SECONDS = 86400;

// ❌ BAD - States the obvious
// Set cache TTL to 86400 seconds
const CACHE_TTL_SECONDS = 86400;
```

### Good Commit Messages

```
✅ GOOD:
- "Fix rate limit reset time not respecting UTC timezone"
- "Add caching for frequently asked questions"
- "Improve response generator error handling"

❌ BAD:
- "Fix stuff"
- "Update code"
- "Working version"
```

### Performance Considerations

```typescript
// ✅ Efficient queries
async function getStudentHistory(studentId: string, limit: number) {
  return db.query(
    'SELECT * FROM tutor_interactions WHERE student_id = $1 LIMIT $2',
    [studentId, limit]
  );
}

// ❌ Inefficient (loads all records)
async function getStudentHistory(studentId: string, limit: number) {
  const all = await db.query(
    'SELECT * FROM tutor_interactions WHERE student_id = $1',
    [studentId]
  );
  return all.slice(0, limit);
}
```

## Getting Help

- **Questions?** Check [Troubleshooting](./TROUBLESHOOTING.md)
- **Architecture?** See [Architecture Overview](./ARCHITECTURE.md)
- **API details?** Check [API Documentation](./API.md)
- **How to deploy?** See [Deployment Guide](./DEPLOYMENT.md)

## Useful References

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Redis Commands](https://redis.io/commands)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Claude API Documentation](https://docs.anthropic.com)

---

Thank you for contributing to Learnverse! 🎓
