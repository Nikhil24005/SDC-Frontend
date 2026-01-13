import React from "react";
import img from "../../../assets/logos/SDCframe.svg";

const Content = () => {
  return (
    <div className="w-full px-2 sm:px-4 md:px-10 py-12 flex justify-center items-center">
      <div className="w-full max-w-40  flex flex-row justify-center items-center gap-2 sm:gap-6">
        {/* Text Card */}
        <div className="w-[52vw] sm:w-[45vw] md:w-[380px] md:h-[24vw] h-[60vw] aspect-square relative rounded-3xl bg-white/10 shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)] overflow-hidden flex flex-col justify-center items-center shrink-0">
          {/* Glass Effect */}
          <div className="w-full h-full absolute left-full top-full bg-white/5 backdrop-blur-[3px] -z-10" />

          {/* Content */}
          <div
            className="w-full px-2 md:px-4 sm:px-6 py-6 flex flex-col items-start gap-4 max-h-[400px] overflow-y-auto"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE 10+
            }}
          >
            {/* Hide scrollbar in WebKit (Chrome, Safari, Edge) */}
            <style>
              {`
              div::-webkit-scrollbar {
                display: none;
              }
            `}
            </style>
            {/* Heading */}
            <div
              className="text-white/80 text-lg sm:text-2xl md:text-3xl font-semibold leading-tight"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Who are we?
            </div>

            {/* Description */}
            <div
              className="text-white/80 text-xs sm:text-sm md:text-base font-normal leading-relaxed text-justify"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              We’re a community of student developers from Medi-Caps University,
              driven by curiosity, collaboration, and a shared passion for
              technology. Built by students, for students — the Developers’
              Community is a space where ideas grow, problems are explored, and
              innovation thrives through teamwork and learning. We focus on
              turning ideas into action and learning into lasting impact!
            </div>
          </div>
        </div>

        {/* Image Box */}
        <div className="w-[45vw] sm:w-[45vw] md:w-[380px] md:h-[24vw] h-[52vw] aspect-square relative rounded-2xl overflow-hidden shrink-0">
          <img
            src={img}
            alt="Placeholder"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Content;
