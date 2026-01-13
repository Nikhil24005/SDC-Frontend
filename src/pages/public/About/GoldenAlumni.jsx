import { useState, useEffect } from "react";
import alumni3 from "../../../assets/graphics/alumni3.svg";
import leftArrow from "../../../assets/buttons/leftarrow.svg";
import rightArrow from "../../../assets/buttons/rightarrow.svg";
import { getGoldenAlumini } from "../../../api/Public/getGoldenAlumni"; 

export default function AlumniCarousel() {
  const [alumni, setAlumni] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoldenAlumni = async () => {
      setLoading(true);
      setError(null);
      try {
        const topAlumni = await getGoldenAlumini(); // ✅ NEW call
        setAlumni(topAlumni);
      } catch (err) {
        console.error("Error fetching golden alumni:", err);
        setError("Failed to load golden alumni.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoldenAlumni();
  }, []);

  useEffect(() => {
    if (alumni.length > 0) {
      setCurrentIndex(Math.floor(alumni.length / 2));
    }
  }, [alumni]);

  const total = alumni.length;

  // const handleNext = () => {
  //   if (total > 0) {
  //     setCurrentIndex((prev) => (prev + 1) % total);
  //   }
  // };

  // const handlePrev = () => {
  //   if (total > 0) {
  //     setCurrentIndex((prev) => (prev - 1 + total) % total);
  //   }
  // };

  return (
    <section className="relative py-16 text-white">
      <h2
        className="text-4xl font-bold text-center mb-12"
        style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 48 }}
      >
        Golden Alumni
      </h2>

      {loading ? (
        <div className="text-white text-center">Loading alumni...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : alumni.length === 0 ? (
        <div className="text-gray-400 text-center">No golden alumni found.</div>
      ) : (
        <div className="relative max-w-6xl mx-auto px-6">
          {/* Left Arrow */}
          {/* <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur p-3 rounded-xl transition hover:bg-white/20"
          >
            <img src={leftArrow} alt="Left" className="w-6 h-6" />
          </button> */}

          {/* Carousel */}
          <div className="overflow-x-auto ml-20">
  <div className="flex gap-6 px-4">
    {alumni.map((alum, idx) => (
      <div
        key={idx}
        className="flex-shrink-0 w-72 rounded-xl bg-white/10 backdrop-blur p-2"
         style={{
                boxShadow:
                  "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80",
              }}

      >
        <img
          src={
            alum.image?.startsWith("http") || alum.image?.startsWith("data:")
              ? alum.image
              : alumni3
          }
          alt={alum.aluminiName}
          className="rounded-[10px] w-full h-[230px] object-cover"
          onError={(e) => (e.target.src = alumni3)}
        />
        <div className="p-4 text-center">
          <h3 className="font-bold text-lg font-inter">{alum.aluminiName}</h3>
          <p className="text-sm text-gray-400 font-medium font-mono">
            Company Name - {alum.companyName}
          </p>
          <p className="text-sm mt-1 text-gray-400 font-semibold font-mono">
            LPA - {alum.lpa}
          </p>
          <p className="text-sm mt-2 text-gray-300 font-mono">
            {alum.content}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

          {/* Right Arrow */}
          {/* <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur p-3 rounded-xl transition hover:bg-white/20"
          >
            <img src={rightArrow} alt="Right" className="w-6 h-6" />
          </button> */}
        </div>
      )}
    </section>
  );
}