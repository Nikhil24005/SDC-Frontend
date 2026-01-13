import React, { useState, useEffect } from "react";
import meshGradient from "../../../assets/images/mesh-gradient.webp";
import { X, Calendar, Loader2 } from "lucide-react";
import { getAllGalleryImages } from "../../../api/gallery"; // Adjust path as needed

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getImageSource = (img) => {
    if (img.imageBase64) {
      if (img.imageBase64.startsWith("data:image/")) {
        const base64Part = img.imageBase64.split(",")[1];
        try {
          const decoded = atob(base64Part);
          if (decoded.startsWith("http")) return decoded;
          return img.imageBase64;
        } catch {
          return img.imageBase64;
        }
      }
      return `data:image/jpeg;base64,${img.imageBase64}`;
    }

    if (img.image) {
      if (img.image.startsWith("data:image/") || img.image.startsWith("http")) {
        return img.image;
      }
      return `data:image/jpeg;base64,${img.image}`;
    }

    if (img.url) return img.url;

    return "";
  };

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllGalleryImages();

      const transformedData = data.map((item) => ({
        id: item.id,
        title: item.title,
        category: "event",
        date: item.createdAt || item.uploadDate || new Date().toLocaleDateString(),
        image: getImageSource(item),
        description: item.description || item.title || "Gallery image",
      }));

      setGalleryData(transformedData);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      setError("Failed to load gallery images. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const openModal = (image) => setSelectedImage(image);
  const closeModal = () => setSelectedImage(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
    };

    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  return (
    <div className="min-h-screen relative">
      <img
        src={meshGradient}
        alt="background"
        className="fixed inset-0 w-full h-full object-cover -z-10"
        style={{ pointerEvents: "none" }}
      />

      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold text-white mb-2 font-inter">
            Gallery
          </h1>
          <p className="text-gray-300 font-mono">
            Explore our collection of memorable moments and achievements
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20 text-white">
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
          <span>Loading gallery...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-100 text-red-700 text-center rounded-lg shadow">
          <p>{error}</p>
          <button
            onClick={fetchGalleryImages}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Gallery Grid */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4 py-10">
          {galleryData.length === 0 ? (
            <p className="text-gray-400 text-center">No images found in the gallery.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openModal(item)}
                  className="cursor-pointer bg-white/10 backdrop-blur rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                    
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal View */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl max-w-3xl w-full overflow-hidden">
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-80 object-cover rounded-t-xl"
              />
              <div className="p-6 text-white">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold">{selectedImage.title}</h2>
                  <div className="flex items-center text-gray-300 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {selectedImage.date}
                  </div>
                </div>
                <p className="text-gray-300 font-mono">{selectedImage.description}</p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={closeModal}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
