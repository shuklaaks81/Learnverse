# 🚀 HuggingFace Spaces Deployment Checklist

**Date:** February 16, 2026  
**Status:** ✅ Files Ready | ⏳ Awaiting Manual Deployment

---

## ✅ Completed: Local Preparation

- [x] Created Dockerfile with NVIDIA CUDA 12.2 + Python 3.10
- [x] Created requirements.txt with all dependencies
- [x] Created app.py with Llama 2 7B + 4-bit quantization
- [x] Created deployment README with instructions
- [x] Created automated deploy.sh script
- [x] Created validation script (all checks passed ✅)
- [x] Created .env.example template
- [x] Committed all files to git (commit: 20ec8a8)

---

## ⏳ Next: Manual HuggingFace Setup

### Step 1: Get Llama 2 Access (5-10 minutes)

- [ ] Go to: https://huggingface.co/join (create account if needed)
- [ ] Navigate to: https://huggingface.co/meta-llama/Llama-2-7b-chat-hf
- [ ] Click "Request Access" button
- [ ] Fill out Meta's license agreement form
- [ ] Wait for approval email (usually < 1 hour, often instant)

**Why needed:** Meta requires approval to access Llama 2 models.

---

### Step 2: Create HuggingFace Space (2 minutes)

- [ ] Go to: https://huggingface.co/spaces
- [ ] Click: "Create new Space"
- [ ] Configure:
  - **Owner:** Your username
  - **Space name:** `learnverse-tutor` (or your preference)
  - **License:** OpenRAIL-M
  - **Select the Space SDK:** Docker
  - **Space hardware:** CPU basic (free) - upgrade to GPU later
  - **Space visibility:** Public (required for free tier)
- [ ] Click: "Create Space"

**Result:** You'll get a Git repository URL like:  
`https://huggingface.co/spaces/[YOUR_USERNAME]/learnverse-tutor`

---

### Step 3: Upload Files to Space (5 minutes)

**Option A: Web Interface (Easiest)**

1. [ ] In your Space, click "Files" tab
2. [ ] For each file, click "Add file" → "Upload file":
   - [ ] Upload `Dockerfile`
   - [ ] Upload `requirements.txt`
   - [ ] Upload `app.py`
   - [ ] (Optional) Upload `README.md`
3. [ ] Click "Commit changes to main"

**Option B: Git CLI (Recommended for developers)**

```bash
# From project root
cd huggingface-deployment

# Run automated deployment script
./deploy.sh

# Follow the prompts:
# - Enter your HuggingFace username
# - Enter Space name: learnverse-tutor
# - Confirm Space was created: y
```

**Script will:**
- Clone your Space repository
- Copy all deployment files
- Commit and push to HuggingFace
- Show you next steps

---

### Step 4: Monitor Build (10-15 minutes)

- [ ] Go to your Space URL
- [ ] Click "Logs" tab
- [ ] Watch the build process:
  - Downloading CUDA image (~2 min)
  - Installing Python packages (~3 min)
  - Downloading Llama 2 model (~5-10 min, 13GB)
  - Starting Gradio server

**Expected final log:**
```
Running on local URL:  http://0.0.0.0:7860
```

**⚠️ Common Issues:**

| Issue | Solution |
|-------|----------|
| "Permission denied for meta-llama/..." | Still waiting for Meta approval |
| "CUDA not available" | Upgrade to GPU hardware (T4 small) |
| "Out of memory" | Reduce `max_new_tokens` in app.py or upgrade GPU |

---

### Step 5: Upgrade to GPU (2 minutes)

**Why:** CPU is too slow for inference (<1 minute per response)

- [ ] Go to Space Settings
- [ ] Scroll to "Space hardware"
- [ ] Click "Change hardware"
- [ ] Select: **T4 small** ($0.60/hour or use free GPU quota)
- [ ] Click "Update & Restart"

**Free GPU Quota:**
- HuggingFace provides ~50 free GPU hours/month
- Perfect for testing and bootstrap phase

**Cost Optimization:**
- Enable "Sleep time: 15 minutes" in Settings
- Space auto-sleeps when inactive (no charges)
- Wakes up in ~30 seconds when accessed

---

### Step 6: Test the Endpoint (2 minutes)

Once build is complete and Space is running:

```bash
# Replace [YOUR_USERNAME] with your actual username
export HF_USERNAME="YOUR_USERNAME"

# Test the API
curl -X POST "https://${HF_USERNAME}-learnverse-tutor.hf.space/api/predict" \
  -H "Content-Type: application/json" \
  -d '{"data":["What is 2+2?"]}'
```

