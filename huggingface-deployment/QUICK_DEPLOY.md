# 🚀 Quick Deploy to Your HuggingFace Space

**Space:** https://huggingface.co/spaces/FreeEducationVision/learnverse-tutor  
**API Endpoint:** https://freeeducationvision-learnverse-tutor.hf.space/api/predict  
**Status:** ✅ .env.local already configured!

---

## Option 1: Automated Deployment (Recommended)

```bash
cd huggingface-deployment
./deploy-to-space.sh
```

**Prerequisites:**
- Install HuggingFace CLI: `pip install huggingface-hub`
- Login: `huggingface-cli login` (get token from https://huggingface.co/settings/tokens)
- Install git-lfs: `brew install git-lfs && git lfs install`

---

## Option 2: Manual Upload via Web Interface

1. **Go to your Space:** https://huggingface.co/spaces/FreeEducationVision/learnverse-tutor

2. **Click "Files" tab**

3. **Upload these 4 files** (click "Add file" → "Upload file" for each):
   - `Dockerfile`
   - `requirements.txt`
   - `app.py`
   - `README.md` (optional)

4. **Click "Commit changes to main"**

---

## Option 3: Git Clone & Push

```bash
# Clone your Space
git clone https://huggingface.co/spaces/FreeEducationVision/learnverse-tutor
cd learnverse-tutor

# Copy files
cp ../huggingface-deployment/Dockerfile .
cp ../huggingface-deployment/requirements.txt .
cp ../huggingface-deployment/app.py .
cp ../huggingface-deployment/README.md .

# Commit and push
git add .
git commit -m "Deploy Llama 2 7B tutor"
git push
```

---

## After Upload: Monitor Build

1. **Watch build progress:** https://huggingface.co/spaces/FreeEducationVision/learnverse-tutor
   - Click "Logs" tab
   - Wait 10-15 minutes for build to complete
   - Look for: "Running on local URL: http://0.0.0.0:7860"

2. **Upgrade to GPU** (Settings → Space hardware):
   - Select: **T4 small** ($0.60/hour or free GPU quota)
   - Enable: **Sleep after 15 minutes**
   - Click: **Update & Restart**

3. **Test the endpoint:**
```bash
curl -X POST 'https://freeeducationvision-learnverse-tutor.hf.space/api/predict' \
  -H 'Content-Type: application/json' \
  -d '{"data":["What is 2+2?"]}'
```

Expected response:
```json
{
  "data": ["2 + 2 = 4! Great addition skills! 🧮"],
  "duration": 2.34
}
```

4. **Test from Learnverse:**
```bash
# Restart dev server if running
npm run dev

# Visit: http://localhost:3000/kid/tutor
# Ask a question!
```

---

## Troubleshooting

### "Permission denied" when cloning
**Fix:** Run `huggingface-cli login` first

### "CUDA not available" error in logs
**Fix:** Upgrade Space to GPU (T4 small) in Settings

### Build takes > 20 minutes
**Fix:** HuggingFace servers might be busy. Check Logs for errors.

### API returns 503 error
**Fix:** Space is sleeping or starting. Wait 30 seconds and retry.

---

## Cost Optimization

- **Free GPU Quota:** ~50 hours/month FREE
- **Auto-sleep:** Space sleeps after 15 min → saves ~80% cost
- **Estimated cost:** $10-30/month with caching (most requests cached → minimal GPU use)

---

## Files to Upload

All ready in `/huggingface-deployment/`:
- ✅ Dockerfile (545 bytes)
- ✅ requirements.txt (103 bytes)  
- ✅ app.py (4.2 KB)
- ✅ README.md (5 KB)

---

**Next:** Upload files using any method above, then monitor build!
