import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pickle
import os

def train_fertilizer_model(csv_path):
    print("Initializing Fertilizer Recommendation Model Training...")
    
    # 1. Load Dataset
    if not os.path.exists(csv_path):
        print("Dataset not found. Creating a mock dataset for demonstration...")
        # Create a small mock dataset
        data = {
            'Temperature': [26, 29, 34, 20, 25, 28, 30],
            'Humidity': [52, 58, 60, 45, 55, 62, 50],
            'Moisture': [38, 45, 30, 20, 40, 50, 35],
            'Soil Type': [0, 1, 2, 0, 1, 2, 0], # Encoded: Sandy, Loamy, Black
            'Crop Type': [0, 1, 0, 2, 1, 0, 2], # Encoded: Maize, Sugarcane, Wheat
            'Nitrogen': [37, 12, 10, 40, 20, 15, 35],
            'Potassium': [0, 0, 15, 0, 10, 20, 5],
            'Phosphorous': [0, 40, 30, 10, 25, 35, 15],
            'Fertilizer Name': ['Urea', 'DAP', '14-35-14', 'Urea', '28-28', 'DAP', 'Urea']
        }
        df = pd.DataFrame(data)
    else:
        print(f"Loading data from {csv_path}...")
        df = pd.read_csv(csv_path)

    # 2. Preprocessing
    # Assuming categorical variables are already label encoded for this example
    X = df.drop('Fertilizer Name', axis=1)
    y = df['Fertilizer Name']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 3. Model Training
    print("Training RandomForestClassifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # 4. Evaluation
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy * 100:.2f}%")

    # 5. Save Model
    with open('fertilizer_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    print("Training complete. Model saved to fertilizer_model.pkl")

if __name__ == "__main__":
    # Point this to your downloaded Kaggle dataset
    CSV_PATH = "../data/Fertilizer Prediction.csv"
    train_fertilizer_model(CSV_PATH)
