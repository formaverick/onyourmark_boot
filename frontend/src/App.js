import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import FixedTop from "./components/FixedTop/FixedTop";
import Home from "./pages/Home";
import DetailPage from "./components/Detail/DetailPage";
import ScrollToTop from "./components/ScrollToTop";
import CartPage from "./components/Cart/CartPage";
import Login from "./components/Login/Login";
import SignupForm from "./components/Signup/SignupForm";
import SignupComplete from "./components/Signup/SignupComplete";
import Wish from "./components/Wish/Wish";
import QaBoard from "./components/Detail/QaBoard";
import Mypage from "./components/Mypage/Mypage";
import UpdateMemberPassword from "./components/Updatemember/UpdateMemberPassword";
import UpdateMemberForm from "./components/Updatemember/UpdateMemberForm";
import BoardPage from "./components/Board/BoardPage";
import MyPostsPage from "./components/Mypage/MyPostsPage";
import NoticeMain from "./components/Notice/NoticeMain";
import NoticeDetail from "./components/Notice/NoticeDetail";
import NoticeCreate from "./components/Notice/NoticeCreate";
import NoticeUpdate from "./components/Notice/NoticeUpdate";
import ReviewMain from "./components/Hugging/ReviewMain";
import ReviewDetail from "./components/Hugging/ReviewDetail";
import ReviewForm from "./components/Hugging/ReviewForm";
import { setProducts, setWeekly } from "./components/Daily/dailySlice";
import { setCollection } from "./components/Collection/collectionSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("/db/daily.json")
      .then((res) => res.json())
      .then((data) => dispatch(setProducts(data)));
  }, []);

  useEffect(() => {
    fetch("/db/week.json")
      .then((res) => res.json())
      .then((data) => dispatch(setWeekly(data)))
      .catch((err) => console.error("Failed to load week.json", err));
  }, []);

  useEffect(() => {
    fetch("/db/seoul.json")
      .then((res) => res.json())
      .then((data) => dispatch(setCollection(data)))
      .catch((err) => console.error("Failed to load seoul.json", err));
  }, []);

  return (
    <>
      <ScrollToTop />
      <FixedTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daily/:id" element={<DetailPage />} />
        <Route path="/seoul/:id" element={<DetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/posts/me" element={<MyPostsPage />} />
        <Route path="/account/verify" element={<UpdateMemberPassword />} />
        <Route path="/account/edit" element={<UpdateMemberForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/signup/complete" element={<SignupComplete />} />
        <Route path="/wish" element={<Wish />} />
        <Route path="/qa" element={<QaBoard />} />
        <Route path="/board/:id" element={<BoardPage />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/notice" element={<NoticeMain />} />
        <Route path="/notice/:id" element={<NoticeDetail />} />
        <Route path="/notice/create" element={<NoticeCreate />} />
        <Route path="/notice/update/:id" element={<NoticeUpdate />} />
        <Route path="/review" element={<ReviewMain />} />
        <Route path="/review/:id" element={<ReviewDetail />} />
        <Route path="/review/form" element={<ReviewForm />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
