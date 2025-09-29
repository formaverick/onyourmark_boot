from flask import Flask, render_template, request, redirect, url_for, jsonify, Response
from flask_cors import CORS
from models.sentiment_model import analyze_sentiment
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from config import DB_URI
import os
import random
import json

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:8080"])

engine = create_engine(DB_URI, echo=True)
Session = sessionmaker(bind=engine)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        content = request.form['content']
        sentiment = analyze_sentiment(content)

        member_ids = [2, 19, 20, 25, 26]

        with engine.begin() as conn:
            member_id = random.choice(member_ids)
            conn.execute(text("""
                INSERT INTO review (member_id, content, sentiment) 
                VALUES (:member_id, :content, :sentiment)
            """), {"member_id": member_id, "content": content, "sentiment": sentiment})

        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT content, sentiment FROM review
                WHERE ABS(sentiment - :sentiment) <= 1
                ORDER BY ABS(sentiment - :sentiment) ASC
                LIMIT 5
            """), {"sentiment": sentiment})
            recommendations = result.fetchall()

        return render_template('result.html', content=content, sentiment=sentiment, recommendations=recommendations)

    with engine.connect() as conn:
        result = conn.execute(text("SELECT content, sentiment FROM review ORDER BY review_id DESC LIMIT 20"))
        review_list = result.fetchall()

    return render_template('index.html', review_list=review_list)

# REST API (유사 리뷰 5개)
@app.route('/api/reviews', methods=['GET'])
def get_recent_reviews():
    
    sentiment = request.args.get("sentiment", 0, type=int)

    # 유사 리뷰 추천
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT review_id, content, sentiment
            FROM review
            WHERE ABS(sentiment - :sentiment) <= 1
            ORDER BY ABS(sentiment - :sentiment) ASC
            LIMIT 5
        """), {"sentiment": sentiment})
        recommendations = [dict(row._mapping) for row in result.fetchall()]

    return Response(
        json.dumps(recommendations, ensure_ascii=False),
        content_type='application/json; charset=utf-8'
    )

# REST API (분석)
@app.route('/analyze', methods=['POST'])
def api_analyze():
    try:
        data = request.get_json()
        content = data.get("content", "").strip()

        # 유효성 검사
        if not content:
            return Response(json.dumps({"status": "fail", "message": "리뷰 내용이 없습니다."}, ensure_ascii=False),
                            content_type='application/json; charset=utf-8'), 400
        if len(content) > 500:
            return Response(json.dumps({"status": "fail", "message": "리뷰가 너무 깁니다."}, ensure_ascii=False),
                            content_type='application/json; charset=utf-8'), 400

        # 감성 분석
        sentiment = analyze_sentiment(content)

        # 응답 JSON
        response_data = {
            "status": "success",
            "sentiment": sentiment
        }
        return Response(json.dumps(response_data, ensure_ascii=False),
                        content_type='application/json; charset=utf-8')

    except Exception as e:
        return Response(json.dumps({"status": "error", "message": str(e)}, ensure_ascii=False),
                        content_type='application/json; charset=utf-8'), 500


if __name__ == '__main__':
    app.run(debug=True)
