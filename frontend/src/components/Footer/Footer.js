import React from 'react';
import "../reset.css";
import "./Footer.css";

const Footer = () => {
    return (
        <footer>
            <div className="footerWrap">
                <div className="footerLeft">
                    <img src="/img/main_page/icon/logo.jpg" alt="logo" className="footerLogo" />

                    <div className="footerInfo">
                        <h4>고객센터 정보</h4>

                        <p><strong>상담 전화</strong><br />02-6958-5989<br />(내선1번 온라인 쇼핑몰)<br />(내선2번 경복궁 매장)</p>

                        <p><strong>상담 이메일</strong><br />onyourmark@youngsan.co.kr</p>

                        <p><strong>온라인 쇼핑몰 운영 시간</strong><br />평일 오전 09:00 ~ 오후 06:00<br />점심시간 오후 12:30 ~ 오후 01:30<br />토, 일, 법정공휴일 휴무</p>

                        <p><strong>온라인 쇼핑몰 반품 주소</strong><br />서울 강서구 양천로 551-24 한화비즈메트로2차 203호</p>

                        <p><strong>계좌 정보</strong><br />우리은행 1005-081-420195 온유어마크 경복궁</p>

                        <div className='payMents'>
                            <img src="/img/main_page/icon/bt_ew_payments.png"></img>
                            <p>고객님은 안전거래를 위해 결제시 저희 쇼핑몰에서 가입한 구매안전 서비스를 이용하실 수 있습니다. [서비스가입정보확인]</p>
                        </div>
                    </div>
                </div>

                <div className="footerRight">
                    <ul className="footerMenu">
                        <li>공지사항</li>
                        <li>회사소개</li>
                        <li>경복궁매장</li>
                        <li>이용약관</li>
                        <li>개인정보처리방침</li>
                        <li>이용안내</li>
                        <li>자주 묻는 질문(FAQ)</li>
                    </ul>

                    <div className="footerBizInfo">
                        <h4>쇼핑몰 기본정보</h4>
                        <p><strong>상호명</strong> 온유어마크 경복궁 <strong>대표자명</strong>이승영</p>
                        <p><strong>사업장 주소</strong> 03044 서울특별시 종로구 자하문로6길 14 (통의동)</p>
                        <p><strong>사업자 등록번호</strong> 772-85-02380</p>
                        <p><strong>통신판매업 신고번호</strong> 2024-서울종로-0171 [사업자정보확인]</p>
                        <p><strong>개인정보보호책임자</strong> 김용현</p>
                        <p><strong>호스팅서비스</strong>카페24(주)</p>
                    </div>

                    <div className="footerSns">
                        <p>SNS</p>
                        <img src="/img/main_page/icon/insta_icon.webp" alt="instagram" />
                        <img src="/img/main_page/icon/facebook_icon.webp" alt="facebook" />
                        <img src="/img/main_page/icon/kakao_icon.png" alt="kakao" />
                    </div>

                    <div className="footerBottom">
                        <p>Copyright © 온유어마크 온라인 스토어. All Rights Reserved. Made by eru.Sun.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;