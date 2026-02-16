# Learnverse Bootstrap Plan ($50/month → 10M students)

## Overview
Transform Learnverse into a self-improving AI-agent-driven platform serving global K-8 students with zero human workforce. This document tracks the Phase 1 implementation.

**Branch:** `bootstrap-ai-agents`
**Timeline:** 4 weeks (Feb 16 - Mar 16, 2026)
**Budget:** $50/month | **Target Users:** 500 by week 4 | **Infrastructure Cost:** $1/month

---

## Phase 1: Bootstrap (Weeks 1-4) — MVP with 3 Core Agents

### Primary Agents
1. **Tutor Agent** (Llama 2 7B) - Real-time student question answering
2. **Content Gen Agent** (Mistral 7B) - Batch lesson generation
3. **Code Agent** (GitHub Copilot) - Autonomous codebase improvements

### Supporting Systems
- **Cache Layer** (SQLite) - Tutor response caching (90% API call reduction)
- **Database** (Railway PostgreSQL) - Lesson storage, progress tracking
- **CI/CD** (GitHub Actions) - Automated testing & deployment

---

## Week 1 Timeline: Infrastructure & Agent 1

### Goals
- ✅ Tutor Agent deployment (Llama 2 7B on free tier)
- ✅ Backend API scaffolding (Railway)
- ✅ Database schema (PostgreSQL)
- ✅ Cache implementation (SQLite for tutor responses)
- ✅ First integration test

### Tasks

#### Day 1: Infrastructure Setup
- [ ] Create `bootstrap-ai-agents` git branch
- [ ] Add infrastructure documentation (`.github/agents/infrastructure-setup.md`)
- [ ] Scaffold backend API handlers
  - [ ] `src/api/tutor.ts` - POST /api/tutor
  - [ ] `src/api/lessons.ts` - GET/POST lessons
  - [ ] `src/api/progress.ts` - Track student progress
- [ ] Setup error logging

**Files to Create:**
- `src/agents/tutor.agent.ts` - Tutor agent orchestration
- `src/utils/llm-client.ts` - LLM API handler
- `src/db/schema.ts` - Database schema definitions

**Status:** 🟡 In Progress

---

#### Day 2-3: Llama 2 Deployment
- [ ] Deploy Llama 2 7B to HuggingFace Spaces
  - Use 4-bit quantization (reduce 13GB → 3.5GB)
  - Test endpoint with sample question
  - Document endpoint URL
- [ ] Implement response caching
  - [ ] SQLite schema for tutor_cache
  - [ ] Cache key: hash(question)
  - [ ] TTL: 30 days
- [ ] Create rate limiter (10 requests/student/day)

**Code to Write:**
```typescript
// src/agents/tutor.agent.ts
export class TutorAgent {
  async generateExplanation(question: string): Promise<string> {
    // Check cache first
    const cached = await this.cacheManager.get(question);
    if (cached) return cached;
    
    // Call Llama 2 on HuggingFace Spaces
    const response = await fetch(process.env.LLAMA_2_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({ prompt: question, max_tokens: 200 })
    });
    
    const explanation = await response.json();
    await this.cacheManager.set(question, explanation);
    return explanation;
  }
}
```

**Status:** 🟤 Pending

---

#### Day 4-5: Database & API Integration
- [ ] Create PostgreSQL schema on Railway
  - [ ] students table
  - [ ] lessons table
  - [ ] progress table
  - [ ] tutor_cache table (SQLite mirror)
- [ ] Implement backend handlers
  - [ ] POST /api/tutor (frontend → tutor agent)
  - [ ] GET /api/lessons/:id
  - [ ] POST /api/progress (log student answers)
- [ ] Test API with Postman/curl

**Status:** 🟤 Pending

---

#### Day 6-7: Integration & Testing
- [ ] Wire Tutor Agent to frontend
  - [ ] Create `/kid/tutor` page (Q&A interface)
  - [ ] Add "Ask Tutor" button to lessons
  - [ ] Display tutor responses
- [ ] Test with 10 sample questions
- [ ] Measure: Response time, cache hit ratio, sentiment
- [ ] Document findings

**Status:** 🟤 Pending

---

### Deliverables (Week 1)
- [ ] Tutor Agent fully operational
- [ ] Backend API endpoints tested
- [ ] Performance baseline: < 3s response time
- [ ] Cache efficiency: 80%+ hit ratio for repeated questions
- [ ] Documentation: Agent setup guide

---

