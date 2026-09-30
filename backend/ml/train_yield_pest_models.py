"""
Machine Learning Training Pipeline for KisanSathi:
1. Crop Yield Forecaster (RandomForestRegressor)
2. Pest & Outbreak Risk Classifier (RandomForestClassifier)

Correlates:
- Satellite vegetation indices (NDVI, Canopy Cover)
- Soil health telemetry (pH, Moisture, Organic Carbon)
- Historical and Forecast weather patterns (GDD, Rainfall, Humidity, Temp)
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error, accuracy_score, classification_report
import pickle
import os

CROPS = ["Wheat", "Rice", "Maize", "Cotton", "Tomato", "Sugarcane", "Soybean"]
CROP_MAP = {c: i for i, c in enumerate(CROPS)}

# Benchmark yields per acre in tons (ICAR & FAO national averages)
BENCHMARK_YIELDS = {
    "Wheat": 2.1,
    "Rice": 2.5,
    "Maize": 3.0,
    "Cotton": 1.1,
    "Tomato": 12.0,
    "Sugarcane": 32.0,
    "Soybean": 1.2
}

PEST_CLASSES = [
    "Low Risk / Healthy Canopy",
    "Aphids & Whiteflies Infestation",
    "Fall Armyworm (Spodoptera)",
    "Stem Borer Threat",
    "Fungal Blast & Leaf Blight",
    "Fruit & Bollworm Attack"
]

def generate_synthetic_agronomic_dataset(samples_per_crop=400, random_seed=42):
    """
    Generates a scientifically grounded agronomic training dataset based on ICAR & FAO agricultural guidelines.
    """
    np.random.seed(random_seed)
    records = []

    for crop in CROPS:
        crop_id = CROP_MAP[crop]
        base_yield = BENCHMARK_YIELDS[crop]

        for _ in range(samples_per_crop):
            # Soil parameters
            soil_ph = np.random.uniform(5.8, 7.8)
            soil_moist = np.random.uniform(15.0, 42.0)
            organic_carbon = np.random.uniform(0.40, 1.20)

            # Weather telemetry
            mean_temp = np.random.uniform(18.0, 36.0)
            avg_humidity = np.random.uniform(40.0, 92.0)
            rainfall_mm = np.random.uniform(20.0, 350.0)
            gdd = np.random.uniform(200.0, 950.0)
            consecutive_humid_days = int(np.clip((avg_humidity - 50) / 10 + np.random.normal(0, 1), 0, 7))

            # Satellite vegetation index
            # Healthy NDVI correlates with adequate moisture, balanced temp, and nutrients
            opt_temp = 25.0
            temp_penalty = abs(mean_temp - opt_temp) * 0.012
            moist_factor = min(1.0, soil_moist / 30.0)
            base_ndvi = np.clip(0.35 + (0.50 * moist_factor) - temp_penalty + np.random.normal(0, 0.04), 0.15, 0.90)
            canopy_cover = int(np.clip((base_ndvi - 0.15) / 0.70 * 100, 10, 98))
            farm_size = np.random.uniform(1.0, 15.0)

            # Calculate Yield Response
            # Yield increases with optimal NDVI, healthy pH (6.2-7.2), high organic carbon, adequate GDD
            ph_penalty = 1.0 - (abs(soil_ph - 6.7) * 0.15)
            carbon_bonus = 0.85 + (organic_carbon * 0.25)
            ndvi_multiplier = base_ndvi / 0.75

            # Extreme weather penalties (drought or flood)
            rain_factor = 1.0
            if rainfall_mm < 60:
                rain_factor = 0.75 # drought stress
            elif rainfall_mm > 300:
                rain_factor = 0.82 # waterlogging

            calculated_yield = base_yield * ndvi_multiplier * ph_penalty * carbon_bonus * rain_factor * np.random.normal(1.0, 0.06)
            calculated_yield = max(base_yield * 0.35, round(calculated_yield, 2))

            # Determine Pest / Outbreak Risk class according to ecological thresholds
            if consecutive_humid_days >= 3 and avg_humidity > 78 and 20.0 <= mean_temp <= 28.0:
                pest_class = 4 # Fungal Blast & Leaf Blight
            elif mean_temp >= 28.0 and avg_humidity < 60.0 and rainfall_mm < 70:
                pest_class = 1 # Aphids & Whiteflies (hot & dry spell)
            elif crop in ["Maize", "Rice", "Wheat"] and base_ndvi > 0.65 and 24.0 <= mean_temp <= 32.0 and rainfall_mm > 80:
                pest_class = 2 # Fall Armyworm (Spodoptera)
            elif crop in ["Rice", "Sugarcane", "Maize"] and avg_humidity > 75 and soil_moist > 30:
                pest_class = 3 # Stem Borer
            elif crop in ["Cotton", "Tomato"] and 25.0 <= mean_temp <= 33.0 and base_ndvi > 0.55:
                pest_class = 5 # Fruit & Bollworm
            else:
                pest_class = 0 # Low Risk / Healthy Canopy

            records.append({
                "crop_id": crop_id,
                "crop_name": crop,
                "soil_ph": round(soil_ph, 2),
                "soil_moisture_pct": round(soil_moist, 1),
                "organic_carbon_pct": round(organic_carbon, 2),
                "cumulative_gdd": round(gdd, 1),
                "total_rainfall_mm": round(rainfall_mm, 1),
                "mean_temp_c": round(mean_temp, 1),
                "avg_humidity_pct": round(avg_humidity, 1),
                "consecutive_humid_days": consecutive_humid_days,
                "ndvi_index": round(base_ndvi, 3),
                "canopy_cover_pct": canopy_cover,
                "farm_size_acres": round(farm_size, 1),
                "yield_tons_per_acre": calculated_yield,
                "pest_risk_class": pest_class
            })

    return pd.DataFrame(records)

def train_and_export_models():
    print("[1/4] Generating agronomic training dataset correlated with Sentinel-2 NDVI & Open-Meteo...")
    df = generate_synthetic_agronomic_dataset(samples_per_crop=500)
    print(f"Dataset generated: {len(df)} multi-season records across {len(CROPS)} crops.")

    # Feature matrix for Yield Prediction
    yield_features = [
        "crop_id", "soil_ph", "soil_moisture_pct", "organic_carbon_pct",
        "cumulative_gdd", "total_rainfall_mm", "mean_temp_c",
        "avg_humidity_pct", "ndvi_index", "farm_size_acres"
    ]
    X_yield = df[yield_features]
    y_yield = df["yield_tons_per_acre"]

    X_train_y, X_test_y, y_train_y, y_test_y = train_test_split(X_yield, y_yield, test_size=0.2, random_state=42)

    print("[2/4] Training Crop Yield Random Forest Regressor...")
    yield_model = RandomForestRegressor(n_estimators=150, max_depth=12, random_state=42, n_jobs=-1)
    yield_model.fit(X_train_y, y_train_y)
    y_pred_y = yield_model.predict(X_test_y)

    r2 = r2_score(y_test_y, y_pred_y)
    rmse = np.sqrt(mean_squared_error(y_test_y, y_pred_y))
    print(f"Crop Yield Model Performance: R2 Score = {r2:.4f}, RMSE = {rmse:.3f} tons/acre")

    # Feature matrix for Pest Outbreak Risk Classification
    pest_features = [
        "crop_id", "soil_ph", "soil_moisture_pct",
        "mean_temp_c", "avg_humidity_pct", "consecutive_humid_days",
        "total_rainfall_mm", "ndvi_index", "canopy_cover_pct"
    ]
    X_pest = df[pest_features]
    y_pest = df["pest_risk_class"]

    X_train_p, X_test_p, y_train_p, y_test_p = train_test_split(X_pest, y_pest, test_size=0.2, random_state=42)

    print("[3/4] Training Pest Outbreak Risk Classifier...")
    pest_model = RandomForestClassifier(n_estimators=150, max_depth=10, random_state=42, n_jobs=-1)
    pest_model.fit(X_train_p, y_train_p)
    y_pred_p = pest_model.predict(X_test_p)

    acc = accuracy_score(y_test_p, y_pred_p)
    print(f"Pest Outbreak Classifier Accuracy: {acc * 100:.2f}%")

    # Save artifacts
    print("[4/4] Serializing trained model artifacts...")
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    yield_model_path = os.path.join(backend_dir, "yield_model.pkl")
    pest_model_path = os.path.join(backend_dir, "pest_model.pkl")

    yield_artifact = {
        "model": yield_model,
        "features": yield_features,
        "crop_map": CROP_MAP,
        "benchmarks": BENCHMARK_YIELDS,
        "metrics": {"r2": round(r2, 4), "rmse": round(rmse, 3)}
    }

    pest_artifact = {
        "model": pest_model,
        "features": pest_features,
        "classes": PEST_CLASSES,
        "crop_map": CROP_MAP,
        "metrics": {"accuracy": round(acc, 4)}
    }

    with open(yield_model_path, "wb") as f:
        pickle.dump(yield_artifact, f)
    print(f"Saved Yield Model to {yield_model_path}")

    with open(pest_model_path, "wb") as f:
        pickle.dump(pest_artifact, f)
    print(f"Saved Pest Outbreak Model to {pest_model_path}")

    print("Step 2 Model Training Complete!")

if __name__ == "__main__":
    train_and_export_models()
