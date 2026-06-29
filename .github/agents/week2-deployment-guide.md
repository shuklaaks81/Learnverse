# Phase 1 Week 2-4: Deployment & Production Setup Guide

## Timeline: February 20 - March 6, 2026

---

## Week 2: Infrastructure Deployment

### Day 1-2: HuggingFace Spaces Llama 2 7B Deployment

#### Step 1: Create HuggingFace Account
1. Go to https://huggingface.co/join
2. Sign up with email (free account)
3. Create API token: Settings → Access Tokens → New Token (write permission)
4. Save token: Will need for authentication

#### Step 2: Create New Space
1. Go to https://huggingface.co/spaces
2. Click "Create New Space"
3. Configuration:
   - **Name:** `tutor-llama2-learnverse`
   - **License:** OpenRAIL-M (allows commercial use)
   - **Space SDK:** Docker
   - **Visibility:** Public (free tier requires public)
4. Click "Create Space"

#### Step 3: Deploy Dockerfile + Dependencies

Replace the default Dockerfile with:

```dockerfile
# Use NVIDIA CUDA base image with Python 3.10
FROM nvidia/cuda:12.2.0-cudnn8-devel-ubuntu22.04

WORKDIR /app

# Install Python and dependencies
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app.py .

# Expose port (HuggingFace will map through load balancer)
EXPOSE 7860

# Run Gradio app
CMD ["python3", "app.py"]
```

**requirements.txt:**
```
transformers==4.36.2
torch==2.1.1
gradio==4.14.0
accelerate==0.24.1
bitsandbytes==0.42.0
numpy==1.24.3
```

#### Step 4: Deploy Application Code

Create `app.py`:

```python
#!/usr/bin/env python3
"""
Learnverse AI Tutor - Llama 2 7B with 4-bit Quantization
Runs on HuggingFace Spaces Free GPU (50 req/month free)
"""

import gradio as gr
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global model/tokenizer (loaded once at startup)
MODEL = None
TOKENIZER = None

def load_model():
    """Load Llama 2 7B with 4-bit quantization (3.5GB)"""
    global MODEL, TOKENIZER
    
    logger.info("Loading Llama 2 7B-Chat (4-bit quantized)...")
    
    model_id = "meta-llama/Llama-2-7b-chat-hf"
    
    # 4-bit quantization config
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type='nf4',
        bnb_4bit_use_double_quant=True,
        bnb_4bit_compute_dtype=torch.bfloat16,
    )
    
    # Load model with quantization
    MODEL = AutoModelForCausalLM.from_pretrained(
        model_id,
        quantization_config=bnb_config,
        device_map='auto',
        trust_remote_code=True,
        torch_dtype=torch.bfloat16,
    )
    
    TOKENIZER = AutoTokenizer.from_pretrained(model_id)
    TOKENIZER.pad_token = TOKENIZER.eos_token
    
    logger.info("✅ Model loaded successfully")
    return MODEL, TOKENIZER

def tutor_response(question: str) -> str:
    """
    Answer student question with age-appropriate explanation.
    Optimized for grades 3-5 (8-10 year olds).
    """
    if not question.strip():
        return "Please ask me a question! 📚"
    
    try:
        # Build prompt for Llama 2 Chat
        system_prompt = """You are an enthusiastic, patient AI tutor for 3rd-5th grade students.
Your job is to explain concepts in simple, fun language using everyday examples.
Keep responses to 2-3 sentences maximum. Use emojis and encourage curiosity!"""
        
        prompt = f"""[INST] <<SYS>>
{system_prompt}
<</SYS>>

Student Question: {question}
[/INST]"""
        
        # Tokenize and generate
        inputs = TOKENIZER(prompt, return_tensors='pt')
        
        with torch.no_grad():
            outputs = MODEL.generate(
                **inputs,
                max_new_tokens=150,
                temperature=0.7,
                top_p=0.95,
                top_k=50,
                do_sample=True,
                repetition_penalty=1.2,
            )
        
        response = TOKENIZER.decode(
            outputs[0][inputs['input_ids'].shape[1]:],
            skip_special_tokens=True
        ).strip()
        
        return response or "Great question! Keep learning! 🌟"
        
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        return f"Oops! I hit a snag. Try asking again! 🤔"

# Load model at startup
load_model()

# Gradio Interface
with gr.Blocks(title="Learnverse AI Tutor") as demo:
    gr.Markdown("# 🧑‍🏫 Learnverse AI Tutor")
    gr.Markdown("Ask me anything about your lessons!")
    
    with gr.Row():
        question = gr.Textbox(
            label="Your Question",
            placeholder="What is 1/2 + 1/4?",
            lines=2,
        )
    
    with gr.Row():
        submit_btn = gr.Button("Ask Tutor", variant="primary")
        clear_btn = gr.Button("Clear")
    
    answer = gr.Textbox(label="Tutor Response", interactive=False, lines=3)
    
    # Event handlers
    submit_btn.click(
        fn=tutor_response,
        inputs=[question],
        outputs=[answer],
    )
    
    clear_btn.click(
        fn=lambda: ("", ""),
        outputs=[question, answer],
    )
    
    # Example questions
    gr.Examples(
        examples=[
            ["What is 1/2 + 1/4?"],
            ["How do photosynthesis work?"],
            ["What is a noun?"],
            ["Why is the sky blue?"],
        ],
        inputs=[question],
    )

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860, share=False)
```

