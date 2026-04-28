# Study Guide: Classic Sentiment Analysis (Python) 🐍

Since you requested a Python-based project for placements, here is the exact code logic for the "Traditional" approach using Scikit-Learn. You should study this to explain the "before and after" of AI evolution in interviews.

## 1. The Logic Flow
1. **Text Cleaning**: Removing punctuation, numbers, and stopwords (the, is, at).
2. **Tokenization**: Breaking sentences into words.
3. **TF-IDF Vectorization**: Converting words to numbers based on their importance.
4. **Classification**: Using Logistic Regression to predict the label (Pos/Neg/Neu).

## 2. The Implementation (Copy-Paste for Study)

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# 1. Dataset (Synthetic for demo)
data = {
    'text': [
        'I love this product, it is amazing!',
        'This is the worst experience ever.',
        'It was an average movie, nothing special.',
        'Absolutely brilliant performance.',
        'I hate the new update, it broke everything.'
    ],
    'sentiment': ['positive', 'negative', 'neutral', 'positive', 'negative']
}
df = pd.DataFrame(data)

# 2. Text to Numbers (TF-IDF)
vectorizer = TfidfVectorizer(stop_words='english')
X = vectorizer.fit_transform(df['text'])
y = df['sentiment']

# 3. Model Training
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = LogisticRegression()
model.fit(X_train, y_train)

# 4. Prediction
new_input = ["This brand is getting better every day!"]
new_vec = vectorizer.transform(new_input)
prediction = model.predict(new_vec)

print(f"Prediction: {prediction[0]}")
```

## 3. Comparison for Interviews

| Feature | Classic (TF-IDF + LogReg) | Modern (Gemini LLM) |
|---------|---------------------------|----------------------|
| **Understanding** | Keyword based (Statistical) | Context based (Semantic) |
| **Sarcasm** | Usually fails | Usually catches it |
| **Setup Cost** | Low, runs on CPU | Requires API/GPU |
| **Maintenance** | Needs retrained often | Generalizes well out-of-box |

**Interview Power Answer:**
*"While I built my final dashboard using Gemini for state-of-the-art accuracy, I am well-versed in the foundations of NLP like TF-IDF vectorization and Logistic Regression. I understand how to pre-process text manually, but I chose Gemini to demonstrate my ability to work with modern generative AI architectures."*
