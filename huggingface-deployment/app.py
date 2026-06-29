#!/usr/bin/env python3
"""
Learnverse AI Tutor - Powered by Groq API
FREE, FAST, and ACTUALLY WORKS! 🚀
Uses the same AI that powers the lesson generator!
"""

import gradio as gr
import os
import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get Groq API key from environment variable
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')

def tutor_response(question: str) -> str:
    """
    Answer student question with age-appropriate explanation.
    Powered by Groq's ultra-fast Llama 3.3 70B API!
    """
    if not question.strip():
        return "Please ask me a question! 📚"
    
    if not GROQ_API_KEY:
        return "⚠️ API key not configured! Add GROQ_API_KEY in Space settings."
    
    try:
        # Call Groq API (same as lesson generator!)
        response = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {GROQ_API_KEY}',
                'Content-Type': 'application/json',
            },
            json={
                'model': 'llama-3.3-70b-versatile',
                'messages': [
                    {
                        'role': 'system',
                        'content': """You are an enthusiastic, patient AI tutor for elementary school students (grades K-5).

Your teaching style:
- Explain concepts in SIMPLE, fun language
- Use everyday examples kids can relate to
- Keep responses SHORT (2-4 sentences max)
- Use emojis to make it engaging! 🎉
- Encourage curiosity and ask follow-up questions
- Break down complex topics into bite-sized pieces
- Be positive and supportive!

Remember: You're talking to KIDS, so keep it super simple and fun!"""
                    },
                    {
                        'role': 'user',
                        'content': question
                    }
                ],
                'temperature': 0.7,
                'max_tokens': 300,
                'top_p': 0.9,
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            answer = data['choices'][0]['message']['content'].strip()
            return answer or "Great question! Keep learning! 🌟"
        else:
            logger.error(f"API Error: {response.status_code} - {response.text}")
            return f"Oops! The AI is taking a quick break. Try again! 🤔"
        
    except requests.exceptions.Timeout:
        return "The AI is thinking too hard! Try asking again! 🤔"
    except Exception as e:
        logger.error(f"Error: {e}")
        return f"Oops! Something went wrong. Try again! 🤔"

# Gradio Interface
with gr.Blocks(title="Learnverse AI Tutor 🎓", theme=gr.themes.Soft()) as demo:
    gr.Markdown("""
    # 🎓 Learnverse AI Tutor
    ### Ask me anything! I'll explain it in a fun, easy way! 🌟
    
    I'm powered by **Groq's ultra-fast AI** - the same technology that powers Learnverse's lesson generator!
    """)
    
    with gr.Row():
        question = gr.Textbox(
            label="Your Question",
            placeholder="Example: Why do plants need sunlight?",
            lines=3
        )
    
    with gr.Row():
        submit_btn = gr.Button("Ask Tutor 🤖", variant="primary", size="lg")
        clear_btn = gr.Button("Clear 🗑️")
    
    answer = gr.Textbox(label="Tutor Response 💭", interactive=False, lines=6)
    
    # Event handlers
    submit_btn.click(
        fn=tutor_response,
        inputs=[question],
        outputs=[answer],
    )
    
    question.submit(  # Also submit on Enter key
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
            ["What causes thunder and lightning?"],
            ["How does gravity work?"],
        ],
        inputs=[question],
        label="Try these example questions! 👇"
    )
    
    gr.Markdown("---")
    gr.Markdown("""
    💡 **Tips for best results:**
    - Ask clear, simple questions
    - One topic at a time works best
    - Perfect for grades K-5!
    
    🚀 **Powered by:** [Groq](https://groq.com) + Llama 3.3 70B  
    🎮 **Part of:** [Learnverse](https://github.com/yourusername/Learnverse) - The ultimate learning platform for kids!
    """)

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860, share=False)
