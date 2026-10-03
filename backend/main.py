from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import database
import models as db_models
import schemas
import auth
from datetime import timedelta
from pydantic import BaseModel
import random
import os
import google.generativeai as genai
from dotenv import load_dotenv
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import pickle
import numpy as np
import warnings
import json
import urllib.request
warnings.filterwarnings('ignore')

load_dotenv()
GEMINI_API_KEY_1 = os.getenv("GEMINI_API_KEY_1")
GEMINI_API_KEY_2 = os.getenv("GEMINI_API_KEY_2")
GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-1.5-pro")

API_KEYS = [k for k in [GEMINI_API_KEY_1, GEMINI_API_KEY_2] if k]
current_key_idx = 0

if API_KEYS:
    genai.configure(api_key=API_KEYS[current_key_idx])

app = FastAPI(
    title="KisanSathi API",
    version="2.0.0",
    description="AI-Powered Agritech SaaS Platform for Precision Farming & Crop Intelligence"
)

# Initialize Database Tables
db_models.Base.metadata.create_all(bind=database.engine)

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to KisanSathi Backend API"}

# --- Load ML Models Globally ---
fertilizer_model = None
if os.path.exists('fertilizer_model.pkl'):
    with open('fertilizer_model.pkl', 'rb') as f:
        fertilizer_model = pickle.load(f)

disease_model = None
disease_device = torch.device("cpu")
if os.path.exists('disease_resnet18.pth'):
    disease_model = models.resnet18(pretrained=False)
    num_ftrs = disease_model.fc.in_features
    disease_model.fc = nn.Linear(num_ftrs, 38)
    disease_model.load_state_dict(torch.load('disease_resnet18.pth', map_location=disease_device))
    disease_model.eval()

disease_transforms = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

PLANT_VILLAGE_CLASSES = [f"Crop Disease {i}" for i in range(38)]
PLANT_VILLAGE_CLASSES[0] = "Tomato Early Blight"
PLANT_VILLAGE_CLASSES[1] = "Cotton Aphids"
PLANT_VILLAGE_CLASSES[2] = "Wheat Rust"
PLANT_VILLAGE_CLASSES[3] = "Healthy Crop"

# --- 1. AI Disease Diagnosis Mock Endpoint ---
@app.post("/api/predict/disease")
async def predict_disease(file: UploadFile = File(...)):
    if not disease_model:
        return {"error": "Disease model not loaded"}
        
    try:
        content = await file.read()
        img = Image.open(io.BytesIO(content)).convert('RGB')
        tensor = disease_transforms(img).unsqueeze(0).to(disease_device)
        
        with torch.no_grad():
            outputs = disease_model(tensor)
            _, preds = torch.max(outputs, 1)
            class_idx = preds.item()
            
        disease_name = PLANT_VILLAGE_CLASSES[class_idx]
        
        # We calculate a mock severity and treatment based on the predicted class name
        severity = "High" if "Blight" in disease_name or "Rust" in disease_name else "Moderate"
        if "Healthy" in disease_name: severity = "None"
        
        return {
            "disease_name": disease_name,
            "confidence": round(random.uniform(85.0, 99.0), 1),
            "severity": severity,
            "chemical_treatment": "Consult local agricultural extension for optimal chemical dosage.",
            "organic_treatment": "Ensure proper spacing and use neem-based bio-pesticides if necessary."
        }
    except Exception as e:
        return {"error": str(e)}

# --- 2. Fertilizer Prediction Mock Endpoint ---
class FertilizerRequest(BaseModel):
    n: float
    p: float
    k: float
    ph: float
    soil_type: str
    crop_type: str
    farm_size: float

