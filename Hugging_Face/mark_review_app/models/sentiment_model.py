from transformers import pipeline

sentiment_pipeline = pipeline(
    'sentiment-analysis',
    model='nlptown/bert-base-multilingual-uncased-sentiment'
)

def analyze_sentiment(text):
    result = sentiment_pipeline(text)
    
    label = result[0]['label']
    score = int(label[0])
    return score
