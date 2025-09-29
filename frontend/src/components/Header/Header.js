import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Search from "../Search/Search";
import useAuth from "../../hooks/useAuth";
import "../reset.css";
import "./Header.css";

function Header() {
  const wishCount = useSelector((state) => state.wish.items.length);
  const cartCount = useSelector((state) => state.cart.items.length);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // 바깥 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChanged"));
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <>
      <header>
        <div id="headerTop">
          <div className="topLeft">
            {auth.token ? (
              <>
                <Link to="/wish">관심상품 {wishCount}개</Link>
                <Link to="/cart">장바구니 {cartCount}개</Link>
              </>
            ) : (
              <Link to="/wish">관심상품 {wishCount}개</Link>
            )}
          </div>
          <div className="topRight">
            <ul>
              {auth.token ? (
                <>
                  <li>
                    <button
                      onClick={handleLogout}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        font: "inherit",
                      }}
                    >
                      로그아웃
                    </button>
                  </li>
                  <li>
                    <Link to="/mypage">마이페이지</Link>
                  </li>
                  <li>
                    <Link to="/cart">주문조회</Link>
                  </li>
                  <li>
                    <Link to="/wish">최근본상품</Link>
                  </li>
                  <li className="dropdown" ref={dropdownRef}>
                    <span
                      className="dropdownToggle"
                      onClick={() => setShowDropdown((prev) => !prev)}
                      style={{ cursor: "pointer" }}
                    >
                      고객센터 ▾
                    </span>
                    {showDropdown && (
                      <ul className="dropdownMenu">
                        <li>
                          <Link
                            to="/review"
                            onClick={() => setShowDropdown(false)}
                          >
                            상품 Review
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/board"
                            onClick={() => setShowDropdown(false)}
                          >
                            상품 Q&A
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/signup">회원가입</Link>
                  </li>
                  <li>
                    <Link to="/login">로그인</Link>
                  </li>
                  <li>
                    <Link to="/cart">주문조회</Link>
                  </li>
                  <li>
                    <Link to="/wish">최근본상품</Link>
                  </li>
                  <li className="dropdown" ref={dropdownRef}>
                    <span
                      className="dropdownToggle"
                      onClick={() => setShowDropdown((prev) => !prev)}
                      style={{ cursor: "pointer" }}
                    >
                      고객센터 ▾
                    </span>
                    {showDropdown && (
                      <ul className="dropdownMenu">
                        <li>
                          <Link
                            to="/review"
                            onClick={() => setShowDropdown(false)}
                          >
                            상품 Review
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/board"
                            onClick={() => setShowDropdown(false)}
                          >
                            상품 Q&A
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div id="headerBody">
          <Link to="/">
            <img
              src="/img/main_page/icon/logo.jpg"
              className="logo"
              alt="logo"
            />
          </Link>

          <div className="menuBarWrap">
            <ul>
              <li>
                <Link to="/notice" className="fontRed">
                  Launching Calendar
                </Link>
              </li>
              <li>
                <Link to="/daily/1">Brand</Link>
              </li>
              <li>
                <Link to="/daily/4">Mens</Link>
              </li>
              <li>
                <Link to="/daily/3">Womens</Link>
              </li>
              <li>
                <Link to="/daily/29">Gear</Link>
              </li>
              <li>
                <Link to="/daily/19">Watches</Link>
              </li>
              <li>
                <Link to="/seoul/39">Sunglasses</Link>
              </li>
              <li>
                <Link to="/seoul/46">Nutrition</Link>
              </li>
              <li>
                <Link to="/seoul/51" className="fontBlue">
                  Season off
                </Link>
              </li>
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
            <Link to="#">
              <img src="/img/main_page/icon/filter_icon.png" alt="filter" />
            </Link>
          </div>
        </div>
      </header>

      {showSearch && <Search onClose={() => setShowSearch(false)} />}
    </>
  );
}

export default Header;
