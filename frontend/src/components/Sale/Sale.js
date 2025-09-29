import React, { useEffect, useState, useRef } from 'react';
import "../reset.css";
import "../Daily/Daily.css";
import "./Sale.css";

const Sale = () => {
    const [sale, setSale] = useState([]);
    const SaleRef = useRef(null);

    useEffect(() => {
        fetch("/db/sale.json")
            .then((res) => res.json())
            .then((data) => setSale(data))
            .catch((err) => console.error("Failed to load daily.json", err));
    }, []);

    useEffect(() => {
        const slider = SaleRef.current;
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
    }, [sale]);

    const handleSlide = (ref, direction) => {
        if (!ref.current) return;
        const slider = ref.current;
        const card = slider.querySelector('.dailyCard');
        const cardWidth = card ? card.offsetWidth + 20 : 490;
        const scrollAmount = direction * cardWidth * 2; // 2칸씩 이동
      
        slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    return (
        <div>
            <div className="imgBanner3">
                <img src="/img/main_page/banner/middle_banner4.gif"></img>
            </div>

            <section className="saleBox">
                <div className='dailyTitle'>
                    <h1>Brand Sale Promotion</h1>
                    <p>특별한 기간에만 만나볼수 있는 기회</p>
                </div>

                <div className='weeklyWrap'>
                    <button className="slideBtn left" onClick={() => handleSlide(SaleRef, -1)}>‹</button>
                    <div className="dailySlider" ref={SaleRef}>
                        {sale.map((item) => (
                            <div key={item.id} className="dailyCard">
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
                                    {item.promotion && <p className="brandPromotionText">{item.promotion}</p>}
                                    {item.price_origin &&
                                        <p className="dailyPriceOrigin"><span>소비자가 : </span>{item.price_origin}</p>}
                                    <p className="dailyPrice">판매가 : {item.price}</p>
                                    <div className='tagBox'>
                                        {item.tag_black && <img className="tag_black" src={item.tag_black} alt="tag" />}
                                        {item.tag_red && <img className="tag_Red" src={item.tag_red} alt="tag" />}
                                        {item.tag_yellow && <img className="tag_yellow" src={item.tag_yellow} alt="tag" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="slideBtn right" onClick={() => handleSlide(SaleRef, 1)}>›</button>
                </div>
            </section>
        </div>
    );
};

export default Sale;