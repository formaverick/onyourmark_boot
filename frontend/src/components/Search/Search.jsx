import React, { useState } from 'react';
import "../reset.css";
import "./Search.css";

const Search = ({ onClose }) => {
    const [inputValue, setInputValue] = useState("");
    const [searchLog, setSearchLog] = useState([
        "레이싱화",
        "디비에이트 나이트로 엘리트",
        "LifeStyle"
    ]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            setSearchLog(prev => [inputValue.trim(), ...prev.filter(item => item !== inputValue.trim())]);
            setInputValue("");
        }
    };

    const handleClearAll = () => {
        setSearchLog([]);
    };

    return (
        <div class="searchBox">
            <div class="searchDeleteBtn">
                <img src="img/main_page/icon/delete.webp" onClick={onClose} />
            </div>
            <div class="searchMainBox">
                <input type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown} />
                <img src="img/main_page/icon/search_icon.svg" />
            </div>
            <div class="searchlastBox">
                <div class="searchLog">
                    <div>
                        <p>최근 검색어</p>
                        <span onClick={handleClearAll}>전체삭제</span>
                    </div>

                    <table>
                        <tbody>
                           {searchLog.map((item, idx) => (
                                <tr key={idx}>
                                    <th>{item}</th>
                                    <td style={{ cursor: "pointer" }} onClick={() =>
                                        setSearchLog(log => log.filter((_, i) => i !== idx))
                                    }>X</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div class="searchLank">
                    <div>
                        <p>실시간 인기 검색어</p>
                        <span>2025-05-12 09:47</span>
                    </div>

                    <table>
                        <tbody>
                            <tr>
                                <th class="topRed">1</th>
                                <td class="topBold">아디오스 프로 4</td>
                            </tr>
                            <tr>
                                <th class="topRed">2</th>
                                <td class="topBold">레이싱화</td>
                            </tr>
                            <tr>
                                <th class="topRed">3</th>
                                <td class="topBold">Road</td>
                            </tr>
                            <tr>
                                <th>4</th>
                                <td>푸마</td>
                            </tr>
                            <tr>
                                <th>5</th>
                                <td>노바블라스트 5</td>
                            </tr>
                            <tr>
                                <th>6</th>
                                <td>노바블라스트</td>
                            </tr>
                            <tr>
                                <th>7</th>
                                <td>1080</td>
                            </tr>
                            <tr>
                                <th>8</th>
                                <td>에보</td>
                            </tr>
                            <tr>
                                <th>9</th>
                                <td>프로3</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Search;