#!/bin/bash

###############################################################################
# Validation script for HuggingFace deployment files
###############################################################################

echo "🔍 Validating HuggingFace Deployment Files..."
echo ""

errors=0

# Check Dockerfile
if [ -f "Dockerfile" ]; then
    echo "✓ Dockerfile exists"
    if grep -q "nvidia/cuda" Dockerfile; then
        echo "  ✓ Uses NVIDIA CUDA base image"
    else
        echo "  ✗ Missing NVIDIA CUDA base image"
        errors=$((errors + 1))
    fi
    if grep -q "python3.10" Dockerfile; then
        echo "  ✓ Python 3.10 configured"
    else
        echo "  ✗ Missing Python 3.10"
        errors=$((errors + 1))
    fi
    if grep -q "EXPOSE 7860" Dockerfile; then
        echo "  ✓ Port 7860 exposed"
    else
        echo "  ✗ Port 7860 not exposed"
        errors=$((errors + 1))
    fi
else
    echo "✗ Dockerfile missing"
    errors=$((errors + 1))
fi

echo ""

# Check requirements.txt
if [ -f "requirements.txt" ]; then
    echo "✓ requirements.txt exists"
    if grep -q "transformers" requirements.txt; then
        echo "  ✓ transformers package"
    else
        echo "  ✗ Missing transformers"
        errors=$((errors + 1))
    fi
    if grep -q "torch" requirements.txt; then
        echo "  ✓ torch package"
    else
        echo "  ✗ Missing torch"
        errors=$((errors + 1))
    fi
    if grep -q "gradio" requirements.txt; then
        echo "  ✓ gradio package"
    else
        echo "  ✗ Missing gradio"
        errors=$((errors + 1))
    fi
    if grep -q "bitsandbytes" requirements.txt; then
        echo "  ✓ bitsandbytes package (for 4-bit quantization)"
    else
        echo "  ✗ Missing bitsandbytes"
        errors=$((errors + 1))
    fi
else
    echo "✗ requirements.txt missing"
    errors=$((errors + 1))
fi

echo ""

# Check app.py
if [ -f "app.py" ]; then
    echo "✓ app.py exists"
    if grep -q "meta-llama/Llama-2-7b-chat-hf" app.py; then
        echo "  ✓ Llama 2 7B model configured"
    else
        echo "  ✗ Missing Llama 2 model reference"
        errors=$((errors + 1))
    fi
    if grep -q "BitsAndBytesConfig" app.py; then
        echo "  ✓ 4-bit quantization configured"
    else
        echo "  ✗ Missing 4-bit quantization"
        errors=$((errors + 1))
    fi
    if grep -q "load_in_4bit=True" app.py; then
        echo "  ✓ 4-bit loading enabled"
    else
        echo "  ✗ 4-bit loading not enabled"
        errors=$((errors + 1))
    fi
    if grep -q "gr.Blocks" app.py; then
        echo "  ✓ Gradio interface configured"
    else
        echo "  ✗ Missing Gradio interface"
        errors=$((errors + 1))
    fi
    if grep -q "server_port=7860" app.py; then
        echo "  ✓ Correct port (7860)"
    else
        echo "  ✗ Wrong port or missing"
        errors=$((errors + 1))
    fi
else
    echo "✗ app.py missing"
    errors=$((errors + 1))
fi

echo ""

# Check README
if [ -f "README.md" ]; then
    echo "✓ README.md exists"
else
    echo "⚠ README.md missing (optional but recommended)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $errors -eq 0 ]; then
    echo "✅ All validation checks passed!"
    echo ""
    echo "Ready to deploy! Run: ./deploy.sh"
    exit 0
else
    echo "❌ Found $errors error(s)"
    echo ""
    echo "Please fix the errors before deploying."
    exit 1
fi