**Expected response (within 3-5 seconds):**
```json
{
  "data": [
    "2 + 2 = 4! Great addition skills! 🧮 Keep practicing!"
  ],
  "duration": 2.34
}
```

**If response takes > 10 seconds:** GPU might not be enabled, check Space hardware.

---

### Step 7: Update Learnverse Environment (1 minute)

- [ ] Copy your Space endpoint URL
- [ ] Open `.env.local` in Learnverse project root
- [ ] Add this line:

```env
NEXT_PUBLIC_TUTOR_ENDPOINT=https://[YOUR_USERNAME]-learnverse-tutor.hf.space/api/predict
```

- [ ] Save file
- [ ] Restart dev server: `npm run dev`

---

### Step 8: Test from Learnverse (2 minutes)

- [ ] Navigate to: http://localhost:3000/kid/tutor
- [ ] Ask a question: "What is 1/2 + 1/4?"
- [ ] Verify:
  - [ ] Response appears within 5 seconds
  - [ ] Answer is age-appropriate and helpful
  - [ ] Second identical question shows cache badge
  - [ ] Console logs show performance metrics

**Success Criteria:**
- ✅ First response: 3-5 seconds
- ✅ Cached response: < 1 second
- ✅ Answer quality: Grade 3-5 appropriate
- ✅ No errors in browser console

---

## 📊 Cost Tracking

### Current Setup (After Step 5)
- **HuggingFace Space (T4 small):** $0.60/hour
- **With auto-sleep (15 min):** ~$10-30/month typical usage
- **Free GPU quota:** First 50 hours/month FREE

### Optimization Tips
1. **Enable auto-sleep** in Space settings (saves ~80% costs)
2. **Monitor usage** at https://huggingface.co/settings/billing
3. **Start with free quota**, upgrade if needed
4. **Alternative:** Use CPU for development, GPU only for production

---

## 🎯 Deployment Verification

Once all steps complete, verify:

- [ ] Space is running (green indicator)
- [ ] API endpoint responds to curl test
- [ ] Learnverse `/kid/tutor` page works
- [ ] Cache system is active (check stats endpoint)
- [ ] Response time < 5 seconds average
- [ ] No errors in Space logs
- [ ] Auto-sleep enabled (if using paid GPU)

---

## 🆘 Troubleshooting Guide

### Build Fails: "Package not found"
**Fix:** Update package versions in `requirements.txt` to latest compatible versions.

### Build Fails: "No module named 'bitsandbytes'"
**Fix:** Requires GPU hardware. Upgrade Space to T4 small before building.

### Model Download Stuck
**Fix:**  HuggingFace servers might be slow. Wait 15-20 minutes or retry.

### Response: "Error loading model"
**Fix:** Check Space logs for specific error. Common: insufficient VRAM (need T4 or better).

### API Returns 503 Service Unavailable
**Fix:** Space is sleeping or starting up. Wait 30 seconds and retry.

### Responses Too Generic/Unhelpful
**Fix:** Adjust system prompt in `app.py` lines 59-63 for better age-appropriate responses.

---

## 🔄 Redeployment (If Files Change)

If you need to update the deployment:

```bash
cd huggingface-deployment

# Make your changes to app.py, Dockerfile, or requirements.txt

# Re-run validation
./validate.sh

# Re-deploy
./deploy.sh
```

HuggingFace will automatically rebuild the Space.

---

## 📈 Next Steps After Deployment

1. **Monitor performance:** Check Space metrics for usage patterns
2. **Optimize prompts:** Adjust system prompt based on real student questions
3. **Week 3 tasks:** Setup Railway PostgreSQL for caching
4. **Week 4 tasks:** Launch beta testing with real students

---

## ✅ Deployment Complete Criteria

You've successfully deployed when ALL are ✅:

- [x] Space created on HuggingFace
- [x] Files uploaded and built successfully
- [x] GPU enabled (T4 small minimum)
- [x] API endpoint responds to curl
- [x] Learnverse connected (env variable set)
- [x] Tutor page shows real AI responses
- [x] Response time < 5 seconds
- [x] Auto-sleep enabled (cost control)

---

**Estimated Total Time:** 30-45 minutes  
**Estimated Cost:** $0-10/month (with free GPU quota + auto-sleep)  
**Ready for:** Beta testing with small group of students

---

**Files Location:** `/huggingface-deployment/`  
**Documentation:** `README.md` in deployment folder  
**Support:** HuggingFace Docs at https://huggingface.co/docs/hub/spaces
