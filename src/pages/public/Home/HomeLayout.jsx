// // src/routes/AppRoutes.jsx

import { Routes, Route } from "react-router-dom";

import HeroSection from "../Home/HeroSection.jsx";
import Services from "../Home/Services.jsx";
import Content from "../Home/Content.jsx";
import Testimonials from "../Home/Testimonials.jsx";
import IgniteIdeaSection from "../Home/IgniteIdeaSection.jsx";
import FeatureProject from "../Home/FeatureProject.jsx"

const HomeLayout = () => {
  return (
    <>
      <HeroSection />
      <Services />
      <Content />
      <FeatureProject />
      <Testimonials />
      <IgniteIdeaSection />
    </>
  );
};
export default HomeLayout;
