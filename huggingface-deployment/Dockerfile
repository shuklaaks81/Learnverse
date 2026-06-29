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
