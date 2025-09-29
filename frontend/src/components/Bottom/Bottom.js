import React, { useEffect, useState } from 'react';
import "../reset.css";
import "./Bottom.css";

const Bottom = () => {
    const [launching, setLaunching] = useState([]);
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        fetch("/db/launching.json")
            .then((res) => res.json())
            .then((data) => setLaunching(data));

        fetch("/db/board.json")
            .then((res) => res.json())
            .then((data) => setBoards(data));
    }, []);

    return (
        <div>
            <div className="bannerBottom">
                <img src="img/main_page/banner/bottom_banner.jpeg" alt="하단 배너" />
            </div>

            <section className="launchingBox">
                <div className='BottomTitle'>
                    <h1>Launching Calendar</h1>
                </div>
                <ul className="bottomList">
                    {launching.map((item, index) => (
                        <li key={index}>
                            <span className="bottomInfo">{item.info}</span>
                            <span className="bottomDate">{item.date}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="boardBox">
                <div className='BottomTitle'>
                    <h1>공지사항</h1>
                </div>
                <ul className="bottomList">
                    {boards.map((item, index) => (
                        <li key={index}>
                            <span className="bottomInfo">{item.info}</span>
                            <span className="bottomDate">{item.date}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mapBox">
                <div className='mapBoxLeft'><img src="/img/main_page/icon/map.jpg"></img></div>
                <div className='mapBoxRight'>
                    <div className='mapRightTitle'>
                        <p>러너들의 성지</p>
                        <h1>온유어마크 경복궁 매장</h1>
                    </div>
                    <div className='mapRightBody'>
                        <p><strong><span>OPEN</span></strong></p>
                        <p>화~금 : 오후 12시 ~ 오후 08시</p>
                        <p>토, 일, 법정공휴일 : 오전 10시 ~ 오후 07시</p>
                        <p>매주 월요일 휴무</p>
                        <br></br>
                        <br></br>
                        <p><strong><span>INFORMATION</span></strong></p>
                        <p>02-6958-5989 (내선 2번)</p>
                        <br></br>
                        <br></br>
                        <p><strong><span>LOCATION</span></strong></p>
                        <p>서울 종로구 자하문로6길 14</p>
                    </div>
                    <div className='mapRightBottom'>지도보기 +</div>
                </div>
            </section>
        </div>
    );
};

export default Bottom;
