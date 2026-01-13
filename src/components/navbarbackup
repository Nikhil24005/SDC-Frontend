import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import headerLogo from "/Logowhite.png";
import header from "/header.png";
import BG from "/mesh-gradient.webp";

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
      <div className="fixed left-0 top-0 z-50 flex h-24 w-full items-center gap-20">
        <div className="w-full p-3">
          <img
            src={headerLogo}
            alt="Logo"
            className="h-18 w-auto object-contain"
          />
        </div>
        <div className="fixed left-0 top-0 flex h-24 w-full items-center pl-60">
          <div className="fixed left-0 top-0 flex w-full items-center justify-between">
            <div className="flex h-full items-center">
              <img src={header} alt="Logo" className="h-36 w-auto" />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="bg-white/3 mt-6 hidden flex-wrap items-center gap-3 rounded-3xl p-3 shadow-[inset_2px_2px_6px_rgba(255,255,255,0.5)] backdrop-blur-sm md:flex">
            {navItems.map((item, idx) => (
              <Link to={item.path} key={idx}>
                <button
                  className={`flex h-12 w-36 items-center justify-center rounded-xl text-lg font-semibold transition-all duration-200
                  ${
                    location.pathname === item.path
                      ? "bg-white20 text-white text-xl shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)]"
                      : "text-white hover:text-xl hover:shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)]"
                  }`}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </div>

          {/* Hamburger - Mobile */}
          <div className="px-30 z-50 md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-6 w-8 flex-col justify-between focus:outline-none"
            >
              <span className="block h-1 rounded-sm bg-white"></span>
              <span className="block h-1 rounded-sm bg-white"></span>
              <span className="block h-1 rounded-sm bg-white"></span>
            </button>
          </div>

          {/* Mobile Dropdown */}
          {menuOpen && (
            <div className="absolute left-44 right-4 top-24 z-40 flex flex-col items-center gap-2 rounded-xl bg-white/5 p-4 backdrop-blur-md md:hidden">
              {navItems.map((item, idx) => (
                <Link to={item.path} key={idx} onClick={() => setMenuOpen(false)}>
                  <button
                    className={`w-full rounded-xl py-2 text-center text-base font-semibold transition-all duration-200
                    ${
                      location.pathname === item.path
                        ? "bg-white/10 text-white"
                        : "text-white hover:bg-white/10 hover:text-lg"
                    }`}
                  >
                    {item.label}
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Background Image */}
      <div className="relative w-full h-screen flex items-center justify-center">
        <img
          src={BG}
          alt="Header"
          className="fixed top-0 left-0 w-full h-screen object-cover -z-10"
        />
      </div>
    </div>
  );
};

export default Navbar;