## Week 2 Timeline: Content Agent + Expansion

### Goals
- ✅ Content Generation Agent (Mistral 7B batch)
- ✅ First 100 lessons generated
- ✅ Manual quality review process
- ✅ Analytics Agent foundation

### Tasks

#### Day 1-2: Content Gen Agent Development
- [ ] Deploy Mistral 7B (free CPU tier on HF or local)
- [ ] Create batch generation script
  - Input: Curriculum standard + grade
  - Output: Lesson JSON (title, content, examples, 5 questions)
  - Frequency: Weekly overnight batch
- [ ] Implement quality self-critique
  - Check: No math errors, clear explanations
  - Validate: JSON schema compliance

**Code Template:**
```python
# scripts/generate_lessons.py
from transformers import AutoTokenizer, AutoModelForCausalLM
import json

CURRICULUM = [
  "CCSS.MATH.3.OA.A.1",  # 3rd grade addition/subtraction
  "CCSS.ELA-LITERACY.RL.3.1",  # Read literature
  # ... 50+ standards
]

for standard in CURRICULUM:
  prompt = f"""Generate a lesson for {standard}.
  Output JSON with: title, grade, content, 2 examples, 5 quiz questions."""
  
  lesson = generate(prompt)
  validate_schema(lesson)
  save_to_db(lesson)
```

**Status:** 🟤 Pending

---

#### Day 3-4: Lesson Generation Batch
- [ ] Generate 100 lessons
  - 40 Math lessons (K-5)
  - 30 ELA lessons (K-5)
  - 30 Science lessons (K-5)
- [ ] Manual review: Sample 5 lessons, iterate on prompts
- [ ] Store in PostgreSQL lessons table
- [ ] Update frontend: lessons list auto-populated

