import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "../reset.css";
import "./Daily.css";

const Daily = () => {
    const [products, setProducts] = useState([]);
    const [weeklyItems, setWeeklyItems] = useState([]);
    const dailyRef = useRef(null);
    const weeklyRef = useRef(null);
    const navigate = useNavigate();

    
    useEffect(() => {
        fetch("/db/daily.json")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error("Failed to load daily.json", err));
    }, []);

    
    useEffect(() => {
        fetch("/db/week.json")
            .then((res) => res.json())
            .then((data) => setWeeklyItems(data))
            .catch((err) => console.error("Failed to load week.json", err));
    }, []);

    
    useEffect(() => {
        const slider = dailyRef.current;
        if (!slider) return;
        const card = slider.querySelector('.dailyCard');
        const cardWidth = card ? card.offsetWidth + 20 : 490;
        let scrollAmount = 0;

        const interval = setInterval(() => {
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            scrollAmount = scrollAmount >= maxScroll - 10 ? 0 : scrollAmount + cardWidth;
            slider.scrollTo({ left: scrollAmount, behavior: "smooth" });
        }, 3000);

        return () => clearInterval(interval);
    }, [products]);

    
    useEffect(() => {
        if (!weeklyItems.length) return;
      
        const slider = weeklyRef.current;
        if (!slider) return;
      
        const card = slider.querySelector('.weeklyCard');
        const cardWidth = card ? card.offsetWidth + 20 : 490;
        let scrollAmount = 0;
      
        const interval = setInterval(() => {
          const maxScroll = slider.scrollWidth - slider.clientWidth;
          scrollAmount = scrollAmount >= maxScroll - 10 ? 0 : scrollAmount + cardWidth;
          slider.scrollTo({ left: scrollAmount, behavior: "smooth" });
        }, 3000);
      
        return () => clearInterval(interval);
    }, [weeklyItems]);
      

    
    const handleSlide = (ref, direction) => {
        if (!ref.current) return;
        const slider = ref.current;
        const card = slider.querySelector('.dailyCard');
        const cardWidth = card ? card.offsetWidth + 20 : 490;
        const scrollAmount = direction * cardWidth * 2;
      
        slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    return (
        <div>
            {/* Daily Section */}
            <section className="dailyBox">
                <div className='dailyTitle'>
                    <h1>Daily Highlights</h1>
                    <p>실시간 베스트 인기순위</p>
                </div>

                <div className='dailyWrap'>
                    <button className="slideBtn left" onClick={() => handleSlide(dailyRef, -1)}>‹</button>
                    <div className="dailySlider" ref={dailyRef}>
                        {products.map((item) => (
                            <div key={item.id} className="dailyCard" onClick={() => navigate(`/daily/${item.id}`)}>
                                <div className="dailyImgBox">
                                    <img
                                        src={item.src}
                                        onMouseOver={(e) => (e.currentTarget.src = item.src_hover)}
                                        onMouseOut={(e) => (e.currentTarget.src = item.src)}
                                        alt={item.title}
                                    />
                                </div>
                                <div className='dailyInfo'>
                                    <p className="dailyTitleText">{item.title}</p>
                                    <p className="dailyPrice">판매가 : {item.price}</p>
                                    {item.price_origin &&
                                        <p className="dailyPriceOrigin"><span>소비자가 : </span>{item.price_origin}</p>}
                                    <div className='tagBox'>
                                        {item.tag_black && <img className="tag_black" src={item.tag_black} alt="tag" />}
                                        {item.tag_red && <img className="tag_Red" src={item.tag_red} alt="tag" />}
                                        {item.tag_yellow && <img className="tag_yellow" src={item.tag_yellow} alt="tag" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="slideBtn right" onClick={() => handleSlide(dailyRef, 1)}>›</button>
                </div>
            </section>

            {/* 중간 배너 */}
            <div className="imgBanner">
                <img src="/img/main_page/banner/middle_banner.jpeg" alt="middle banner" />
            </div>

            {/* Weekly Section */}
            <section className="weeklyBox">
                <div className='dailyTitle'>
                    <h1>Weekly New Item</h1>
                    <p>이번주 신상품</p>
                </div>

                <div className='weeklyWrap'>
                    <button className="slideBtn left" onClick={() => handleSlide(weeklyRef, -1)}>‹</button>
                    <div className="dailySlider" ref={weeklyRef}>
                        {weeklyItems.map((item) => (
                            <div key={item.id} className="dailyCard weeklyCard" onClick={() => navigate(`/daily/${item.id}`)}>
                                <div className="dailyImgBox">
                                    <img
                                        src={item.src}
                                        onMouseOver={(e) => (e.currentTarget.src = item.src_hover)}
                                        onMouseOut={(e) => (e.currentTarget.src = item.src)}
                                        alt={item.title}
                                    />
                                </div>
                                <div className='dailyInfo'>
                                    <p className="dailyTitleText">{item.title}</p>
                                    <p className="dailyPrice">판매가 : {item.price}</p>
                                    {item.price_origin &&
                                        <p className="dailyPriceOrigin"><span>소비자가 : </span>{item.price_origin}</p>}
                                    <div className='tagBox'>
                                        {item.tag_black && <img className="tag_black" src={item.tag_black} alt="tag" />}
                                        {item.tag_red && <img className="tag_Red" src={item.tag_red} alt="tag" />}
                                        {item.tag_yellow && <img className="tag_yellow" src={item.tag_yellow} alt="tag" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="slideBtn right" onClick={() => handleSlide(weeklyRef, 1)}>›</button>
                </div>
            </section>
        </div>
    );
};

export default Daily;
