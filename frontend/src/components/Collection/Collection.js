import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import "../reset.css";
import "../Daily/Daily.css";
import "./Collection.css";
import { setCollection } from "./collectionSlice";

const Collection = () => {
    const [collection, setCollection] = useState([]);
    const collectionRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        fetch("/db/seoul.json")
            .then((res) => res.json())
            .then((data) => {
                setCollection(data);
                dispatch(setCollection(data));
            })
            .catch((err) => console.error("Failed to load seoul.json", err));
    }, []);

    useEffect(() => {
        const slider = collectionRef.current;
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
    }, [collection]);

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
            <div className="imgBanner2">
                <img src="/img/main_page/banner/middle_banner2.jpeg"></img>
            </div>

            <section className="CollectionBox">
                <div className='dailyWrap'>
                    <button className="slideBtn left" onClick={() => handleSlide(collectionRef, -1)}>‹</button>
                    <div className="dailySlider" ref={collectionRef}>
                        {collection.map((item) => (
                            <div key={item.id} className="dailyCard" onClick={() => navigate(`/seoul/${item.id}`)}>
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
                    <button className="slideBtn right" onClick={() => handleSlide(collectionRef, 1)}>›</button>
                </div>
            </section>
        </div>
    );
};

export default Collection;