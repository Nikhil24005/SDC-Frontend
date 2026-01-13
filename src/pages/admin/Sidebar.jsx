import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const { pathname } = window.location;
  const links = [
    { to: "/admin/manage-testimonials", label: "TESTIMONIALS PAGE" },
    { to: "/admin/manage-about", label: "ABOUT DETAILS" },
    { to: "/admin/manage-work", label: "PROJECT PAGE" },
    { to: "/admin/manage-people", label: "PEOPLE PAGE" },
    { to: "/admin/manage-faqs", label: "FAQ'S PAGE" },
    { to: "/admin/manage-services", label: "QUERY ENTRIES" },
    { to: "/admin/manage-career", label: "APPLY ENTRIES" },
  ];
  return (
    <aside className="ml-[0.05rem] w-[240px] shadow-[2px_2px_4px_rgba(0,0,0,0.25),inset_2px_2px_8px_rgba(255,255,255,0.25)] backdrop-blur-[6px] pt-4 px-3 bg-[#EFEFEF26]/50 border-r-[1px] gap-[10px] border-b-[1px] border-[#FFFFFF80]/50 border-l-[1px]">
      <nav className="flex flex-col space-y-3 text-sm font-medium">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{ fontSize: 16, fontWeight: 600 }}
            className={`bg-[#00000040]/60 text-white font-mono backdrop-blur-[4px] shadow-[2px_4px_4px_rgba(0,0,0,0.25),inset_2px_2px_8px_rgba(255,255,255,0.25)] px-4 py-3 w-[212px] h-[44.1303px] rounded-md hover:border-[1px] hover:border-[#FFFFFF] transition-all duration-200 ${pathname === link.to ? 'border-2 border-[#FFFFFF80] bg-[#EFEFEF36] font-bold' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;