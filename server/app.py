from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from lime.lime_text import LimeTextExplainer

app = Flask(__name__)
CORS(app)

# Load lexicon for sentiment analysis
lexicon = {}
with open("vader_lexicon.txt", "r") as f:  # Replace with actual path to lexicon.txt
    for line in f:
        if not line.startswith("#"):
            tokens = line.split('\t')
            lexicon[tokens[0]] = float(tokens[1])

# Function to calculate sentiment score based on lexicon
def get_sentiment_score(text):
    tokens = re.findall(r'\b\w+\b', text.lower())
    score = 0
    for token in tokens:
        if token in lexicon:
            score += lexicon[token]
    return score

# Sample dataset: text and stressed labels (1 for stressed, 0 for not stressed)
data = [
    ("I'm feeling overwhelmed with all these deadlines", 1),
    ("I am enjoying my day", 0),
    ("Work is killing me right now", 1),
    ("Had a relaxing evening", 0),
    ("I am so stressed out about this project", 1),
    ("Today has been peaceful", 0),
    ("I am Sad", 1),
    ("I am Happy", 0),
    ("I am Stressed", 1),
    ("I am Not Stressed", 0),
    ("I am depressed", 1),
    ("I am not depressed", 0)
]

# Create a DataFrame
df = pd.DataFrame(data, columns=["text", "stressed"])

# Apply sentiment score based on lexicon to the DataFrame
df['sentiment_score'] = df['text'].apply(get_sentiment_score)
X = df['text']
y = df['stressed']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Convert text data into numerical features using CountVectorizer
vectorizer = CountVectorizer()
X_train_vect = vectorizer.fit_transform(X_train)
X_test_vect = vectorizer.transform(X_test)

# Train Logistic Regression model
model = LogisticRegression()
model.fit(X_train_vect, y_train)

# Predict stress and explain using LIME
@app.route('/predict', methods=['POST'])
def predict_stress():
    try:
        data = request.json
        user_input = data.get('text', '').strip()

        # Ensure that the input is not empty
        if not user_input:
            return jsonify({"error": "Input text cannot be empty"}), 400

        # Preprocess user input
        user_input_vect = vectorizer.transform([user_input])
        prediction_prob = model.predict_proba(user_input_vect)[0]

        # Predict based on higher confidence (not using fixed threshold)
        prediction = 1 if prediction_prob[1] > prediction_prob[0] else 0

        # LIME explainer
        explainer = LimeTextExplainer(class_names=['Not Stressed', 'Stressed'])

        # Define custom predict function for LIME
        def custom_predict(texts):
            texts_vect = vectorizer.transform(texts)
            return model.predict_proba(texts_vect)

        # Generate explanation using LIME
        exp = explainer.explain_instance(user_input, custom_predict, num_features=6, labels=[1])
        explanation = exp.as_list()

        # Prepare the response
        response = {
            "prediction": "Stressed" if prediction == 1 else "Not Stressed",
            "confidence": {
                "not_stressed": prediction_prob[0],
                "stressed": prediction_prob[1]
            },
            "explanation": explanation  # Explanation for the prediction
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
