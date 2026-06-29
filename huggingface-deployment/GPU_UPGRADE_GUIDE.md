# HuggingFace Space GPU Upgrade Guide

## Current Status

Your Space is deployed at: https://huggingface.co/spaces/FreeEducationVision/learnverse-tutor

**Current Issue:** Space is on CPU-basic hardware which cannot run Llama 2 7B (requires 13GB memory).

**Solution:** Upgrade to T4 small GPU ($0.60/hour or use free GPU quota).

---

## Step-by-Step GPU Upgrade (5 minutes)

### Step 1: Open Your Space Settings

1. Visit: https://huggingface.co/spaces/FreeEducationVision/learnverse-tutor
2. Click the **Settings** tab (gear icon ⚙️) at the top

### Step 2: Change Hardware

1. Scroll down to **"Space hardware"** section
2. You'll see: `Current: CPU basic`
3. Click on the dropdown menu
4. Select: **T4 small** (first GPU option)

**Cost Options:**
- **Option A:** Use free GPU quota (~50 hours/month free)
- **Option B:** Pay $0.60/hour (billed per second)

### Step 3: Enable Auto-Sleep (IMPORTANT)

1. In the same screen, find **"Sleep timeout"**
2. Select: **"15 minutes"** (saves money by sleeping when inactive)
3. This means the Space will:
   - Run when requests come in
   - Sleep after 15 minutes of no activity
   - Wake up automatically on next request (10-15 second cold start)

### Step 4: Apply Changes

1. Click **"Save"** or **"Update & Restart"** button
2. The Space will restart (takes 2-3 minutes)

### Step 5: Wait for Build

1. Go back to **"App"** tab
2. Watch the build logs
3. You should see:
   ```
   Downloading model files...
   Loading checkpoint shards: 100%
   Running on local URL: http://0.0.0.0:7860
   ```
4. Build time: **10-15 minutes** (downloads 13GB model first time)

---

## Verify Space is Running

### Method 1: Web Interface

Visit: https://freeeducationvision-learnverse-tutor.hf.space

You should see a Gradio interface where you can type questions.

### Method 2: API Test

```bash
curl -X POST 'https://freeeducationvision-learnverse-tutor.hf.space/api/predict' \
  -H 'Content-Type: application/json' \
  -d '{"data":["What is 2+2?"]}'
```

Expected response:
```json
{"data":["2 + 2 = 4! Great addition skills! 🧮"],"duration":2.34}
```

### Method 3: Check Runtime API

```bash
curl -s 'https://huggingface.co/api/spaces/FreeEducationVision/learnverse-tutor/runtime'
```

Look for:
```json
{
  "stage": "RUNNING",
  "hardware": {
    "current": "t4-small",
    "requested": "t4-small"
  }
}
```

---

## Troubleshooting

### Space shows "NO_APP_FILE"
- **Solution:** README.md frontmatter was missing. Already fixed in latest commit.
- **Action:** Wait 1-2 minutes for Space to detect changes, then upgrade to GPU.

### Space shows "ERROR" or "BUILD_ERROR"
- **Common cause:** CPU cannot run Llama 2 7B (needs 13GB RAM)
- **Solution:** Upgrade to T4 small GPU

### Build takes too long (>20 minutes)
- **Cause:** Downloading 13GB Llama 2 model
- **Action:** Check "Logs" tab for progress
- **Note:** Subsequent builds are faster (model is cached)

### Out of memory error
- **Cause:** T4 small has 16GB VRAM, model needs ~4GB with 4-bit quantization
- **Check:** app.py has `load_in_4bit=True` (already configured)
- **Solution:** Ensure 4-bit quantization is enabled in app.py

### API returns 503 Service Unavailable
- **Cause:** Space is sleeping or hasn't started
- **Action:** Wait 10-15 seconds for cold start, then retry

---

## Cost Optimization Tips

### Free Tier Strategy
1. Enable "Sleep after 15 minutes"
2. Use Space only when needed
3. Monitor usage: https://huggingface.co/settings/billing

### Paid Strategy ($25/month budget)
1. T4 small: $0.60/hour × ~40 hours = $24/month
2. Set billing limit at $30 to avoid surprises
3. Enable auto-sleep to minimize idle costs

### Expected Usage (Phase 1)
- Testing: 5 hours/month = $3
- Light production: 20 hours/month = $12
- Phase 1 target: <$15/month with sleep enabled

---

## Next Steps After GPU Upgrade

1. ✅ **Test API endpoint** (see "Verify Space is Running" above)
2. ✅ **Test from Learnverse UI** at http://localhost:3000/kid/tutor
3. ✅ **Monitor performance**:
   - First request: 3-5 seconds
   - Cached requests: <1 second (frontend cache)
   - Cold start: 10-15 seconds (after sleep)
4. 🔄 **Setup monitoring**:
   - Check daily usage: HuggingFace dashboard
   - Track cache hit rate: /api/tutor/stats endpoint

---

## Quick Reference

| Action | URL |
|--------|-----|
| Your Space | https://huggingface.co/spaces/FreeEducationVision/learnverse-tutor |
| Settings | https://huggingface.co/spaces/FreeEducationVision/learnverse-tutor/settings |
| Logs | https://huggingface.co/spaces/FreeEducationVision/learnverse-tutor (click "Logs" tab) |
| API Endpoint | https://freeeducationvision-learnverse-tutor.hf.space/api/predict |
| Runtime Status | https://huggingface.co/api/spaces/FreeEducationVision/learnverse-tutor/runtime |
| Billing | https://huggingface.co/settings/billing |

---

**Once the Space is running on GPU, your AI tutor will be fully operational!** 🚀
