import React, { useEffect, useState } from "react";
import "../reset.css";
import "./MainSlider.css";

function MainSlider() {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch("/db/banner.json")
            .then((res) => res.json())
            .then((data) => {
                setImages(data);
            })
            .catch((error) => {
                console.error("Error loading banner.json:", error);
            });
    }, []);

    useEffect(() => {
        if (images.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images]);

    return (
        <div className="sliderWrap">
            <div className="mainSlider">
                <ul>
                    {images.map((item, index) => (
                        <li
                            key={index}
                            className={index === currentIndex ? "active" : ""}
                        >
                            <img src={item.img} alt={`banner${index + 1}`} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MainSlider;