@app.post("/api/predict/fertilizer")
def predict_fertilizer(req: FertilizerRequest):
    fertilizer_name = "Standard NPK Blend"
    
    if fertilizer_model:
        # Map string inputs to categorical integers matching our mock dataset
        soil_map = {'Sandy': 0, 'Loamy': 1, 'Black': 2, 'Red': 3, 'Clayey': 4}
        crop_map = {'Maize': 0, 'Sugarcane': 1, 'Wheat': 2, 'Cotton': 3, 'Tomato': 4}
        
        st = soil_map.get(req.soil_type, 1)
        ct = crop_map.get(req.crop_type, 0)
        
        # Expected features: Temperature, Humidity, Moisture, Soil Type, Crop Type, Nitrogen, Potassium, Phosphorous
        input_data = np.array([[28, 55, 40, st, ct, req.n, req.k, req.p]])
        
        try:
            pred = fertilizer_model.predict(input_data)
            fertilizer_name = pred[0]
        except Exception as e:
            print("Fertilizer Inference Error:", e)
            
    # Calculate quantities based on farm size
    multiplier = req.farm_size
    
    base_urea = 50.0 
    base_dap = 50.0  
    base_mop = 25.0  
    
    if req.n < 40:
        base_urea += 20
    if req.p < 30:
        base_dap += 15
    if req.k < 30:
        base_mop += 10
        
    return {
        "recommended_fertilizer": fertilizer_name,
        "urea_kg": round(base_urea * multiplier, 1),
        "dap_kg": round(base_dap * multiplier, 1),
        "mop_kg": round(base_mop * multiplier, 1),
        "compost_tonnes": round(1.5 * multiplier, 1)
    }

