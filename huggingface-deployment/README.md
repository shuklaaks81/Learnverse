# HuggingFace Spaces Deployment Guide

## Quick Start: Deploy Llama 2 7B Tutor to HuggingFace Spaces

### Prerequisites
- HuggingFace account (free): https://huggingface.co/join
- Access to Llama 2 model (requires Meta approval)

---

## Step 1: Get Llama 2 Access

1. Go to: https://huggingface.co/meta-llama/Llama-2-7b-chat-hf
2. Click "Request Access"
3. Fill out Meta's form (usually approved within minutes)
4. Wait for approval email

---

## Step 2: Create HuggingFace Space

1. **Go to Spaces:** https://huggingface.co/spaces
2. **Click:** "Create new Space"
3. **Configure:**
   - **Space name:** `learnverse-tutor` (or your preference)
   - **License:** OpenRAIL-M
   - **Space SDK:** Docker
   - **Space hardware:** CPU basic (free) → upgrade to GPU later
   - **Visibility:** Public (required for free tier)
4. **Click:** "Create Space"

---

## Step 3: Upload Files

### Option A: Web Interface (Easiest)

1. In your new Space, click "Files" tab
2. Click "Add file" → "Create a new file"
3. Upload these 3 files:
   - `Dockerfile` (from this directory)
   - `requirements.txt` (from this directory)
   - `app.py` (from this directory)

### Option B: Git CLI (Recommended)

```bash
# Clone your Space repository
git clone https://huggingface.co/spaces/[YOUR_USERNAME]/learnverse-tutor
cd learnverse-tutor

# Copy deployment files
cp ../huggingface-deployment/* .

# Commit and push
git add .
git commit -m "Initial deployment: Llama 2 7B tutor with 4-bit quantization"
git push
```

---

## Step 4: Configure Space Hardware

1. Go to your Space's "Settings" tab
2. Scroll to "Space hardware"
3. **For testing:** Keep on "CPU basic" (free)
4. **For production:** Upgrade to "T4 small" ($0.60/hour) or use free GPU quota

**Free GPU Quota:**
- HuggingFace provides ~50 free GPU hours/month
- Enough for testing and low-volume usage

---

## Step 5: Wait for Build

1. HuggingFace will automatically build your Docker container
2. Build time: 5-10 minutes (downloads 13GB model)
3. Watch the "Logs" tab for progress
4. When complete, you'll see: "Running on local URL: http://0.0.0.0:7860"

---

## Step 6: Test the Endpoint

Once deployed, test with:

```bash
# Replace [YOUR_USERNAME] with your HuggingFace username
curl -X POST https://[YOUR_USERNAME]-learnverse-tutor.hf.space/api/predict \
  -H "Content-Type: application/json" \
  -d '{"data":["What is 1+1?"]}'
```

Expected response:
```json
{
  "data": [
    "1 + 1 = 2! Great question, young mathematician! 🧮 Keep practicing your addition!"
  ],
  "duration": 2.34
}
```

---

## Step 7: Update Learnverse Environment

Add the endpoint URL to your `.env.local`:

```env
NEXT_PUBLIC_TUTOR_ENDPOINT=https://[YOUR_USERNAME]-learnverse-tutor.hf.space/api/predict
```

---

## Troubleshooting

### Build Fails: "CUDA not available"
- **Solution:** Upgrade Space to GPU hardware (Settings → Space hardware → T4 small)

### Build Fails: "Permission denied for meta-llama/Llama-2-7b-chat-hf"
- **Solution:** Request access at https://huggingface.co/meta-llama/Llama-2-7b-chat-hf
- Wait for Meta approval (usually < 1 hour)

### Model Takes Too Long to Load
- **Expected:** First load takes 3-5 minutes to download 13GB
- **After first load:** Cached, loads in ~30 seconds

### Out of Memory Errors
- **Solution:** Using 4-bit quantization (3.5GB), should work on T4 small (16GB VRAM)
- If still failing, reduce `max_new_tokens` in app.py from 150 to 100

### Response Too Slow (> 5 seconds)
- **Solution 1:** Upgrade to better GPU (T4 → A10G)
- **Solution 2:** Reduce `max_new_tokens` in app.py
- **Solution 3:** Implement caching in Learnverse (already done!)

---

## Cost Breakdown

### Free Tier (Recommended for Bootstrap)
- **CPU Basic:** FREE forever
- **GPU Quota:** ~50 hours/month FREE
- **Total:** $0/month (limited to ~50 requests/month with caching)

### Paid Tier (For Production)
- **T4 small:** $0.60/hour = ~$432/month (24/7)
- **A10G small:** $1.50/hour = ~$1,080/month (24/7)

**Optimization:** Use on-demand GPU (only pay when Space is active)
- Set auto-sleep after 15 minutes of inactivity
- Estimated cost: $10-50/month with caching

---

## Next Steps

1. ✅ Deploy Space
2. Test with curl
3. Update `.env.local` with endpoint URL
4. Test from Learnverse `/kid/tutor` page
5. Monitor performance (target: < 5 seconds)
6. If too slow, upgrade GPU tier

---

## Alternative: Local Deployment (For Development)

If you want to test locally without HuggingFace:

```bash
# Install dependencies
pip install -r requirements.txt

# Run app
python app.py

# Access at http://localhost:7860
```

**Requirements:**
- NVIDIA GPU with 16GB+ VRAM
- CUDA 12.2+
- ~13GB disk space for model

---

## Support

- **HuggingFace Docs:** https://huggingface.co/docs/hub/spaces
- **Llama 2 Docs:** https://huggingface.co/meta-llama/Llama-2-7b-chat-hf
- **Gradio Docs:** https://gradio.app/docs/

---

**Deployment Date:** February 16, 2026  
**Model:** Meta Llama 2 7B Chat (4-bit quantized)  
**Framework:** Transformers + Gradio  
**Platform:** HuggingFace Spaces
