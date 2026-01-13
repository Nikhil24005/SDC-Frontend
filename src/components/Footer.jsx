import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logos/LogoWhite.png";
import mail from "../assets/icons/mail.png";
import phone from "../assets/icons/phone.png";
import linkeldin from "../assets/social/linkeldin.png";
import location from "../assets/icons/location.png";
import instagram from "../assets/social/instagram.webp";
import grid from "../assets/icons/grids.png";

const Footer = () => {
  return (
  <footer
    className="bg-white/10 bg-no-repeat  backdrop-blur-md w-full gap-[10px] rounded-xl py-[70px] px-[20px] sm:px-[30px] h-auto"
    style={{
      boxShadow: "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80",
       backgroundImage: `url(${grid})`,
       backgroundSize:"auto 88%",
       backgroundPosition:"bottom right",
      
       
    }}
  >
    <div className="w-full">
      <img
        src={logo}
        alt=""
        className="w-[180px] sm:w-[240px] h-auto mx-auto"
      />

      <div className="mt-12 text-white flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm sm:text-base">
        <Link to="/" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Home</Link>
        <Link to="/about" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>About</Link>
        <Link to="/services" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Services</Link>
        <Link to="/work" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Work</Link>
        <Link to="/people" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>People</Link>
        <Link to="/career" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Career</Link>
        <Link to="/contact" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Contact</Link>
        <Link to="/admin" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Admin</Link>
      </div>

      <div
        className="w-full sm:w-[546.43px] h-[15px] rounded-[5px] px-[30px] py-[10px] gap-[10px] mt-[3rem] mx-auto"
        style={{
          boxShadow:
            "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80",
        }}
      ></div>

      <div className="mt-[2rem] flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-white text-sm rounded-md">
        <div className="flex items-center">
          <img
            src={mail}
            alt=""
            className="h-[1.5rem] w-[1.5rem] mr-[0.5rem]"
          />
          <span>sdc@medicaps.ac.in</span>
        </div>

        <div className="flex items-center">
          <img
            src={phone}
            alt=""
            className="h-[1.5rem] w-[1.5rem] mr-[0.5rem]"
          />
          <span>+91-07313111500</span>
        </div>

        <div className="flex items-center">
          <img
            src={instagram}
            alt=""
            className="h-[1.5rem] w-[1.5rem] mr-[0.2rem]"
          />
          <span>medicaps_sdc</span>
        </div>

        <div className="flex items-center gap-2">
          <img
            src={linkeldin}
            alt=""
            className="h-[1.5rem] w-[1.5rem] mr-[0.2rem]"
          />
          <span>SDC_MedicapsUniversity</span>
        </div>
      </div>

      <div className="mt-[2rem] flex flex-wrap items-center justify-center gap-3 text-white/80 text-sm rounded-md text-center px-4">
        <img src={location} alt="" className="h-[1.5rem] w-[1.5rem]" />
        <span>
          A.B. Road Pigdamber, Rau, Indore, Madhya Pradesh 453331
        </span>
      </div>
    </div>
  </footer>
);

};

export default Footer;