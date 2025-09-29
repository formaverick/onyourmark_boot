import React, { useEffect, useState } from 'react';
import "../reset.css";
import "./Review.css";

const Review = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch("/db/review.json")
            .then((res) => res.json())
            .then((data) => setReviews(data))
            .catch((err) => console.error("Failed to load review.json", err));
    }, []);

    return (
        <section className="reviewBox">
            <div className="reviewTitle"><h1>REVIEW</h1></div>

            <div className="reviewGrid">
                {reviews.map((item) => (
                    <div key={item.id} className="reviewCard" style={{ backgroundImage: `url(${item.backSrc})` }}>
                        <div className="reviewCardContent">
                            <div className='reviewTop'>
                                <p className="reviewTopText">{item.text}</p>
                                <p className='reviewName'>{item.name}**</p>
                            </div>

                            <div className="reviewBottom">
                                <img className="bottomImg" src={item.bottomSrc} alt="리뷰 이미지" />
                                <div className="bottomInfo">
                                    <p className="reviewTitleText">{item.title}</p>
                                    <p className="reviewScore">평점 {item.data} / 리뷰 {item.review}개</p>
                                </div>
                            </div>
                        </div>
                    </div>

                ))}
            </div>
        </section>
    );
};

export default Review;