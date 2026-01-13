import React from "react";
import { NavLink, Link } from "react-router-dom";
import icon from "../../../assets/icons/icon.svg";

const IgniteIdeaSection = () => {
  return (
    <div className="w-full px-4 py-16 flex justify-center items-center bg-transparent">
      <div className="relative w-full max-w-5xl px-6 md:px-10 py-10 rounded-3xl overflow-hidden bg-white/1 backdrop-blur-sm shadow-[inset_0_0_14px_rgba(255,255,255,0.1),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)] flex flex-col gap-6">
        {/* Decorative Background Glass Layer */}
        <div className="absolute w-[1600px] h-[400px] -top-[100px] -left-[200px] backdrop-blur-sm pointer-events-none -z-10" />

        {/* Main Content */}
        <div className="flex flex-col gap-4 text-white">
          {/* Heading */}
          <h2 className="text-2xl md:text-4xl font-semibold leading-tight">
            Your Vision, Our Mission.
          </h2>

          {/* Subheading */}
          <p className="text-sm md:text-lg font-semibold leading-snug">
            Let’s bring your idea to life — together.
          </p>

          {/* CTA Button */}
          <Link to="/contact" className="w-[180px] h-[42px] py-4 bg-pink-700/90 rounded-[10px] shadow-[0px_0px_25px_0px_rgba(142,45,226,0.25)] inline-flex justify-center items-center gap-2 cursor-pointer">
            <div
              data-breakpoint="desktop"
              data-icon="idea"
              className="w-5 h-5 relative overflow-hidden"
            >
                <img src={icon} alt="" />
            </div>
            <div className="justify-start text-Colors-Text-Primary text-sm font-semibold font-['Inter'] uppercase tracking-tight">
              Ignite the Idea
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IgniteIdeaSection;