#### Step 5: Commit to HuggingFace Space
1. In HuggingFace Space editor:
   - Create file `Dockerfile` → paste Dockerfile above
   - Create file `requirements.txt` → paste requirements above
   - Create file `app.py` → paste app.py above
2. Commit files
3. HuggingFace auto-builds → takes 5-10 minutes
4. When complete, you'll get public URL: `https://[username]-tutor-llama2-learnverse.hf.space`

#### Step 6: Test Deployment
```bash
# Test the Gradio API endpoint
curl -X POST https://[username]-tutor-llama2-learnverse.hf.space/api/predict \
  -H "Content-Type: application/json" \
  -d '{"data":["What is 1+1?"]}'

# Expected response (within 5 seconds):
# {"data":["1 + 1 = 2! Great question, young mathematician! 🧮"]}
```

#### Step 7: Update Environment
Edit `.env.local`:
```env
NEXT_PUBLIC_TUTOR_ENDPOINT=https://[username]-tutor-llama2-learnverse.hf.space/api/predict
```

---

### Day 3-5: Railway PostgreSQL Setup

#### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up (free tier includes $5/month credit)
3. Create new project

#### Step 2: Add PostgreSQL Plugin
1. Click "Add Service"
2. Select "PostgreSQL"
3. Wait for deployment (~2 minutes)
4. Get connection string from "Connect" tab

#### Step 3: Create Schema

Save as `schema.sql`:

```sql
-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kid_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  grade INT DEFAULT 3,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_kid_id (kid_id)
);

-- Tutor cache (avoid duplicate API calls)
CREATE TABLE tutor_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_hash VARCHAR(64) UNIQUE NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days'),
  INDEX idx_expires (expires_at),
  INDEX idx_hash (question_hash)
);

-- Tutor interaction logs
CREATE TABLE tutor_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer_preview TEXT,
  response_time_ms INT,
  cached BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_student_created (student_id, created_at),
  INDEX idx_created (created_at)
);

-- Daily metrics
CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  total_questions INT DEFAULT 0,
  unique_students INT DEFAULT 0,
  avg_response_time_ms INT DEFAULT 0,
  cache_hit_rate FLOAT DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_date (date)
);

-- Performance indexes
CREATE INDEX idx_tutor_logs_student ON tutor_logs(student_id);
CREATE INDEX idx_tutor_logs_day ON tutor_logs(DATE(created_at));
```

#### Step 4: Deploy Schema

```bash
# Install psql client (macOS)
brew install postgresql

# Connect to Railway PostgreSQL
psql [DATABASE_URL from Railway]

# Run schema
\i schema.sql

# Verify tables
\dt
```

#### Step 5: Update Environment
Edit `.env.local`:
```env
DATABASE_URL=[Full connection string from Railway]
```

---

### Day 6-7: Frontend Integration & Testing

#### Step 1: Update TutorChat Component

Modify `src/components/TutorChat.tsx` to handle real API:

```tsx
// Replace the mock fetch with real API call
const response = await fetch('/api/tutor', {
  method: 'POST',
  body: JSON.stringify({
    question: input.trim(),
    studentId: studentId || 'demo-user',
  }),
  headers: { 'Content-Type': 'application/json' },
});

// The API will now call HuggingFace endpoint
```

#### Step 2: Test Tutor
1. Start dev server: `npm run dev`
2. Navigate to `/kid/tutor`
3. Ask question: "What is 1/2 + 1/4?"
4. Verify:
   - ✅ Response comes back within 5 seconds
   - ✅ Cache badge appears on second question
   - ✅ Rate limit after 10 questions
   - ✅ Logs appear in browser console

#### Step 3: Monitor Performance
```bash
# Check API stats every 30 seconds
while true; do
  curl http://localhost:3000/api/tutor/stats
  echo -e "\n---\n"
  sleep 30
done
```

**Expected output:**
```json
{
  "totalRequests": 5,
  "cacheHits": 1,
  "cacheMisses": 4,
  "hitRate": "20.0%",
  "cacheSize": 4
}
```

---

## Week 3: Analytics & Monitoring

### Day 1-3: Analytics Agent Implementation

Create `src/agents/analytics.agent.ts`:

```typescript
import { DuckDB } from '@duckdb/wasm';

export class AnalyticsAgent {
  private db: DuckDB;
  
  async getDailyMetrics(date: Date) {
    // Query tutor_logs for the day
    // Calculate: questions, unique students, avg response time, cache hit rate
    // Return JSON for dashboard
  }
  
  async identifyAtRiskStudents() {
    // Find students with < 30% retention
    // Package for parent notification
  }
  
  async trackEngagementTrends() {
    // Weekly cohort analysis
    // Predict churn 7 days out
  }
}
```

### Day 4-5: Sentry Error Tracking