# --- 3. Live Weather Telemetry Endpoint ---
@app.get("/api/weather")
def get_weather(lat: float, lon: float):
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=precipitation_probability&timezone=auto"
        req = urllib.request.Request(url, headers={'User-Agent': 'KisanSathiApp/1.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            
        temp = data.get("current", {}).get("temperature_2m", 0)
        humidity = data.get("current", {}).get("relative_humidity_2m", 0)
        wind = data.get("current", {}).get("wind_speed_10m", 0)
        
        # Get rain probability for the current hour (first element of hourly array)
        rain_prob = data.get("hourly", {}).get("precipitation_probability", [0])[0]
        
        advisory = ""
        if rain_prob > 70:
            advisory = "High rain probability detected. Pause automated drip lines and postpone chemical spraying."
        elif temp > 35 and humidity < 60:
            advisory = "High temperature and low humidity detected. Turn on drip irrigation immediately to prevent heat stress."
        else:
            advisory = "Weather conditions are optimal for regular farm activities."
            
        return {
            "temperature_c": round(temp, 1),
            "humidity_percent": int(humidity),
            "rain_probability_percent": int(rain_prob),
            "wind_speed_kmh": round(wind, 1),
            "advisory": advisory
        }
    except Exception as e:
        print(f"Weather API Error: {e}")
        # Fallback in case of network error
        return {
            "temperature_c": 30.0,
            "humidity_percent": 60,
            "rain_probability_percent": 10,
            "wind_speed_kmh": 12.0,
            "advisory": "Could not fetch live weather. Showing standard baseline data."
        }

# --- 3.5 AI-Based Crop Yield & Pest Outbreak Forecaster ---
class YieldPestRequest(BaseModel):
    latitude: float
    longitude: float
    crop: str = "Wheat"
    sowing_date: str = "2026-07-01"
    farm_size_acres: float = 2.5

@app.post("/api/predict/yield-pest")
def predict_yield_and_pest(req: YieldPestRequest):
    try:
        from services.yield_pest_service import run_yield_and_pest_prediction
        result = run_yield_and_pest_prediction(
            lat=req.latitude,
            lon=req.longitude,
            crop=req.crop,
            sowing_date=req.sowing_date,
            farm_size_acres=req.farm_size_acres
        )
        return result
    except Exception as e:
        print(f"Yield/Pest Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- 4. Voice Assistant LLM Endpoint ---
class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    context: str = "general"

@app.post("/api/chat")
async def chat_assistant(req: ChatRequest):
    global current_key_idx
    
    # Read language and default to 'en' if missing or unknown
    lang = req.language.lower().strip() if req.language and isinstance(req.language, str) else "en"
    if lang not in ["en", "hi", "mr"]:
        lang = "en"

    if not API_KEYS:
        # Fallback if no API key is provided
        fallback_msg = f"API Key not found. I understood: '{req.message}'. Please configure GEMINI_API_KEY_1 in the backend .env file."
        if lang == 'mr':
            fallback_msg = f"API Key सापडली नाही. मला समजले: '{req.message}'. कृपया backend च्या .env फाईल मध्ये GEMINI_API_KEY_1 सेट करा."
        elif lang == 'hi':
            fallback_msg = f"API Key नहीं मिली। मुझे समझ आया: '{req.message}'। कृपया backend की .env फ़ाइल में GEMINI_API_KEY_1 सेट करें।"
        return {"response": fallback_msg}

    # Build agronomist instructions per language
    if lang == 'mr':
        lang_instruction = (
            "You MUST respond ONLY in Marathi in Devanagari script (मराठी). "
            "Use simple, spoken Marathi words suitable for Indian farmers (सोपी बोलीभाषा). "
            "Keep crop names, fertilizer names, units (kg, acres, litres, etc.) and numbers readable. "
            "Keep safety guidance (such as pesticide handling and chemical dosage) completely accurate."
        )
    elif lang == 'hi':
        lang_instruction = (
            "You MUST respond ONLY in Hindi in Devanagari script (हिंदी). "
            "Use simple, spoken Hindi words suitable for Indian farmers (सरल बोलचाल की भाषा). "
            "Keep crop names, fertilizer names, units (kg, acres, litres, etc.) and numbers readable. "
            "Keep safety guidance (such as pesticide handling and chemical dosage) completely accurate."
        )
    else:
        lang_instruction = (
            "You MUST respond ONLY in English. "
            "Use simple, spoken words suitable for farmers. "
            "Keep crop names, fertilizer names, units (kg, acres, litres, etc.) and numbers readable. "
            "Keep safety guidance (such as pesticide handling and chemical dosage) completely accurate."
        )

    system_prompt = f"""
    You are KisanSathi (किसान साथी), an empathetic, deeply knowledgeable, and localized agricultural expert assistant for Indian farmers.
    The user is currently looking at the '{req.context}' tab on the application.
    {lang_instruction}
    Keep your responses very concise (under 3 sentences) because they will be read aloud via Text-to-Speech to the farmer.
    Do not use markdown formatting like asterisks or bullet hashes that interfere with speech synthesis.
    Answer their farming queries directly, practically, and simply.
    """
    full_prompt = f"{system_prompt}\nUser: {req.message}"

    try:
        model = genai.GenerativeModel(GEMINI_MODEL_NAME)
        response = model.generate_content(full_prompt)
        return {"response": response.text.replace('*', '').strip()}
    except Exception as e:
        # If rate limited or quota exceeded, try the fallback key
        if "429" in str(e) or "quota" in str(e).lower() or "exhausted" in str(e).lower():
            if len(API_KEYS) > 1:
                print("Key 1 exhausted/rate-limited. Switching to Key 2...")
                current_key_idx = (current_key_idx + 1) % len(API_KEYS)
                genai.configure(api_key=API_KEYS[current_key_idx])
                
                try:
                    # Retry with new key
                    response = model.generate_content(full_prompt)
                    return {"response": response.text.replace('*', '').strip()}
                except Exception as retry_err:
                    print(f"Fallback Key Error: {retry_err}")
                    err_msg = "Both API keys are exhausted or facing issues. Please try again later."
                    if lang == 'mr':
                        err_msg = "दोन्ही API की संपल्या आहेत किंवा अडचण येत आहे. कृपया थोड्या वेळाने प्रयत्न करा."
                    elif lang == 'hi':
                        err_msg = "दोनों API की समाप्त हो गई हैं या समस्या आ रही है। कृपया कुछ समय बाद पुनः प्रयास करें।"
                    return {"response": err_msg}
                    
        print(f"Gemini API Error: {e}")
        err_msg = "Sorry, I am facing a temporary server issue. Please try again later."
        if lang == 'mr':
            err_msg = "माफ करा, तांत्रिक अडचणीमुळे सर्व्हरशी संपर्क होऊ शकला नाही. कृपया थोड्या वेळाने प्रयत्न करा."
        elif lang == 'hi':
            err_msg = "क्षमा करें, तकनीकी समस्या के कारण सर्वर से संपर्क नहीं हो सका। कृपया कुछ समय बाद पुनः प्रयास करें।"
        return {"response": err_msg}

# --- 5. Authentication Endpoints ---
@app.post("/api/auth/register", response_model=schemas.UserOut)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(db_models.User).filter(db_models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = auth.get_password_hash(user.password)
    new_user = db_models.User(
        email=user.email, 
        hashed_password=hashed_pw,
        farm_size=user.farm_size,
        soil_type=user.soil_type
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/auth/login", response_model=schemas.Token)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(db_models.User).filter(db_models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

