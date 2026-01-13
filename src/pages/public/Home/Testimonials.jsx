import { useState, useEffect } from 'react';
import { getTestimonials } from '../../../api/Public/getTestimonials';
import upButton from "../../../assets/buttons/upbutton.svg";
import downButton from "../../../assets/buttons/downbutton.svg";

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState([]);
  const [index, setIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null); // ✅ NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getTestimonials();
        const mapped = Array.isArray(response.data)
          ? response.data.map((t) => ({
              name: t.name,
              text: t.message,
              image: t.image,
              designation: t.designation,
              company: t.company
            }))
          : [];
        setTestimonials(mapped);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load testimonials.");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % testimonials.length), 4000);
    return () => clearInterval(interval);
  }, [testimonials]);

  if (loading) {
    return <div className="w-full text-center py-20 text-white">Loading testimonials...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-20 text-red-400">{error}</div>;
  }

  if (testimonials.length === 0) {
    return <div className="w-full text-center py-20 text-white">No testimonials found.</div>;
  }

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const visible = [
    testimonials[(index - 1 + testimonials.length) % testimonials.length],
    testimonials[index],
    testimonials[(index + 1) % testimonials.length],
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-20 px-4 flex flex-col items-center text-white">
      <h2 className="text-4xl font-semibold mb-12 text-center">Testimonials</h2>

      <div className="relative w-full flex flex-col gap-8 bg-white/5 backdrop-blur-2xl shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)] rounded-2xl overflow-hidden">
        {/* Up Button */}
        <button
          onClick={prev}
          className="absolute top-20 right-4 z-20 bg-white/10 p-4 rounded-2xl shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)] cursor-pointer"
        >
          <img src={upButton} alt="Up" className="w-6 h-6" />
        </button>

        {/* Testimonial Cards */}
        <div className="flex flex-col transition-all duration-700 ease-in-out">
          {visible.map((t, i) => {
            const globalIndex = (index - 1 + i + testimonials.length) % testimonials.length;
            const maxLength = i === 1 ? 100 : 50;
            const isExpanded = expandedIndex === globalIndex;
            const showReadMore = t.text && t.text.length > maxLength;
            const displayText = isExpanded ? t.text : t.text.slice(0, maxLength) + (showReadMore ? "..." : "");
            const imageSrc = t.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name || "User")}`;

            return (
              <div
                key={`${t.name}-${i}`}
                className={`flex items-start gap-4 py-4 px-4 md:px-4 md:py-2 sm:px-8 sm:py-6 rounded-3xl w-full max-w-3xl transition-all duration-500 ease-in-out ${
                  i === 1 ? "scale-100 opacity-100" : "scale-90 opacity-40"
                }`}
              >
                <img
                  src={imageSrc}
                  alt={t.name}
                  className={`object-cover transition-all duration-500 ease-in-out ${
                    i === 1
                      ? "w-30 h-30 md:w-38 md:h-40 sm:w-28 sm:h-28 rounded-2xl"
                      : "w-20 h-20 md:w-30 md:h-30 sm:w-24 sm:h-24 rounded-2xl"
                  }`}
                />
                <div>
                  <h4 className="text-lg md:text-lg sm:text-xl font-semibold mb-1">{t.name}</h4>
                  <p className="text-sm md:text-base sm:text-base text-white/80 max-w-xl text-justify" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    {displayText}
                    {showReadMore && !isExpanded && (
                      <button
                        className="ml-2 underline cursor-pointer text-xs text-white/80"
                        onClick={() => setExpandedIndex(globalIndex)}
                      >
                        Read More
                      </button>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Down Button */}
        <button
          onClick={next}
          className="absolute bottom-20 right-4 z-20 shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)] bg-white/10 p-4 rounded-2xl cursor-pointer"
        >
          <img src={downButton} alt="Down" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
