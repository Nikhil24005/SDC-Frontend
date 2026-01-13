import React from "react";
// import alumni3 from "../../../assets/graphics/alumni3.svg"; // Adjust path as needed
import alumni1 from "../../../assets/bandhusir.webp";
import alumni2 from "../../../assets/pansesir.webp";
import alumni3 from "../../../assets/sanket.webp";
const mentors = [
  {
    name: "Dr. Kailash Chandra Bandhu",
    title: "Chair-Person, Developers Community,\nMedi-Caps University",
    img: alumni1,
  },
  {
    name: "Dr. Prashant Panse",
    title: "Secretary, Developers Community,\nMedi-Caps University",
    img: alumni2,
  },
  {
    name: "Dr. Sanket Gupta",
    title: "Manager, Developers Community,\nMedi-Caps University",
    img: alumni3,
  },
];

const FacultyMentors = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-25">
      <h2 className="text-white text-4xl md:text-5xl font-bold mb-12 text-center">
        Faculty Mentors
      </h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full">
        {mentors.map((mentor, idx) => (
          <div
            key={idx}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl flex flex-col items-center p-6 w-[320px] md:w-[340px] transition-transform  shadow-[2px_2px_4px_0px_#00000040,inset_2px_2px_6px_0px_#FFFFFF80]"
          >
            <div className="w-full h-[280px] rounded-2xl overflow-hidden mb-4 flex items-center justify-center bg-gray-900/10">
              <img
                src={mentor.img}
                alt={mentor.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="w-full text-center">
              <div className="text-white text-xl font-bold mb-2">
                {mentor.name}
              </div>
              <div className="text-white text-base font-['IBM_Plex_Mono'] whitespace-pre-line">
                {mentor.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyMentors;