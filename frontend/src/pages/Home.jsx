import React from "react";
import MainSlider from "../components/MainSlider/MainSlider";
import TextBox from "../components/TextBox/TextBox";
import Daily from "../components/Daily/Daily";
import ImgIcon from '../components/ImgIcon/ImgIcon';
import Collection from '../components/Collection/Collection';
import Sale from '../components/Sale/Sale';
import Review from '../components/Review/Review';
import Bottom from '../components/Bottom/Bottom';

const Home = () => {
  return (
    <>
      <MainSlider />
      <TextBox />
      <Daily />
      <ImgIcon />
      <Collection />
      <Sale />
      <Review />
      <Bottom />
    </>
  );
};

export default Home;
