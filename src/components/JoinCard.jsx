import React, { useState } from "react";
import ApplicationFormNew from "./ApplicationFormNew";

const JoinCard = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full md:w-[823px] h-[200px] gap-[20px] p-4 text-white flex flex-col justify-center items-center text-center bg-white/10 backdrop-blur-[10px] border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl hover:scale-[1.02] transition-transform duration-300 ease-in-out">
      <h3 className="text-white font-semibold text-2xl leading-[2rem] tracking-[0em]">
        You Could Be One Of Us!
      </h3>
      <p className="text-center font-normal text-sm leading-[1.5rem] tracking-[0.1rem]">
        Apply Now To Join Our Team
      </p>
      <button
        style={{ boxShadow: "0px 6px 30px rgba(255, 255, 255, 0.1)" }}
        className="bg-[#AA1E6B] text-white font-semibold px-6 py-3 rounded-md transition"
        onClick={() => setShowModal(true)}
      >
        JOIN US NOW
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <ApplicationFormNew
            onSuccess={() => setShowModal(true)}
            onClose={() => setShowModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default JoinCard;