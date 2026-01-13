import React from 'react';
import left from "../../../assets/graphics/leftimage.svg";
import right from "../../../assets/graphics/rightimage.svg";

const HeroSection = () => {
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br text-white">
          {/* Glass background box */}
          <div className="relative mt-25 w-full sm:h-[85vh] md:h-[75vh] rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[2px_2px_6px_#00000040,inset_2px_2px_6px_#FFFFFF20] overflow-hidden flex flex-col justify-center items-center px-4 sm:px-6">
            {/* Top-left & right glowing shapes */}
            <img
              src={left}
              alt="left"
              className="absolute top-0 left-0 w-[30vw] sm:w-[40vw] max-w-[70px] sm:max-w-[160px] md:max-w-[250px] object-contain z-10"
            />
            <img
              src={right}
              alt="right"
              className="absolute top-[70px] sm:top-0 right-0 w-[40vw] sm:w-[60vw] max-w-[130px] sm:max-w-[200px] md:max-w-[364px] object-contain z-10"
            />
    
            {/* Title */}
            <h1 className="text-center text-[7vw] sm:text-[4vw] font-bold leading-snug z-20 mt-4 sm:mt-0">
              <span className="text-transparent bg-clip-text bg-[linear-gradient(180deg,var(--Colors-Text-Primary,#FFF)_0%,var(--inputFileds-placeholderColour-Focus,#2B88A8)_200%)]">
                Empowering IDEAS
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-[linear-gradient(180deg,var(--Colors-Text-Primary,#FFF)_0%,var(--inputFileds-placeholderColour-Focus,#2B88A8)_100%)]">
                Through CODE
              </span>
            </h1>
    
            {/* Stats Box */}
            <div className="mt-6 sm:mt-10 bg-[#333333]/85 backdrop-blur-lg border border-cyan-400 text-cyan-300 rounded-xl flex justify-between items-center w-full max-w-[90%] sm:max-w-[500px] px-4 py-4 sm:px-6 sm:py-5 z-20">
              <div className="text-center flex-1">
                <div className="text-lg sm:text-2xl font-semibold">10+</div>
                <div className="text-xs sm:text-base text-cyan-200">Projects</div>
              </div>
              <div className="w-px h-10 bg-cyan-400 mx-2 sm:mx-4" />
              <div className="text-center flex-1">
                <div className="text-lg sm:text-2xl font-semibold">12+</div>
                <div className="text-xs sm:text-base text-cyan-200">Months</div>
              </div>
              <div className="w-px h-10 bg-cyan-400 mx-2 sm:mx-4" />
              <div className="text-center flex-1">
                <div className="text-lg sm:text-2xl font-semibold">50+</div>
                <div className="text-xs sm:text-base text-cyan-200">Students</div>
              </div>
            </div>
    
            {/* Subtext */}
            <p
              className="mt-4 sm:mt-8 text-xs md:text-lg sm:text-base text-white text-center max-w-xs sm:max-w-xl z-20"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              We’re a foundation driven by purpose and powered by technology —
              delivering software solutions that create lasting impact.
            </p>
    
            {/* Bottom vertical glass bars */}
            <div className="absolute bottom-0 left-0 w-full h-[35%] sm:h-[40%] flex z-10">
              {Array.from({ length: 30 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-black/20"
                  style={{
                    backdropFilter: "blur(90px)",
                    borderLeft:
                      idx !== 0 ? "0px solid rgba(255,255,255,0.4)" : "none",
                    boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.5)",
                  }}
                />
              ))}
            </div>
          </div>
        </section>
  );
};

export default HeroSection;
