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
        inputs = TOKENIZER(prompt, return_tensors='pt').to(MODEL.device)
        
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
with gr.Blocks(title="Learnverse AI Tutor", theme=gr.themes.Soft()) as demo:
    gr.Markdown("# 🧑‍🏫 Learnverse AI Tutor")
    gr.Markdown("Ask me anything about your lessons! I'm here to help you learn.")
    
    with gr.Row():
        question = gr.Textbox(
            label="Your Question",
            placeholder="What is 1/2 + 1/4?",
            lines=2,
        )
    
    with gr.Row():
        submit_btn = gr.Button("Ask Tutor", variant="primary")
        clear_btn = gr.Button("Clear")
    
    answer = gr.Textbox(label="Tutor Response", interactive=False, lines=4)
    
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
            ["How does photosynthesis work?"],
            ["What is a noun?"],
            ["Why is the sky blue?"],
            ["What is 5 × 7?"],
            ["How do plants make food?"],
        ],
        inputs=[question],
    )
    
    gr.Markdown("---")
    gr.Markdown("💡 **Tip:** Ask simple questions and I'll explain in a way that's easy to understand!")

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860, share=False)
