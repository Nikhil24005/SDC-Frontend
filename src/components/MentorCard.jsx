import React from "react";
import linkedin from "../assets/social/linkeldin.png";
import GitIcon from "../assets/social/GitIcon.svg";
import alumni3 from "../assets/graphics/alumni3.svg";

const MentorCard = ({ name, title, role, position, image }) => {
  return (
    <div className="w-full min-h-[200px] gap-[20px] p-4 text-white flex flex-row items-center bg-white/10 backdrop-blur-[10px] border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl hover:scale-[1.02] transition-transform duration-300 ease-in-out">
      <div className="w-[121px] h-[168px] rounded-lg overflow-hidden">
        <img
          src={image || alumni3}
          alt={name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-col justify-center text-left h-[168px] w-full md:w-[237px]">
        <h3 className="opacity-100 font-semibold text-xl leading-tight tracking-[0rem] font-serif">
          {name}
        </h3>
        {title && (
          <p className="opacity-100 text-left font-normal text-[14px] leading-[20px] tracking-normal font-serif whitespace-pre-line">
            {title}
          </p>
        )}
        {role && (
          <p className="opacity-100 text-center font-normal text-[14px] leading-[20px] tracking-normal font-serif">
            {role}
          </p>
        )}
        {position && (
          <p className="opacity-100 font-normal text-[14px] leading-[24px] tracking-normal font-serif">
            {position}
          </p>
        )}
        <div className="flex items-center gap-4 mt-5">
          <img
            src={linkedin}
            alt="LinkedIn"
            className="w-10 h-10 cursor-pointer hover:opacity-80"
          />
          <img
            src={GitIcon}
            alt="GitIcon"
            className="w-10 h-10 cursor-pointer hover:opacity-80"
          />
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
