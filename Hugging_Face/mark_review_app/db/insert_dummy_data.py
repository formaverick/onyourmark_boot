import sys
import os
import random
from sqlalchemy import create_engine, text
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.sentiment_model import analyze_sentiment

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

config_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'config.py')
if not os.path.exists(config_path):
    with open(config_path, 'w', encoding='utf-8') as f:
        f.write("DB_URI = 'mysql+pymysql://root:1234@localhost:3306/onyourmark'\n") 

from config import DB_URI 

sample_reviews = [
    "배송이 빨라서 좋았어요.",
    "사진과 실물이 조금 달라요.",
    "가성비 최고! 자주 이용할 것 같아요.",
    "포장이 허술해서 실망했어요.",
    "사이즈가 딱 맞고 편합니다.",
    "재질이 생각보다 별로였어요.",
    "색상이 화면과 동일해요.",
    "하루 종일 신었는데도 편안했어요.",
    "밑창이 미끄러워서 위험해요.",
    "디자인이 세련되고 마음에 들어요.",
    "상품 상태가 별로였어요.",
    "선물용으로 샀는데 상대가 좋아했어요.",
    "냄새가 심해서 환기가 필요했어요.",
    "가격 대비 품질이 만족스러워요.",
    "내구성이 조금 약한 것 같아요.",
    "첫 세탁에 물이 빠져요.",
    "퀄리티가 기대 이상이에요.",
    "배송이 지연돼서 불편했습니다.",
    "편안하고 자주 신을 것 같아요.",
    "한쪽이 불량이라 교환 요청했어요.",
    "포장도 꼼꼼하고 흠집 없이 왔어요.",
    "상품 설명이 부족해서 아쉬웠어요.",
    "신축성이 좋아서 활동하기 편해요.",
    "버튼이 금방 고장났어요.",
    "리뷰 보고 샀는데 기대 이상이에요.",
    "사이즈 교환 과정이 번거로웠어요.",
    "디테일이 섬세하고 고급스러워요.",
    "생각보다 무게가 무겁네요.",
    "세일가에 샀는데 만족스러워요.",
    "한 달 쓰고 나니 내구성이 떨어져요.",
]



member_ids = [2, 19, 20, 25, 26]

engine = create_engine(DB_URI)

with engine.begin() as conn:
    for _ in range(280):
        content = random.choice(sample_reviews)
        sentiment = analyze_sentiment(content)
        member_id = random.choice(member_ids)
        conn.execute(text("""
            INSERT INTO review (member_id, content, sentiment) 
            VALUES (:member_id, :content, :sentiment)
        """), {"member_id": member_id, "content": content, "sentiment": sentiment})

print("쇼핑몰 리뷰 더미 데이터 삽입 완료.")