**Success Metric:** 95%+ of generated lessons are usable (students don't skip)

**Status:** 🟤 Pending

---

#### Day 5-7: Analytics Foundation
- [ ] Create Analytics Agent (DuckDB-based)
- [ ] Daily metrics calculation:
  - DAU (daily active users)
  - Lesson completion rate
  - Tutor questions asked
  - Average student accuracy
- [ ] Generate sample reports
- [ ] Setup email delivery (SendGrid free tier)

**Status:** 🟤 Pending

---

### Deliverables (Week 2)
- [ ] 100+ lessons in database
- [ ] Lesson list functional in UI
- [ ] Analytics dashboard (backend ready)
- [ ] Quality review process documented
- [ ] Content generation automated

---

## Week 3 Timeline: Automation & Polish

### Goals
- ✅ GitHub Actions CI/CD (automated testing)
- ✅ Code Agent setup (Copilot issue → PR)
- ✅ Performance optimization
- ✅ Security audit

### Tasks

#### Day 1-2: GitHub Actions Setup
- [ ] Create `.github/workflows/test.yml`
  - Lint: ESLint, TypeScript
  - Test: Jest unit tests
  - Build: Next.js production build
- [ ] Create `.github/workflows/deploy.yml`
  - Test → Deploy to Vercel staging
  - Monitor 5 min → Promote to production
- [ ] Test with sample PR

**Status:** 🟤 Pending

---

#### Day 3-4: Code Agent & Issue Management
- [ ] Setup Copilot GitHub integration
- [ ] Create issue templates
  - `feature` - New feature request (→ Copilot generates code)
  - `bug` - Bug report (→ Copilot generates fix)
  - `performance` - Optimization task
- [ ] Test: Submit sample issue, watch Copilot create PR

**Status:** 🟤 Pending

---

#### Day 5-7: Testing & Security
- [ ] Unit test coverage: 80%+ (Jest)
- [ ] E2E tests: Critical user journeys (Playwright)
- [ ] Performance tests: Lighthouse > 85 score
- [ ] Security scan: No vulnerabilities
- [ ] Accessibility test: WCAG 2.1 AA

**Status:** 🟤 Pending

---

### Deliverables (Week 3)
- [ ] Full CI/CD pipeline functional
- [ ] Code Agent (Copilot) integrated
- [ ] < 2s page load time
- [ ] 80%+ test coverage
- [ ] Security baseline established

---

## Week 4 Timeline: Launch Preparation

### Goals
- ✅ Public launch to ProductHunt / Twitter
- ✅ Invite first 100 beta users
- ✅ Monitor performance in production
- ✅ Collect user feedback

### Tasks

#### Day 1-2: Monitoring Setup
- [ ] Sentry for error tracking
  - Frontend errors logged
  - Backend exceptions tracked
  - Real-time alerts for critical issues
- [ ] Performance monitoring
  - Page load times
  - API response times
  - Tutor latency
- [ ] uptime.com status page

**Status:** 🟤 Pending

---

#### Day 3-4: Marketing & Invites
- [ ] ProductHunt launch post
- [ ] Twitter/LinkedIn announcement
- [ ] Invite 100 beta testers
  - Friends and family
  - Education forums (Reddit, Twitter EdTech)
  - Email contacts from previous projects
- [ ] Create feedback form (Typeform)

**Status:** 🟤 Pending

---

#### Day 5-7: Post-Launch Support
- [ ] Monitor errors & performance 24/7
- [ ] Respond to user feedback
- [ ] Bug fixes (expedited via Copilot)
- [ ] Collect NPS (Net Promoter Score)
- [ ] Weekly report: DAU, engagement, churn

**Success Metrics:**
- 100-500 students signed up
- 40%+ weekly retained
- NPS > 30
- 99%+ uptime
- < 3s median response time

**Status:** 🟤 Pending

---

## Budget Breakdown (Phase 1)

| Component | Tier | Cost/Month | Notes |
|-----------|------|-----------|-------|
| Vercel (Frontend) | Free | $0 | Already deployed |
| Railway (Backend + DB) | Free | $0 | 500 requests/month, 5GB DB |
| HuggingFace (Llama 2) | Free GPU | $0 | ~50 reqs/month, enough with caching |
| Mistral (Content Gen) | Free CPU | $0 | Batch only, overnight |
| SendGrid (Email) | Free | $0 | 100 emails/day limit |
| Sentry (Monitoring) | Free | $0 | 100 errors/month |
| Domain | Yearly | $12/year | Amortized to $1/month |
| **Total** | | **$1/month** | Remaining $49 = buffer |

---

## Success Metrics (Phase 1)

### Technical
- [ ] Tutor Agent: < 5s response time, 80%+ cache hit
- [ ] Content: 400+ lessons, 95% quality
- [ ] Uptime: 99%+
- [ ] Test coverage: 80%+

### User
- [ ] 500 students by week 4
- [ ] 40%+ weekly retention
- [ ] 10+ tutor questions asked per user
- [ ] 85%+ lesson completion rate
- [ ] NPS > 30

### Operational
- [ ] Zero manual intervention needed (agents autonomous)
- [ ] All commits via GitHub Actions / Copilot
- [ ] Daily agent health checks
- [ ] Weekly reports automated

---

## Transition to Phase 2 (Month 2)

When we hit 1K users:
- Upgrade Railway to $5/mo paid tier
- Add better GPU for Tutor Agent ($10/mo)
- Implement caching redis instance ($2/mo)
- Add monitoring & observability ($10/mo)
- Total: $100/month for 1K users ($0.10/user)

See `bootstrap-plan-phase2.md` for details.

---

## Notes & Assumptions

**Assumptions:**
- Students can read and type (age 7+)
- Internet access available (async offline planned later)
- English language only initially
- Single-device tracking (no sync yet)

**Risks:**
- LLM quality inconsistency (mitigated by cache + sample review)
- Infrastructure free tier limits (mitigated by caching, batching)
- Content generation hallucinations (mitigated by validation + feedback loop)

**Contingencies:**
- If Tutor Agent too slow → Use smaller model (Phi-2 3B)
- If cost exceeds $50 → Reduce LLM calls, increase caching
- If LLM unavailable → Fallback to regex-based explanations

---

## Status Summary

| Component | Status | Owner | Due |
|-----------|--------|-------|-----|
| Branch Creation | 🟡 In Progress | Amit | Today |
| Tutor Agent Setup | 🟤 Pending | Copilot + Amit | Week 1 |
| Content Gen Agent | 🟤 Pending | Copilot | Week 2 |
| CI/CD Pipeline | 🟤 Pending | GitHub Actions | Week 3 |
| Public Launch | 🟤 Pending | Amit + Community | Week 4 |

---

## Contacts & Resources

- **Llama 2 Docs:** https://huggingface.co/meta-llama/Llama-2-7b-chat-hf
- **Mistral Setup:** https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.1
- **Railway Docs:** https://railway.app/docs
- **GitHub Copilot:** https://github.com/features/copilot
- **Next.js 16:** https://nextjs.org/docs

---

**Last Updated:** Feb 16, 2026 | **Next Review:** Mar 1, 2026
