#!/bin/bash

###############################################################################
# Quick Upload Script for HuggingFace Space: FreeEducationVision/learnverse-tutor
###############################################################################

echo "🚀 Deploying to HuggingFace Space: FreeEducationVision/learnverse-tutor"
echo ""

# Space details
SPACE_URL="https://huggingface.co/spaces/FreeEducationVision/learnverse-tutor"
SPACE_REPO="https://huggingface.co/spaces/FreeEducationVision/learnverse-tutor"
API_ENDPOINT="https://freeeducationvision-learnverse-tutor.hf.space/api/predict"

echo "📍 Space URL: $SPACE_URL"
echo "📍 API Endpoint: $API_ENDPOINT"
echo ""

# Check if git-lfs is installed (required for HuggingFace)
if ! command -v git-lfs &> /dev/null; then
    echo "⚠️  git-lfs not found. Installing..."
    brew install git-lfs
    git lfs install
fi

# Clone the Space
TEMP_DIR="/tmp/learnverse-tutor-$$"
echo "📥 Cloning Space repository..."

if git clone "$SPACE_REPO" "$TEMP_DIR" 2>/dev/null; then
    echo "✅ Cloned successfully"
else
    echo "❌ Failed to clone. Make sure you're logged in:"
    echo "   Run: huggingface-cli login"
    echo "   Get token from: https://huggingface.co/settings/tokens"
    exit 1
fi

# Copy files
echo ""
echo "📦 Copying deployment files..."
cp Dockerfile "$TEMP_DIR/"
cp requirements.txt "$TEMP_DIR/"
cp app.py "$TEMP_DIR/"
cp README.md "$TEMP_DIR/"
echo "✅ Files copied"

# Create .gitignore if it doesn't exist
if [ ! -f "$TEMP_DIR/.gitignore" ]; then
    cat > "$TEMP_DIR/.gitignore" << EOF
__pycache__/
*.py[cod]
*.log
.env
EOF
fi

# Commit and push
echo ""
echo "🚀 Deploying to HuggingFace..."
cd "$TEMP_DIR"
git add .
git commit -m "Deploy Llama 2 7B tutor with 4-bit quantization

- Added Dockerfile with NVIDIA CUDA 12.2
- Added requirements.txt with transformers, gradio, bitsandbytes
- Added app.py with Llama 2 7B model (4-bit quantized)
- Configured for HuggingFace Spaces deployment" || echo "No changes to commit"

git push

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Next Steps:"
echo ""
echo "1. Monitor build progress:"
echo "   $SPACE_URL"
echo ""
echo "2. Build will take 10-15 minutes (downloading model)"
echo ""
echo "3. Once complete, upgrade to GPU:"
echo "   - Go to Settings → Space hardware"
echo "   - Select: T4 small (~$0.60/hr or use free GPU quota)"
echo "   - Enable: Sleep after 15 minutes"
echo ""
echo "4. Test the endpoint:"
echo "   curl -X POST '$API_ENDPOINT' \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"data\":[\"What is 2+2?\"]}'"
echo ""
echo "5. Learnverse is already configured!"
echo "   .env.local has been updated with endpoint"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Cleanup
cd - > /dev/null
rm -rf "$TEMP_DIR"

echo ""
echo "✨ Deployment complete! Check build status at:"
echo "   $SPACE_URL"