1. Create Sentry account: https://sentry.io
2. Create new project (Next.js)
3. Get DSN (looks like: `https://xxx@sentry.io/123456`)
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SENTRY_DSN=https://...
   ```
5. Configure Sentry client in `src/app/layout.tsx`

### Day 6-7: Monitoring Dashboard

Create `src/app/lab/monitoring.tsx`:
- Real-time request/response metrics
- Cache performance visualization
- Error rate tracking
- User engagement sparklines

---

## Week 4: Launch & Beta Testing

### Day 1-2: ProductHunt Launch
- Create post showcasing AI Tutor
- Highlight: Free, no database required, works offline
- Launch in "Show HN" discussion

### Day 3-4: Beta Tester Onboarding
- Invite 100 users (friends, Twitter followers, Product Hunt)
- Provide feedback form
- Monitor NPS (target: > 30)
- Collect usage patterns

### Day 5-6: Monitoring & Iteration
- 24/7 monitoring activated
- Respond to bugs/feedback within 2 hours
- Collect LLM prompt improvements
- Monitor cost (target: < $10/month)

### Day 7: Phase 2 Planning
- Analyze beta feedback
- Plan Phase 2 features:
  - Parent dashboards
  - Teacher content management
  - Adaptive difficulty
  - Fine-tuned LLM on curriculum

---

## Success Criteria

### Week 2 (Infrastructure)
- ✅ Llama 2 7B live on HuggingFace Spaces
- ✅ Endpoint responds < 5 seconds
- ✅ PostgreSQL schema created & populated
- ✅ 10 test questions cached & retrieved

### Week 3 (Analytics)
- ✅ Daily metrics dashboard live
- ✅ Sentry tracking 100% error coverage
- ✅ Analytics displaying on `/lab/monitoring`
- ✅ Zero manual database interventions

### Week 4 (Launch)
- ✅ 100+ beta testers active
- ✅ NPS > 30 from feedback
- ✅ < 0.5% error rate
- ✅ Uptime > 99.5%

---

## Troubleshooting

### HuggingFace Space Build Fails
- Check Docker syntax
- Verify all requirements.txt packages exist
- Check CUDA compatibility for GPU tier
- Read build logs carefully

### PostgreSQL Connection Timeout
- Verify DATABASE_URL format
- Check IP whitelist (Railway auto-allows all)
- Test with `psql [URL]` first
- Ensure schema is fully deployed

### Tutor Response Slow
- Check HuggingFace Space status page
- Verify CUDA memory available
- Reduce max_new_tokens (currently 150)
- Consider model quantization tuning

### Rate Limit Not Working
- Verify studentId being passed to API
- Check browser localStorage for currentKid
- Monitor Map<studentId, timestamp[]> in memory
- Add logging to rate limit function

---

## Cost Tracking

| Service | Phase 1 | Phase 2 | Phase 3 |
|---------|---------|---------|---------|
| Vercel | Free* | Free* | $20/mo |
| HF Spaces | Free (50 req/mo) | $10/mo | $50/mo |
| Railway PostgreSQL | Free (5GB) | Free (5GB) | $5-20/mo |
| SendGrid Email | Free (100/day) | Free (100/day) | $15/mo |
| Sentry Monitoring | Free (100 err/mo) | $29/mo | $29/mo |
| Domain | $0 | $12/year | $12/year |
| **Total** | **$1** | **$25** | **$115+** |

*Free tier bandwidth: 100GB/month (adequate for launch)

---

## Deployment Checklist

- [ ] HuggingFace Spaces account created
- [ ] Llama 2 7B Space deployed
- [ ] Model loads within 2 minutes
- [ ] API endpoint responds to test curl
- [ ] Response time < 5 seconds
- [ ] Railway PostgreSQL created
- [ ] Schema deployed (8 tables)
- [ ] Test data inserted
- [ ] `.env.local` updated with both endpoints
- [ ] Local tests passing
- [ ] TutorChat component uses real API
- [ ] Cache working (verified in console)
- [ ] Rate limiting preventing 11th question
- [ ] Sentry monitoring active
- [ ] Analytics dashboard rendering
- [ ] ProductHunt post prepared
- [ ] Beta tester list created
- [ ] 24/7 monitoring setup
- [ ] Rollback plan documented
- [ ] Production deployment tested

---

## PostDeployment Validation

1. **API Health Check**
   ```bash
   curl http://learnverse-delta.vercel.app/api/tutor/stats
   ```

2. **Sample Tutor Interaction**
   - Navigate to `/kid/tutor`
   - Ask: "What is 2 × 3?"
   - Verify: Response appears, cached badge shows

3. **Database Connectivity**
   ```bash
   psql $DATABASE_URL -c "SELECT count(*) FROM tutor_logs;"
   ```

4. **Error Tracking**
   - Force error in dev console
   - Verify it appears in Sentry dashboard

5. **Performance Metrics**
   - Check avg response time
   - Verify cache hit rate > 60%
   - Monitor API latency < 5s

---

**Next:** Once Week 2 infrastructure is deployed, Phase 1 is feature-complete and ready for beta testing!
