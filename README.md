# CNOT PERFORM ai

A platform to support athletes' mental well-being, featuring speech emotion recognition, a conversational AI, and nutrition advice.

---

## Folder Structure

```
MentalHealthSupportAi/
│
├── backend/
│   ├── api.py
│   ├── requirements.txt
│   ├── speech_to_text.py
│   ├── models/
│   ├── vocals/
│   ├── index/
│   ├── phi2-mentalhealth-final/
│   └── anas & dorra work/
│       ├── app/
│       │   └── chatbot.py
│       └── data/
│           ├── macro_dataset.csv
│           ├── time_dataset.csv
│           ├── allergy_dataset.csv
│           └── specialty_dataset.csv
│
└── NEW_frontend/
    ├── index.html
    ├── script.js
    └── style.css
```

---

## Setup Instructions

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd MentalHealthSupportAi/backend
```

### 2. Create and Activate a Virtual Environment

```sh
python -m venv venv
venv\Scripts\activate   # On Windows
```

### 3. Install Python Dependencies

```sh
pip install -r requirements.txt
```

### 4. Prepare Datasets

Place your CSV datasets in:
```
backend/anas & dorra work/data/
```
Required files:
- `macro_dataset.csv`
- `time_dataset.csv`
- `allergy_dataset.csv`
- `specialty_dataset.csv`

### 5. Run the Backend API

```sh
python api.py
```
The API will start (by default on `http://127.0.0.1:5000/`).

### 6. Run the Frontend

Open `NEW_frontend/index.html` in your browser.

---

## Notes

- Make sure you have a CUDA-compatible GPU for best performance with PyTorch and Transformers.
- If you encounter missing file errors, double-check dataset locations and file names.
- For speech-to-text and emotion recognition, ensure your audio files are uploaded to the correct endpoints.

---

## Troubleshooting

- **ModuleNotFoundError**: Check your `sys.path` and folder names for typos or missing files.
- **FileNotFoundError**: Ensure all required datasets are in `backend/anas & dorra work/data/`.
- **CUDA Errors**: Install the correct version of CUDA and PyTorch for your GPU.

---

## License

[MIT](LICENSE) or your preferred license.

# Project Architecture & AI Approach

### 🧠 Mental State Axis

- **Fine-tuned Model**:  
  A Phi-2 model fine-tuned on mental health and motivational content to support athletes with context-aware, empathetic responses.

- **Model Serving**:  
  Served via `transformers` and PyTorch with GPU acceleration for low-latency inference.

- **Vocal Integration**:  
  - **Speech-to-Text**: OpenAI’s Whisper model enables voice input.  
  - **Language Detection**: Auto-detects spoken language for accurate transcription.  
  - **Emotion Detection**: Analyzes tone for emotionally intelligent replies.

- **Goal**:  
  Real-time, emotionally responsive voice assistant to help athletes manage stress, focus, and motivation.

---

### 🍽️ Nutrition Axis (RAG-based Chatbot)

- **Retrieval-Augmented Generation**:  
  A classifier routes queries to one of four nutrition categories:
  - `macro`: nutrients & calories  
  - `time`: quick meals, prep duration  
  - `allergy`: dietary restrictions  
  - `specialty`: cuisine type, style

- **Vectorstore & Retrieval**:  
  Each category has its own FAISS-based vectorstore with recipe/data embeddings.

- **LLM Response**:  
  A Mistral 2B model generates detailed, structured answers from retrieved context.

- **Workflow**:  
  1. User asks a question  
  2. Classifier identifies category  
  3. Relevant vectorstore is queried  
  4. Mistral LLM responds with a complete answer

---

### ✅ Summary

- **Mental State Axis**: Fine-tuned Phi-2 + Whisper + Emotion Detection = personalized voice support.  
- **Nutrition Axis**: RAG pipeline using FAISS + Mistral LLM = smart, classified nutrition Q&A.
