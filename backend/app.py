
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from deep_translator import GoogleTranslator

app = Flask(__name__)
CORS(app)

# Load model files
model = joblib.load("crop_model.pkl")
scaler = joblib.load("scaler.pkl")
le = joblib.load("label_encoder.pkl")


# 🌾 Base English Tips
T = {
    "nitrogen_low": "Nitrogen is low → Add urea or compost",
    "phosphorus_low": "Phosphorus is low → Use DAP fertilizer",
    "potassium_low": "Potassium is low → Add potash or ash",
    "acidic": "Soil is acidic → Add lime",
    "alkaline": "Soil is alkaline → Add gypsum",
    "good": "Soil is good. Maintain current practices"
}


# 🌱 Health text (base English)
HEALTH_TEXT = {
    "acidic": "Soil is acidic ⚠️",
    "alkaline": "Soil is alkaline ⚠️",
    "excellent": "Excellent Soil 🌱",
    "good": "Good Soil 🌿",
    "poor": "Poor Soil ❌"
}


# 🌐 Translator (single instance for speed)
def translate_text(text, lang):
    try:
        if lang == "en":
            return text
        return GoogleTranslator(source='en', target=lang).translate(text)
    except:
        return text  # fallback


# 🌾 Generate Tips
def generate_tips(n, p, k, ph):
    tips = []

    if n < 50:
        tips.append(T["nitrogen_low"])
    if p < 30:
        tips.append(T["phosphorus_low"])
    if k < 40:
        tips.append(T["potassium_low"])
    if ph < 5.5:
        tips.append(T["acidic"])
    elif ph > 7.5:
        tips.append(T["alkaline"])

    if not tips:
        tips.append(T["good"])

    return tips


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    lang = data.get("lang", "en")

    try:
        n = float(data["nitrogen"])
        p = float(data["phosphorus"])
        k = float(data["potassium"])
        temp = float(data["temperature"])
        hum = float(data["humidity"])
        ph = float(data["ph"])
        rain = float(data["rainfall"])

        features = np.array([[n, p, k, temp, hum, ph, rain]])
        scaled = scaler.transform(features)

        prediction = model.predict(scaled)[0]
        probs = model.predict_proba(scaled)

        crop = le.inverse_transform([prediction])[0]
        confidence = round(np.max(probs) * 100, 2)

        # 🌐 Translate crop
        crop_translated = translate_text(crop, lang)

        # 🌱 Health logic
        if ph < 5.5:
            health_key = "acidic"
        elif ph > 7.5:
            health_key = "alkaline"
        elif n > 80 and p > 60 and k > 60:
            health_key = "excellent"
        elif n > 50 and p > 40 and k > 40:
            health_key = "good"
        else:
            health_key = "poor"

        # 🌐 Translate health
        health = translate_text(HEALTH_TEXT[health_key], lang)

        # 🌐 Generate + translate tips
        base_tips = generate_tips(n, p, k, ph)
        tips = [translate_text(tip, lang) for tip in base_tips]

        return jsonify({
            "crop": crop_translated,
            "confidence": confidence,
            "health": health,
            "tips": tips
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)