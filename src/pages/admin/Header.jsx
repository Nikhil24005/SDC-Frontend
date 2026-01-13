import React from 'react';
import logo from "../../assets/logos/logo.png";
import profileIcon from "../../assets/buttons/profile button.png";
import logoutIcon from "../../assets/icons/logout.png";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/admin/profile');
  };

  return (
    <header
      className="w-full h-[101px] rounded-r-md border border-[#FFFFFF80]/50 backdrop-blur-lg flex justify-between items-center px-8"
      style={{
        boxShadow:
          "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF40",
        backgroundColor: "rgba(239, 239, 239, 0.15)",
      }}
    >
      {/* Left - Logo */}
      <div>
        <img src={logo} alt="Logo" className="w-[190px] h-[70px]" />
      </div>

      {/* Right - Profile & Logout */}
      <div className="flex items-center gap-6">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-[125px] h-[45px] rounded-md px-4 py-2 border border-white text-white font-semibold text-sm shadow-[2px_4px_4px_rgba(0,0,0,0.25)]"
          style={{
            backgroundColor: "rgba(172, 172, 172, 0.25)",
            boxShadow: "inset 3px 3px 8px rgba(255, 255, 255, 0.3)",
          }}
        >
          <img src={logoutIcon} alt="Logout" className="w-5 h-5" />
          LOGOUT
        </button>

        {/* Profile Icon - Now clickable */}
        <button
          onClick={handleProfileClick}
          title={admin?.name || "Admin"}
          className="w-[45px] h-[45px]"
        >
          <img src={profileIcon} alt="Profile" className="w-[48px] h-[48px]" />
        </button>
      </div>
    </header>
  );
};

export default Header;
