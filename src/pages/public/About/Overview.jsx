import React, { useEffect, useState } from "react";
import { getAllGalleryImages } from "../../../api/gallery";

const OverviewSection = () => {
  const [aboutImages, setAboutImages] = useState([]);

  useEffect(() => {
    const fetchAboutImages = async () => {
      try {
        const data = await getAllGalleryImages();

        const savedIds =
          JSON.parse(localStorage.getItem("aboutImageIds")) || [];
        if (savedIds.length > 0) {
          const aboutOnly = savedIds
            .map((id) => data.find((img) => img.id === id))
            .filter(Boolean); // Remove nulls if any
          setAboutImages(aboutOnly);
        } else {
          setAboutImages(data.slice(0, 4)); // fallback
        }
      } catch (error) {
        console.error("Failed to fetch About images:", error);
      }
    };

    fetchAboutImages();
  }, []);

  const getImageSource = (img) => {
    if (img.imageBase64) {
      if (img.imageBase64.startsWith("data:image/")) {
        const base64Part = img.imageBase64.split(",")[1];
        try {
          const decoded = atob(base64Part);
          if (decoded.startsWith("http")) return decoded;
        } catch {}
        return img.imageBase64;
      }
      return `data:image/jpeg;base64,${img.imageBase64}`;
    }
    if (img.imagebase64) {
      return img.imagebase64.startsWith("data:image/")
        ? img.imagebase64
        : `data:image/jpeg;base64,${img.imagebase64}`;
    }
    if (img.image) {
      if (img.image.startsWith("data:image/") || img.image.startsWith("http"))
        return img.image;
      return `data:image/jpeg;base64,${img.image}`;
    }
    if (img.imageUrl) return img.imageUrl;
    if (img.url) return img.url;
    return "";
  };

  return (
    <>
      {/* Overview Section */}
      <section className="max-w-5xl mx-auto mt-20 p-6 rounded-2xl bg-white/10 backdrop-blur-[10px] border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] text-center transition-transform duration-300 ease-in-out">
        <h2
          className="text-white font-semibold mb-4"
          style={{ fontFamily: "Inter", fontSize: 48 }}
        >
          Overview
        </h2>
        <p
          className="text-gray-200 font-mono text-justify"
          style={{ fontSize: 16 }}
        >
          The Developers’ Community is a student-led initiative at Medi-Caps
          University, designed to empower aspiring developers through
          collaboration, innovation, and hands-on problem-solving. It serves as
          a dynamic space where students come together to explore real-world
          challenges, exchange ideas, and build impactful tech-driven solutions.
          The platform drives a culture of continuous learning, peer-to-peer
          growth, and purpose-driven development — beyond the boundaries of the
          classroom.
        </p>
      </section>

      {/* About Image Grid */}
      <section className="max-w-5xl mx-auto mt-10 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {aboutImages.map((img, idx) => (
            <div
              key={img.id || idx}
              className="rounded-xl overflow-hidden bg-white/10 backdrop-blur-[10px] border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-transform hover:scale-[1.03]"
            >
              <img
                src={getImageSource(img)}
                alt={img.title || `Image ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          ))}
        </div>
      </section>

      {/* How We Work Section */}
      <section className="max-w-5xl mx-auto mt-16 px-4">
        <div className="flex flex-wrap items-start gap-x-2">
          <h2
            className="text-white font-bold"
            style={{ fontFamily: "Inter", fontSize: 48 }}
          >
            How We Work?
          </h2>
          <p
            className="text-sm font-mono text-gray-300 md:pt-[2.5rem]"
            style={{ fontWeight: 400, fontSize: 16 }}
          >
           We function as a student-led, collaborative ecosystem
          </p>
        </div>
        <p
          className="text-sm font-mono text-gray-300 mt-4"
          style={{ fontWeight: 400, fontSize: 16 }}
        >
           where learning and building go hand in hand. Every project begins with identifying
          real-world challenges, followed by brainstorming and developing
          practical, tech-driven solutions. Students from diverse domains —
          developers, designers, and problem-solvers — work in cross-functional
          teams, combining creativity with execution. Guided by mentorship and
          supported by institutional resources, our process encourages hands-on
          learning, continuous experimentation, and a shared commitment to
          meaningful outcomes. Our approach is agile, purpose-driven, and deeply
          rooted in community collaboration.
        </p>
      </section>
    </>
  );
};

export default OverviewSection;
