import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import headerLogo from "/Logowhite.png";
import BG from "/mesh-gradient.webp";
import button from "../assets/buttons/icons.svg"

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Work", path: "/work" },
  { label: "People", path: "/people" },
  { label: "Career", path: "/career" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="max-h-10">
      {/* Top horizontal bar */}
      <div className="fixed left-[15rem] top-0 w-[calc(100%-15rem)] h-[18px] bg-white/10 shadow-[inset_-5px_2px_5px_rgba(255,255,255,0.5)] backdrop-blur-sm z-40" />

      {/* Logo */}
      <div className="fixed top-0 left-0 z-50 h-24 w-60 flex items-center pointer-events-auto">
        <div className="bg-white/10 w-full shadow-[inset_4px_6px_4px_rgba(255,255,255,0.5)] backdrop-blur-sm rounded-br-xl p-3">
          <img
            src={headerLogo}
            alt="Logo"
            className="h-20 w-[180px] object-contain"
          />
        </div>
      </div>

      {/* Main Navbar */}
      <div className="fixed left-0 top-0 z-40 flex h-28 w-full items-center justify-end pr-20">
        {/* Desktop Menu */}
        <div className="bg-white/3 mt-6 hidden flex-wrap items-center gap-3 rounded-3xl p-3 shadow-[inset_2px_2px_6px_rgba(255,255,255,0.5)] backdrop-blur-sm md:flex pointer-events-auto">
          {navItems.map((item, idx) => (
            <Link to={item.path} key={idx}>
              <button
                className={`flex h-12 w-36 items-center justify-center rounded-xl text-lg font-semibold transition-all duration-200
                  ${
                    location.pathname === item.path
                      ? "bg-white/3 text-white text-xl shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)]"
                      : "text-white hover:text-xl hover:shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)]"
                  }`}
              >
                {item.label}
              </button>
            </Link>
          ))}
        </div>

        {/* Hamburger - Mobile */}
        <div className="fixed right-4 top-8 z-[9999] md:hidden pointer-events-auto">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-white/1 backdrop-blur shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)] rounded-xl p-2 border border-white/40 flex flex-col justify-center items-center gap-1 focus:outline-none"
          >
            {/* <span className="block h-1 w-6 rounded-sm bg-white"></span>
            <span className="block h-1 w-6 rounded-sm bg-white"></span>
            <span className="block h-1 w-6 rounded-sm bg-white"></span> */}

            <img src={button} alt="" className="w-9 h-9" />
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="fixed w-[50%] right-2 top-30 z-[9998] bg-white/1 backdrop-blur shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)] rounded-xl p-4 border border-white/40 md:hidden pointer-events-auto">
            <div className="flex flex-col gap-2">
              {navItems.map((item, idx) => (
                <Link
                  to={item.path}
                  key={idx}
                  onClick={() => setMenuOpen(false)}
                >
                  <button
                    className={`w-full rounded-xl py-3 text-center text-lg font-semibold transition-all duration-200
                      ${
                        location.pathname === item.path
                          ? "bg-white/1 text-white shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)]"
                          : "text-white hover:bg-white/1 hover:shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)] hover:text-lg"
                      }`}
                  >
                    {item.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Background Image */}
      <div className="relative w-full h-screen flex items-center justify-center">
        <img
          src={BG}
          alt="Header"
          className="fixed top-0 left-0 w-full h-screen object-cover -z-10 pointer-events-none"
        />
      </div>
    </div>
  );
};

export default Navbar;
