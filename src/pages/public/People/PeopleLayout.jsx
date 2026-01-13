// // src/routes/AppRoutes.jsx

import { Routes, Route } from "react-router-dom";

import FacultyCards from "../People/FacultyCards.jsx";
import TeamCards from "../People/TeamCards.jsx";
import AlumniCards from "../People/AlumniCards.jsx";

const HomeLayout = () => {
  return (
    <>
      <FacultyCards />
      <TeamCards />
      <AlumniCards />
    </>
  );
};
export default HomeLayout;
