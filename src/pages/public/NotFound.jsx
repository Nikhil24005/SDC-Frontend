import React, { useRef, useState } from 'react';
import part1 from '../../assets/videos/404part-1.mp4';
import part2 from '../../assets/videos/404part-2.mp4';

const Error404Page = () => {
  const [showLoopVideo, setShowLoopVideo] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-6xl">
        <div className="backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Oh Noo!!
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4">
                The Lamb destroyed our server!!
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-8">
                The Page You Are Looking For Is Missing!
              </p>

              <button
                onClick={() => window.location.href = '/'}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center gap-2"
              >
                <span>🏠</span>
                RETURN TO HOME
              </button>
            </div>

            {/* Video Display */}
            <div className="flex-1 flex items-center justify-center">
              <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
                <div className="w-80 h-80 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
                  
                  {!showLoopVideo ? (
                    <video
                      autoPlay
                      muted
                      playsInline
                      onEnded={() => setShowLoopVideo(true)}
                      className="w-full h-full object-cover rounded-xl"
                    >
                      <source src={part1} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover rounded-xl"
                    >
                      <source src={part2} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404Page;
