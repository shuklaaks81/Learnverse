# Tutor System API Documentation

Complete API documentation for the Tutor System endpoints and module functions.

## Table of Contents

1. [REST API Endpoints](#rest-api-endpoints)
2. [TypeScript Module Functions](#typescript-module-functions)
3. [Data Types & Schemas](#data-types--schemas)
4. [Error Responses](#error-responses)
5. [Rate Limit Headers](#rate-limit-headers)
6. [Examples](#examples)

## REST API Endpoints

### POST /api/tutor/ask

Ask a question to the AI tutor.

**Request:**
```bash
curl -X POST https://your-app/api/tutor/ask \
  -H "Content-Type: application/json" \
  -d {
    "question": "What is the water cycle?",
    "studentId": "student-123",
    "context": {
      "gradeLevel": "middle-school",
      "subject": "science"
    }
  }
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| question | string | Yes | The student's question (1-500 chars) |
| studentId | string | Yes | Unique student identifier |
| context | object | No | Optional context for better responses |
| context.gradeLevel | string | No | Grade/level (elementary, middle-school, high-school) |
| context.subject | string | No | Subject area (math, science, history, etc.) |
| context.previousTopics | string[] | No | Previously discussed topics for continuity |

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "answer": "The water cycle is the continuous movement of water on Earth...",
    "followUpQuestions": [
      "How does evaporation work?",
      "What is condensation?",
      "Where does precipitation occur?"
    ],
    "relatedTopics": [
      "weather systems",
      "climate",
      "groundwater"
    ],
    "metadata": {
      "cached": false,
      "latencyMs": 1245,
      "model": "claude-3-5-haiku",
      "tokensUsed": 342,
      "timestamp": 1640000000000
    }
  }
}
```

**Status Codes:**
- `200 OK` - Successful response
- `400 Bad Request` - Invalid parameters
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

### GET /api/tutor/student/:studentId/history

Retrieve a student's conversation history.

**Request:**
```bash
curl https://your-app/api/tutor/student/student-123/history?limit=20&offset=0
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | integer | 20 | Number of records to return (1-100) |
| offset | integer | 0 | Pagination offset |
| sortBy | string | timestamp-desc | Sort field: timestamp-asc, timestamp-desc, question |
| fromDate | number | - | Timestamp in ms (filter results after date) |
| toDate | number | - | Timestamp in ms (filter results before date) |

**Response:**
```json
{
  "success": true,
  "data": {
    "studentId": "student-123",
    "totalCount": 47,
    "interactions": [
      {
        "id": "interaction-1",
        "question": "What is photosynthesis?",
        "answerPreview": "Photosynthesis is the process by which plants...",
        "cached": false,
        "latencyMs": 2341,
        "timestamp": 1640000000000,
        "subject": "biology"
      },
      {
        "id": "interaction-2",
        "question": "What are mitochondria?",
        "answerPreview": "Mitochondria are the powerhouse of the cell...",
        "cached": true,
        "latencyMs": 45,
        "timestamp": 1640000001000,
        "subject": "biology"
      }
    ]
  }
}
```

---

### GET /api/tutor/student/:studentId/stats

Get a student's tutor usage statistics.

**Request:**
```bash
curl https://your-app/api/tutor/student/student-123/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "studentId": "student-123",
    "today": {
      "questionsAsked": 3,
      "questionsRemaining": 7,
      "resetAt": "2024-01-15T00:00:00Z"
    },
    "thisWeek": {
      "totalQuestions": 23,
      "uniqueSubjects": 4,
      "averageResponseTime": 1250
    },
    "allTime": {
      "totalQuestions": 247,
      "uniqueSubjects": 12,
      "topSubjects": [
        { "subject": "biology", "questions": 67 },
        { "subject": "chemistry", "questions": 45 }
      ],
      "cacheHitRate": 0.72,
      "firstQuestion": 1635000000000,
      "lastQuestion": 1640000000000
    }
  }
}
```

---

### GET /api/tutor/cache/stats

Monitor cache performance (admin endpoint).

**Request:**
```bash
curl https://your-app/api/tutor/cache/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cacheSize": 347,
    "maxSize": 1000,
    "hitRate": 0.76,
    "evictions": 12,
    "memoryUsage": "2.3 MB",
    "topCachedQuestions": [
      {
        "question": "What is photosynthesis?",
        "hits": 23,
        "lastAccessed": 1640000000000
      }
    ]
  }
}
```

---

### POST /api/tutor/admin/reset-limits

Reset rate limits for a student (admin only).

**Request:**
```bash
curl -X POST https://your-app/api/tutor/admin/reset-limits \
  -H "Content-Type: application/json" \
  -d {
    "studentId": "student-123",
    "apiKey": "your-admin-key"
  }
```

**Response:**
```json
{
  "success": true,
  "message": "Rate limit reset for student-123"
}
```

---

## TypeScript Module Functions

### Core Module

```typescript
import {
  answerQuestion,
  getStudentHistory,
  getStudentStats,
  checkRateLimit
} from '@/lib/tutor-system';
```

#### `answerQuestion(options)`

Generate a tutor response to a student question.

**Type Signature:**
```typescript
type AnswerQuestionOptions = {
  question: string;           // 1-500 characters
  studentId: string;          // Student identifier
  context?: {
    gradeLevel?: string;
    subject?: string;
    previousTopics?: string[];
  };
};

type TutorResponse = {
  answer: string;
  followUpQuestions: string[];
  relatedTopics: string[];
  metadata: {
    cached: boolean;
    latencyMs: number;
    model: string;
    tokensUsed: number;
    timestamp: number;
  };
};

function answerQuestion(
  options: AnswerQuestionOptions
): Promise<TutorResponse>;
```

**Examples:**
```typescript
// Simple question
const response = await answerQuestion({
  question: 'What is gravity?',
  studentId: 'student-123'
});

// With context
const response = await answerQuestion({
  question: 'Explain photosynthesis',
  studentId: 'student-123',
  context: {
    gradeLevel: 'high-school',
    subject: 'biology',
    previousTopics: ['cellular respiration', 'ATP']
  }
});
```

---

#### `getStudentHistory(studentId, options)`

Retrieve a student's conversation history.

**Type Signature:**
```typescript
type HistoryOptions = {
  limit?: number;              // Default: 20
  offset?: number;             // Default: 0
  sortBy?: 'timestamp-asc' | 'timestamp-desc' | 'question';
  fromDate?: number;           // Timestamp in ms
  toDate?: number;             // Timestamp in ms
};

type HistoryItem = {
  id: string;
  question: string;
  answerPreview: string;
  cached: boolean;
  latencyMs: number;
  timestamp: number;
  subject?: string;
};

type HistoryResult = {
  studentId: string;
  totalCount: number;
  interactions: HistoryItem[];
};

function getStudentHistory(
  studentId: string,
  options?: HistoryOptions
): Promise<HistoryResult>;
```

**Examples:**
```typescript
// Get recent history (default)
const history = await getStudentHistory('student-123');

// Get last 100 items
const history = await getStudentHistory('student-123', {
  limit: 100
});

// Get history from specific date range
const history = await getStudentHistory('student-123', {
  fromDate: new Date('2024-01-01').getTime(),
  toDate: new Date('2024-01-31').getTime()
});
```

---

#### `getStudentStats(studentId)`

Get usage statistics for a student.

**Type Signature:**
```typescript
type StudentStats = {
  studentId: string;
  today: {
    questionsAsked: number;
    questionsRemaining: number;
    resetAt: string;  // ISO timestamp
  };
  thisWeek: {
    totalQuestions: number;
    uniqueSubjects: number;
    averageResponseTime: number;
  };
  allTime: {
    totalQuestions: number;
    uniqueSubjects: number;
    topSubjects: Array<{ subject: string; questions: number }>;
    cacheHitRate: number;
    firstQuestion: number;
    lastQuestion: number;
  };
};

function getStudentStats(studentId: string): Promise<StudentStats>;
```

---

#### `checkRateLimit(studentId)`

Check if student has questions remaining today.

**Type Signature:**
```typescript
type RateLimitStatus = {
  allowed: boolean;
  questionsUsed: number;
  questionsRemaining: number;
  resetAt: string;  // ISO timestamp
  dailyLimit: number;
};

function checkRateLimit(
  studentId: string
): Promise<RateLimitStatus>;
```

**Examples:**
```typescript
const status = await checkRateLimit('student-123');

if (!status.allowed) {
  console.log(
    `Rate limit reached. ` +
    `${status.questionsRemaining} questions remaining. ` +
    `Resets at ${status.resetAt}`
  );
}
```

---

### Response Cache Module

```typescript
import {
  getCachedResponse,
  setCachedResponse,
  invalidateCache,
  getCacheStats
} from '@/lib/tutor-system/response-cache';
```

#### `getCachedResponse(question, studentId)`

Retrieve a cached response if available.

**Type Signature:**
```typescript
function getCachedResponse(
  question: string,
  studentId: string
): Promise<TutorResponse | null>;
```

---

#### `setCachedResponse(question, response, ttl)`

Store a response in cache.

**Type Signature:**
```typescript
function setCachedResponse(
  question: string,
  response: TutorResponse,
  ttl: number  // seconds
): Promise<void>;
```

---

### Rate Limiter Module

```typescript
import {
  recordQuestion,
  getRemainingQuestions,
  resetLimits
} from '@/lib/tutor-system/rate-limiter';
```

#### `recordQuestion(studentId)`

Track a question for rate limiting.

**Type Signature:**
```typescript
function recordQuestion(studentId: string): Promise<void>;
```

---

#### `getRemainingQuestions(studentId)`

Get daily remaining question count.

**Type Signature:**
```typescript
function getRemainingQuestions(studentId: string): Promise<number>;
```

---

## Data Types & Schemas

### TutorResponse

```typescript
interface TutorResponse {
  answer: string;                    // Main response text
  followUpQuestions: string[];        // Suggested next questions
  relatedTopics: string[];            // Related topics for exploration
  metadata: {
    cached: boolean;                 // From cache or fresh API call
    latencyMs: number;               // Response time
    model: string;                   // Model used (claude-3-5-haiku)
    tokensUsed: number;              // Token count
    timestamp: number;               // Unix timestamp in ms
  };
}
```

### StudentContext

```typescript
interface StudentContext {
  gradeLevel?: 'elementary' | 'middle-school' | 'high-school' | 'college';
  subject?: string;                  // biology, chemistry, math, history, etc.
  previousTopics?: string[];         // For contextual continuity
}
```

### InteractionLog

```typescript
interface InteractionLog {
  id: string;
  studentId: string;
  question: string;
  answer: string;
  answerPreview: string;             // First 500 chars
  cached: boolean;
  latencyMs: number;
  tokensUsed: number;
  timestamp: number;
  metadata: Record<string, any>;
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You've reached your daily limit of 10 questions.",
    "details": {
      "questionsUsed": 10,
      "dailyLimit": 10,
      "resetAt": "2024-01-16T00:00:00Z"
    }
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|---------|-------------|
| `INVALID_QUESTION` | 400 | Question is empty or too long |
| `INVALID_STUDENT_ID` | 400 | Student ID is missing or invalid |
| `RATE_LIMIT_EXCEEDED` | 429 | Student has reached daily question limit |
| `API_ERROR` | 500 | Claude API call failed |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `CACHE_ERROR` | 500 | Cache operation failed |
| `UNAUTHORIZED` | 401 | Admin endpoint requires valid API key |

---

## Rate Limit Headers

All responses include rate limit information:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1640000000000
X-RateLimit-ResetAt: 2024-01-15T00:00:00Z
```

---

## Examples

### Example 1: Simple Q&A Flow

```typescript
async function tutorSession() {
  const studentId = 'student-123';

  // Check if student can ask questions
  const status = await checkRateLimit(studentId);
  if (!status.allowed) {
    console.log('Daily limit reached');
    return;
  }

  // Ask question
  const response = await answerQuestion({
    question: 'What is photosynthesis?',
    studentId
  });

  console.log('Answer:', response.answer);
  console.log('Follow-ups:', response.followUpQuestions);
}
```

### Example 2: Building a Chatbot

```typescript
function TutorChat({ studentId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleQuestion = async () => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: input }]);

    // Get response
    const response = await answerQuestion({
      question: input,
      studentId
    });

    // Add tutor message
    setMessages(prev => [...prev, {
      role: 'tutor',
      text: response.answer,
      followUps: response.followUpQuestions
    }]);

    setInput('');
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.text}</div>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={handleQuestion}>Ask</button>
    </div>
  );
}
```

### Example 3: Tracking Learning Progress

```typescript
async function viewStudentProgress(studentId) {
  // Get statistics
  const stats = await getStudentStats(studentId);

  console.log('Questions asked today:', stats.today.questionsAsked);
  console.log('Questions remaining:', stats.today.questionsRemaining);
  console.log('Top subjects:', stats.allTime.topSubjects);
  console.log('Cache hit rate:', (stats.allTime.cacheHitRate * 100).toFixed(1) + '%');

  // Get recent interactions
  const history = await getStudentHistory(studentId, { limit: 5 });

  console.log('Recent questions:');
  history.interactions.forEach(interaction => {
    console.log(`  - ${interaction.question} (cached: ${interaction.cached})`);
  });
}
```

---

## Deployment

See [Deployment Guide](./DEPLOYMENT.md) for production setup instructions.
