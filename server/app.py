from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from lime.lime_text import LimeTextExplainer

app = Flask(__name__)
CORS(app)

# Load or generate dataset and prepare models
lexicon = {}
with open("vader_lexicon.txt", "r") as f:
    for line in f:
        if not line.startswith("#"):
            tokens = line.split('\t')
            lexicon[tokens[0]] = float(tokens[1])

def get_sentiment_score(text):
    tokens = re.findall(r'\b\w+\b', text.lower())
    score = sum(lexicon.get(token, 0) for token in tokens)
    return score

data = "synthetic_stress_dataset.txt"
df = pd.read_csv(data, sep='\t', header=None, names=["text", "stressed"])
df['sentiment_score'] = df['text'].apply(get_sentiment_score)
X = df['text']
y = df['stressed']

vectorizer = TfidfVectorizer(max_features=5000)
X_vect = vectorizer.fit_transform(X)
model = MultinomialNB().fit(X_vect, y)

@app.route('/predict', methods=['POST'])
def predict_stress():
    data = request.json
    user_input = data.get('text', '').strip()
    if not user_input:
        return jsonify({"error": "Input text cannot be empty"}), 400

    user_input_vect = vectorizer.transform([user_input])
    prediction_prob = model.predict_proba(user_input_vect)[0]
    prediction = 1 if prediction_prob[1] > prediction_prob[0] else 0

    explainer = LimeTextExplainer(class_names=['Not Stressed', 'Stressed'])
    def custom_predict(texts):
        return model.predict_proba(vectorizer.transform(texts))
    exp = explainer.explain_instance(user_input, custom_predict, num_features=6, labels=[1])
    explanation = exp.as_list()

    response = {
        "prediction": "Stressed" if prediction == 1 else "Not Stressed",
        "confidence": {
            "not_stressed": prediction_prob[0],
            "stressed": prediction_prob[1]
        },
        "explanation": explanation
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
