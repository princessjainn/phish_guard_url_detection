from flask import Flask, request, jsonify
from flask_cors import CORS
from feature_extractor import URLFeatureExtractor
from model import PhishGuardModel

app = Flask(__name__)
CORS(app)

extractor = URLFeatureExtractor()
model = PhishGuardModel()

if not model.is_trained:
    print("⚠️  model not trained! run 'python train.py' first")
    print("api will return errors until model is trained")

@app.route('/')
def home():
    return jsonify({
        'status': 'vibing' if model.is_trained else 'needs training',
        'message': 'phishguard api is live 🔥' if model.is_trained else 'run train.py first',
        'endpoints': {
            'POST /api/check': 'check if url is sus',
            'GET /health': 'check api status'
        }
    })

@app.route('/health')
def health():
    return jsonify({
        'status': 'online',
        'model_trained': model.is_trained
    })

@app.route('/api/check', methods=['POST'])
def check_url():
    if not model.is_trained:
        return jsonify({'error': 'model not trained yet lol'}), 503
    
    data = request.get_json()
    url = data.get('url', '')
    
    if not url:
        return jsonify({'error': 'no url provided'}), 400
    
    try:
        features, explanations = extractor.extract_features(url)
        
        safety_score = model.calculate_safety_score(features)
        prediction = model.predict(features)
        risk_level, emoji, vibe = model.get_risk_level(safety_score)
        
        response = {
            'url': url,
            'safety_score': safety_score,
            'risk_level': risk_level,
            'emoji': emoji,
            'vibe': vibe,
            'phishing_probability': round(prediction['phishing_probability'] * 100, 2),
            'explanations': explanations if explanations else ['✅ looks clean to me'],
            'details': {
                'url_length': features['url_length'],
                'https': bool(features['has_https']),
                'sus_keywords': features['num_suspicious_keywords']
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': f'something broke: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
