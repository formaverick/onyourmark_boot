import React from 'react';
import "../reset.css";
import "./ImgIcon.css";

const ImgIcon = () => {
    return (
        <div>
            <section className="imgiconTop">
                <img src="/img/main_page/menu/menu1.jpg"></img>
                <img src="/img/main_page/menu/menu2.jpg"></img>
                <img src="/img/main_page/menu/menu3.jpg"></img>
            </section>

            <section className="imgiconBottom">
                <img src="/img/main_page/menu/menu4.jpg"></img>
                <img src="/img/main_page/menu/menu5.jpg"></img>
                <img src="/img/main_page/menu/menu6.jpg"></img>
            </section>
        </div>
    );
};

export default ImgIcon;