#!/bin/bash

###############################################################################
# HuggingFace Spaces Deployment Script for Learnverse AI Tutor
# Automates the deployment of Llama 2 7B to HuggingFace Spaces
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Learnverse AI Tutor - HuggingFace Spaces Deployer      ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print step headers
step() {
    echo -e "\n${GREEN}▶ $1${NC}"
}

# Function to print warnings
warn() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to print errors
error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print success
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Check if required files exist
step "Checking deployment files..."
required_files=("Dockerfile" "requirements.txt" "app.py" "README.md")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        error "Missing required file: $file"
        exit 1
    fi
    success "Found $file"
done

# Prompt for HuggingFace username
echo ""
read -p "Enter your HuggingFace username: " HF_USERNAME

if [ -z "$HF_USERNAME" ]; then
    error "Username cannot be empty"
    exit 1
fi

# Prompt for Space name
echo ""
read -p "Enter Space name (default: learnverse-tutor): " SPACE_NAME
SPACE_NAME=${SPACE_NAME:-learnverse-tutor}

# Construct Space URL
SPACE_URL="https://huggingface.co/spaces/$HF_USERNAME/$SPACE_NAME"
SPACE_REPO="https://huggingface.co/spaces/$HF_USERNAME/$SPACE_NAME"

echo ""
echo -e "${BLUE}Space URL: ${SPACE_URL}${NC}"
echo -e "${BLUE}Git Repo: ${SPACE_REPO}${NC}"
echo ""

# Ask for confirmation
read -p "Have you created this Space on HuggingFace? (y/n): " CREATED

if [ "$CREATED" != "y" ]; then
    warn "Please create the Space first:"
    echo "  1. Go to https://huggingface.co/spaces"
    echo "  2. Click 'Create new Space'"
    echo "  3. Set name to: $SPACE_NAME"
    echo "  4. Choose SDK: Docker"
    echo "  5. Set visibility: Public"
    echo "  6. Then run this script again"
    exit 0
fi

# Clone the Space repository
step "Cloning Space repository..."
TEMP_DIR="/tmp/$SPACE_NAME-$$"

if git clone "$SPACE_REPO" "$TEMP_DIR" 2>/dev/null; then
    success "Cloned repository"
else
    error "Failed to clone repository. Make sure:"
    echo "  - You're logged into HuggingFace CLI (huggingface-cli login)"
    echo "  - The Space exists: $SPACE_URL"
    echo "  - You have access to the Space"
    exit 1
fi

# Copy deployment files
step "Copying deployment files..."
cp Dockerfile "$TEMP_DIR/"
cp requirements.txt "$TEMP_DIR/"
cp app.py "$TEMP_DIR/"
cp README.md "$TEMP_DIR/"
success "Files copied"

# Commit and push
step "Deploying to HuggingFace Spaces..."
cd "$TEMP_DIR"
git add .
git commit -m "Deploy Llama 2 7B tutor with 4-bit quantization" || true
git push

success "Deployment complete!"

# Show next steps
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                  Deployment Successful!                   ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Monitor build progress:"
echo -e "   ${YELLOW}$SPACE_URL${NC}"
echo ""
echo "2. Build will take 5-10 minutes"
echo ""
echo "3. Once complete, test the endpoint:"
echo -e "   ${YELLOW}curl -X POST https://$HF_USERNAME-$SPACE_NAME.hf.space/api/predict \\${NC}"
echo -e "   ${YELLOW}  -H 'Content-Type: application/json' \\${NC}"
echo -e "   ${YELLOW}  -d '{\"data\":[\"What is 1+1?\"]}'${NC}"
echo ""
echo "4. Update Learnverse .env.local:"
echo -e "   ${YELLOW}NEXT_PUBLIC_TUTOR_ENDPOINT=https://$HF_USERNAME-$SPACE_NAME.hf.space/api/predict${NC}"
echo ""
echo "5. Upgrade to GPU (Settings → Space hardware → T4 small)"
echo ""

# Cleanup
cd -
rm -rf "$TEMP_DIR"

success "Ready for testing!"
