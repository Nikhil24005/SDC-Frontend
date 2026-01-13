import React, { useState, useEffect } from "react";
import { getAllGalleryImages } from "../../../api/gallery";

const SlidingCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const [events, setEvents] = useState([]);
  const cardsToShow = 3;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getAllGalleryImages();
        setEvents(data); // backend should send all gallery items
      } catch (error) {
        console.error("Failed to fetch gallery images:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    // Only start the interval if we have events data
    if (!events || events.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (direction === "right") {
          if (prev >= events.length - cardsToShow) {
            setDirection("left");
            return prev - 1;
          }
          return prev + 1;
        } else {
          if (prev <= 0) {
            setDirection("right");
            return prev + 1;
          }
          return prev - 1;
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [direction, events.length]);

  const getImageSource = (img) => {
    if (img.imageBase64) {
      if (img.imageBase64.startsWith("data:image/")) return img.imageBase64;
      return `data:image/jpeg;base64,${img.imageBase64}`;
    }
    if (img.image) {
      if (img.image.startsWith("http") || img.image.startsWith("data:image/")) return img.image;
      return `data:image/jpeg;base64,${img.image}`;
    }
    if (img.imageUrl) return img.imageUrl;
    return "";
  };

  return (
    <section className="text-white py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12" style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 48 }}>
        Glimpses of SDC
      </h2>

      {/* Show loading state if events haven't loaded yet */}
      {!events || events.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-white/70 text-lg">Loading gallery images...</p>
        </div>
      ) : (
        <>
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)` }}
            >
              {events.map((event, index) => (
                <div key={event.id || index} className="flex-shrink-0 px-3" style={{ width: `${100 / cardsToShow}%` }}>
                  <div
                    className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
                    style={{ boxShadow: "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80" }}
                  >
                    <div className="relative">
                      <img
                        src={getImageSource(event)}
                        alt={event.title || "Gallery Image"}
                        className="w-full h-48 object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-semibold mb-1" style={{ fontFamily: "Inter", fontWeight: 600 }}>
                          {event.title || "Event Title"}
                        </h3>
                        
                      </div>
                    </div>
                    
                    
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: Math.max(events.length - cardsToShow + 1, 1) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* View All Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => window.location.href = "/gallery"}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
              style={{ fontFamily: "Inter", fontWeight: 600 }}
            >
              VIEW ALL
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default SlidingCards;
