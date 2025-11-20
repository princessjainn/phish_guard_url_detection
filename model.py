import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import os

class PhishGuardModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.is_trained = False
        self.model_path = 'phishguard_model.pkl'
        self.scaler_path = 'phishguard_scaler.pkl'
        
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
            self.load_model()
    
    def train_on_dataset(self, dataset_path='dataset.csv', sample_size=50000):
        from feature_extractor import URLFeatureExtractor
        
        print(f"loading dataset from {dataset_path}...")
        df = pd.read_csv(dataset_path)
        
        if sample_size and len(df) > sample_size:
            df = df.sample(n=sample_size, random_state=42)
            print(f"sampled {sample_size} URLs for training")
        
        extractor = URLFeatureExtractor()
        features_list = []
        labels = []
        
        print("extracting features from URLs...")
        for idx, row in df.iterrows():
            if idx % 5000 == 0:
                print(f"processed {idx}/{len(df)} URLs")
            try:
                features, _ = extractor.extract_features(row['url'])
                features_list.append(list(features.values()))
                labels.append(1 if row['type'] == 'phishing' else 0)
            except Exception as e:
                continue
        
        X = np.array(features_list)
        y = np.array(labels)
        
        print(f"training on {len(X)} samples...")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        self.scaler.fit(X_train)
        X_train_scaled = self.scaler.transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        self.model = RandomForestClassifier(
            n_estimators=150,
            max_depth=15,
            min_samples_split=5,
            random_state=42,
            n_jobs=-1,
            class_weight='balanced'
        )
        
        self.model.fit(X_train_scaled, y_train)
        self.is_trained = True
        
        train_score = self.model.score(X_train_scaled, y_train)
        test_score = self.model.score(X_test_scaled, y_test)
        
        print(f"training accuracy: {train_score*100:.2f}%")
        print(f"test accuracy: {test_score*100:.2f}%")
        
        self.save_model()
        
        return test_score
    
    def predict(self, features):
        if not self.is_trained:
            raise ValueError("Model not trained. Call train_demo_model() first.")
        
        feature_array = np.array(list(features.values())).reshape(1, -1)
        feature_scaled = self.scaler.transform(feature_array)
        
        prediction = self.model.predict(feature_scaled)[0]
        probability = self.model.predict_proba(feature_scaled)[0]
        
        return {
            'is_phishing': bool(prediction),
            'phishing_probability': float(probability[1]),
            'legitimate_probability': float(probability[0])
        }
    
    def calculate_safety_score(self, features):
        result = self.predict(features)
        safety_score = int((1 - result['phishing_probability']) * 100)
        return safety_score
    
    def get_risk_level(self, safety_score):
        if safety_score >= 75:
            return 'safe', '✅', 'all good fam'
        elif safety_score >= 50:
            return 'suspicious', '⚠️', 'kinda sus ngl'
        else:
            return 'phishing', '🚨', 'major red flags fr'
    
    def save_model(self):
        with open(self.model_path, 'wb') as f:
            pickle.dump(self.model, f)
        with open(self.scaler_path, 'wb') as f:
            pickle.dump(self.scaler, f)
    
    def load_model(self):
        try:
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            with open(self.scaler_path, 'rb') as f:
                self.scaler = pickle.load(f)
            self.is_trained = True
        except Exception as e:
            print(f"Error loading model: {e}")
            self.is_trained = False
