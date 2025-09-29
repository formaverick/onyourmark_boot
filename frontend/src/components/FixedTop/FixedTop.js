import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Search from "../Search/Search";
import useAuth from "../../hooks/useAuth";
import "../reset.css";
import "./FixedTop.css";
import "../Daily/Daily.css";

const FixedTop = () => {
  const [visible, setVisible] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const auth = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setVisible(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className={`fixedTop ${visible ? "show" : "hide"}`}>
        <div className="fixedTopWrap">
          <Link to="/">
            <img
              src="/img/main_page/icon/logo.jpg"
              className="logo"
              alt="logo"
            />
          </Link>

          <div className="menuBarWrap">
            <ul>
              <li className="fontRed">
                <Link to="/notice" className="fontRed">
                  Launching Calendar
                </Link>
              </li>
              <li>Brand</li>
              <li>Mens</li>
              <li>Womens</li>
              <li>Gear</li>
              <li>Watches</li>
              <li>Sunglasses</li>
              <li>Nutrition</li>
              <li className="fontBlue">Season off</li>
            </ul>
          </div>

          <div className="myPageWrap">
            {auth.token ? (
              <Link to="/mypage">
                <img src="/img/main_page/icon/mypage_icon.svg" alt="mypage" />
              </Link>
            ) : (
              <Link to="/login">
                <img src="/img/main_page/icon/mypage_icon.svg" alt="mypage" />
              </Link>
            )}
            <Link to="/cart">
              <img src="/img/main_page/icon/basket_icon.svg" alt="basket" />
            </Link>
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                setShowSearch(true);
              }}
            >
              <img src="/img/main_page/icon/search_icon.svg" alt="search" />
            </Link>
            <Link to="/qa">
              <img src="/img/main_page/icon/filter_icon.png" alt="filter" />
            </Link>
          </div>
        </div>
      </div>

      {showSearch && <Search onClose={() => setShowSearch(false)} />}
    </>
  );
};

export default FixedTop;
