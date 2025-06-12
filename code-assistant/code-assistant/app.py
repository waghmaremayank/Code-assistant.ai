import streamlit as st
import requests
from dotenv import load_dotenv
import os

# Load your API key
load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")
API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Container div for app UI
st.markdown('<div class="app-container">', unsafe_allow_html=True)

# Inject custom CSS and orb
st.markdown("""
    <style>
        /* Glass effect container */
        .main > div {
            background: rgba(15, 15, 30, 0.75);
            border-radius: 16px;
            padding: 30px;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 30px rgba(127, 94, 255, 0.2);
            margin-top: 50px;
        }

        /* Gradient background */
        body {
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            color: #fff;
        }

        /* Title customization */
        h1 {
            text-align: center;
            font-size: 3em;
            letter-spacing: 2px;
            color: #b8b8ff;
        }

        /* Button styling */
        .stButton > button {
            background-color: #7f5eff;
            color: white;
            border-radius: 8px;
            font-weight: bold;
            padding: 10px 20px;
            border: none;
            transition: all 0.3s ease;
        }

        .stButton > button:hover {
            background-color: #9d85ff;
            transform: scale(1.05);
        }

        /* Orb position */
        .orb {
            position: absolute;
            top: 100px;
            right: 80px;
            z-index: -1;
        }
    </style>

    <!-- Orb Image -->
    <div class="orb">
        <img src="orb.png" width="200">
    </div>
""", unsafe_allow_html=True)

st.title("🧠 CODE ASSISTANT")
st.markdown('<p class="subtitle">Type what kind of code you want, and get it instantly.</p>', unsafe_allow_html=True)

language = st.selectbox("Choose programming language", [
    "Python", "C", "C++", "Java", "JavaScript", "HTML", "CSS", "SQL", "Kotlin"
])

prompt = st.text_area("What do you want to build?", height=150)

if st.button(" Generate Code"):
    if prompt:
        if not API_KEY:
            st.error("API key not found. Please set OPENROUTER_API_KEY in your .env file.")
        else:
            with st.spinner("Generating..."):
                headers = {
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://replit.com",
                    "X-Title": "Code-Assistant"
                }

                data = {
                    "model": "openai/gpt-3.5-turbo",
                    "messages": [{"role": "user", "content": f"Write a {language} program to: {prompt}"}]
                }

                response = requests.post(API_URL, headers=headers, json=data)

                if response.status_code == 200:
                    generated_code = response.json()["choices"][0]["message"]["content"]
                    st.code(generated_code, language=language.lower())
                else:
                    st.error(f"Error: {response.status_code} - {response.text}")
    else:
        st.warning("Please enter something first.")

st.markdown('</div>', unsafe_allow_html=True)
