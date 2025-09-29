import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_index_page(client):
    rv = client.get('/')
    assert rv.status_code == 200 
    assert '리뷰를 입력하세요' in rv.get_data(as_text=True)

def test_sentiment_analysis(client):
    rv = client.post('/', data={'content': '배송이 정말 빨랐어요.'})
    assert rv.status_code == 200 
    assert '감성 분석 결과' in rv.get_data(as_text=True)