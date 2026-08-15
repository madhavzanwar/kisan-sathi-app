# KisanSathi 🌱

> **Har kisan ka saccha sathi.**

An ultra-premium, AI-powered Agritech SaaS platform designed to empower farmers with real-time machine learning insights. KisanSathi bridges the gap between advanced agricultural science and everyday farming by offering instant crop disease diagnosis, dynamic fertilizer recommendations, and an intelligent voice-enabled AI assistant.

---

## 📸 Screenshots

*(Replace the placeholder URLs with actual image paths once uploaded to your repository)*

### Website Hero Section
![Hero Section Placeholder](path/to/hero-screenshot.png)

### Website Main Page (Dashboard)
![Main Page Placeholder](path/to/main-screenshot.png)

### Tech Used
![Tech Stack Placeholder](path/to/tech-stack-screenshot.png)

### Workflow Diagram
![Workflow Diagram Placeholder](path/to/workflow-diagram.png)

---

## ✨ Features

* **Heal Your Crop (AI Diagnosis):** Upload a photo of a diseased leaf. Our PyTorch ResNet18 model will analyze the image, identify the exact disease, and provide both chemical and organic treatment plans instantly.
* **Smart Fertilizer Calculator:** Input your soil type, crop stage, farm size, and current NPK (Nitrogen, Phosphorus, Potassium) levels. Our Scikit-Learn Random Forest model dynamically calculates the exact kg dosage of Urea, DAP, MOP, and Organic Compost required.
* **Cultivation Guides:** Step-by-step lifecycle guides for major crops (Tomato, Cotton, Wheat, etc.) outlining sowing, irrigation, and pest control timelines.
* **Floating AI Assistant:** A localized, context-aware AI chatbot powered by Google's Gemini 1.5 Pro. It understands the context of the page you are on and answers farming questions intelligently.
* **Ultra-Premium UI:** A stunning, Apple-style "frosted glass" interface featuring a dynamic background, elegant typography, and seamless micro-animations.

---

## 🛠️ Technology Stack

### Frontend
* **Framework:** React.js (built with Vite)
* **Styling:** Custom Vanilla CSS replicating utility-class architecture (Glassmorphism, backdrop-blur)
* **Icons:** Lucide React
* **Typography:** Cormorant Garamond (Serif), Inter (Sans-serif)

### Backend
* **Framework:** FastAPI (Python)
* **Server:** Uvicorn
* **Environment Management:** python-dotenv

### Machine Learning & AI
* **Computer Vision:** PyTorch, TorchVision (ResNet18) for leaf disease classification.
* **Data Science:** Scikit-Learn (RandomForestClassifier), Pandas, NumPy for fertilizer prediction.
* **Generative AI:** Google Gemini SDK (`gemini-1.5-pro-latest`) for the floating assistant.

---

## ⚙️ System Architecture

1. **Client Layer:** The React frontend captures user inputs (images, NPK slider values, chat messages) and sends them as `FormData` or JSON payloads via HTTP POST requests.
2. **API Layer:** FastAPI intercepts these requests on port `8000`. Cross-Origin Resource Sharing (CORS) is enabled to securely connect with the frontend.
3. **Inference Layer:** 
    * `/api/predict/disease` passes the image to the loaded `.pth` PyTorch model.
    * `/api/predict/fertilizer` formats the JSON into a NumPy array and passes it to the `.pkl` Scikit-Learn model.
    * `/api/chat` securely connects to Google's Generative AI servers via an API key, handling rate-limit fallbacks automatically.
4. **Response Layer:** The backend returns structured JSON containing confidence scores, exact fertilizer weights, or text responses, which the React UI instantly renders without requiring a page reload.

---

## 🚀 Setup & Installation

### Prerequisites
* Node.js (v18+)
* Python (v3.9+)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/kisan-sathi-new.git
cd kisan-sathi-new
```

### 2. Backend Setup
Navigate to the backend folder and create a virtual environment:
```powershell
cd backend
python -m venv venv

# Activate Virtual Environment (Windows)
.\venv\Scripts\activate

# Install Dependencies
pip install fastapi uvicorn pydantic torch torchvision scikit-learn pandas numpy pillow python-dotenv google-generativeai
```

### 3. Environment Variables
Create a `.env` file in the `backend` directory and add your Google Gemini API keys:
```env
GEMINI_API_KEY_1="your_first_gemini_api_key_here"
GEMINI_API_KEY_2="your_second_gemini_api_key_here"
GEMINI_MODEL="gemini-1.5-pro-latest"
```

### 4. Train/Mock the ML Models
To generate the required `.pkl` and `.pth` model files for the backend to start:
```powershell
python ml/train_fertilizer_model.py
python ml/train_disease_model.py
```

### 5. Start the Application
You will need two terminal windows.

**Terminal 1 (Backend):**
```powershell
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload
```

**Terminal 2 (Frontend):**
```powershell
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` (or the port specified by Vite) in your browser to experience KisanSathi!

---

## 📡 API Endpoints

* `GET /` - Root health check
* `POST /api/predict/disease` - Accepts multipart `UploadFile`. Returns disease name, severity, and treatments.
* `POST /api/predict/fertilizer` - Accepts JSON (n, p, k, ph, soil, crop, farm size). Returns precise fertilizer dosages.
* `POST /api/chat` - Accepts JSON (message, context). Returns Gemini AI response.

---
*Developed with a focus on modern design and scalable AI integration.*
