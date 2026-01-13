import React, { useState, useEffect } from "react";
import {
  getAllGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "../../api/gallery";
import pencil from "../../assets/icons/pencil.png";
import deleteIcon from "../../assets/icons/delete.png";
import addIcon from "../../assets/icons/add.png";

const AboutGalleryPage = () => {
  const [gallery, setGallery] = useState([]);
  const [aboutImages, setAboutImages] = useState([]);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [newTitle, setNewTitle] = useState("");
const fetchImages = async () => {
  try {
    const data = await getAllGalleryImages();
    const savedIds = JSON.parse(localStorage.getItem("aboutImageIds")) || [];

    // Reorder gallery so saved About images appear on top
    const aboutImgs = [];
    const restImgs = [];

    data.forEach(img => {
      if (savedIds.includes(img.id)) {
        aboutImgs.push(img);
      } else {
        restImgs.push(img);
      }
    });

    const combinedGallery = [...aboutImgs, ...restImgs];
    setGallery(combinedGallery);
    setAboutImages(combinedGallery.slice(0, 4));
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

  useEffect(() => {
    fetchImages();
  }, []);

 const handleAboutChange = (id) => {
  const selectedImage = gallery.find((img) => img.id === id);
  const updatedGallery = [selectedImage, ...gallery.filter((img) => img.id !== id)];

  const updatedAboutIds = updatedGallery.slice(0, 4).map(img => img.id);
  localStorage.setItem("aboutImageIds", JSON.stringify(updatedAboutIds));

  setGallery(updatedGallery);
  setAboutImages(updatedGallery.slice(0, 4));
};

  const handleAddImage = async () => {
    if (!newImage || !newTitle.trim()) {
      alert("Please provide both title and image.");
      return;
    }
    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("image", newImage);
    await addGalleryImage(formData);
    setNewImage(null);
    setNewTitle("");
    fetchImages();
  };

  // Helper function to get the correct image source
  const getImageSource = (img) => {
    // Check for imageBase64 (with capital B as per your data structure)
    if (img.imageBase64) {
      // If it's already a data URL with prefix
      if (img.imageBase64.startsWith('data:image/')) {
        // Check if the base64 part actually contains a URL (corrupted data)
        const base64Part = img.imageBase64.split(',')[1];
        if (base64Part) {
          try {
            const decoded = atob(base64Part);
            // If it's a URL, use it directly
            if (decoded.startsWith('http')) {
              return decoded;
            }
            // Otherwise, it's actual image data, return as is
            return img.imageBase64;
          } catch (e) {
            // If decoding fails, return as is
            return img.imageBase64;
          }
        }
        return img.imageBase64;
      }
      // If it's base64 without prefix, add it
      return `data:image/jpeg;base64,${img.imageBase64}`;
    }
    
    // Check for other common property names (lowercase)
    if (img.imagebase64) {
      if (img.imagebase64.startsWith('data:image/')) {
        return img.imagebase64;
      }
      return `data:image/jpeg;base64,${img.imagebase64}`;
    }
    
    // Check for other common property names
    if (img.image) {
      if (img.image.startsWith('data:image/')) {
        return img.image;
      }
      if (img.image.startsWith('http')) {
        return img.image; // If it's a URL
      }
      return `data:image/jpeg;base64,${img.image}`;
    }
    
    // Check for imageUrl property
    if (img.imageUrl) {
      return img.imageUrl;
    }
    
    // Check for url property
    if (img.url) {
      return img.url;
    }
    
    // Fallback - return a placeholder or empty string
    return "";
  };

  return (
    <div className="pt-5 overflow-y-auto h-[75vh] text-white font-sans"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#4a4a4a #1a1a1a",
          msOverflowStyle: "auto",
        }}>
      {/* About Header */}
      <div className="w-full h-[60px] flex justify-between px-7 py-2 bg-[#8E8E8E] rounded-t-xl">
        <h1 className="font-semibold text-[#333] text-[22px]">SDC Overview</h1>
        <div className="flex gap-4">
          {/* <p className="py-2.5 font-mono text-[#333] text-[16px]">Page</p>
          <button className="w-[59px] h-[32px] rounded-sm bg-[#D2D2D2] text-[#333] font-mono hover:bg-gray-300">
            About
          </button> */}
           <div className="flex gap-2 items-center text-sm">
          <span>Page</span>
          <button className="px-3 py-1 bg-gray-200 text-black rounded-md text-xs font-medium cursor-pointer">
          About
          </button>
        </div>
        </div>
      </div>

      {/* About Images */}
      <div
        className="bg-[#1a1a1a] text-white rounded-b"
        style={{ boxShadow: "4px 4px 8px rgba(255,255,255,0.2)" }}
      >
        <div className="flex gap-4 ml-10 pt-4">
          {aboutImages.map((img) => (
            <img
              key={img.id}
              src={getImageSource(img)}
              alt={img.title}
              className="w-[252px] h-[124px] object-cover rounded"
              onError={(e) => {
                console.error("Image failed to load:", img);
                e.target.style.display = 'none'; // Hide broken images
              }}
            />
          ))}
        </div>
        <div className="w-full h-[73px] mt-4 flex justify-end gap-5 px-7 bg-[#30303099]/60">
          <button
            onClick={() => setIsEditingAbout(true)}
            className="w-[105px] h-[45px] font-mono rounded-xl border-[2px] bg-[#ACACAC40]/60 border-white flex gap-2 items-center justify-center"
          >
            <img src={pencil} alt="edit" className="h-[20px]" />
            Edit
          </button>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="w-full mt-14">
        <div className="w-full h-[60px] flex justify-between px-7 py-2 bg-[#8E8E8E] rounded-t-xl">
          <h1 className="font-semibold text-[#333] text-[22px]">Gallery</h1>
          <div className="flex gap-4">
            {/* <p className="py-2.5 font-mono text-[#333] text-[16px]">Page</p>
            <button className="w-[75px] h-[32px] rounded-sm bg-[#D2D2D2] text-[#333] font-mono hover:bg-gray-300">
              Gallery
            </button> */}
             <div className="flex gap-2 items-center text-sm">
          <span>Page</span>
          <button className="px-3 py-1 bg-gray-200 text-black rounded-md text-xs font-medium cursor-pointer">
          Gallery
          </button>
        </div>
          </div>
        </div>

        <div
          className="bg-[#1a1a1a] rounded-b"
          style={{ boxShadow: "4px 4px 8px rgba(255,255,255,0.2)" }}
        >
          <div className="grid grid-cols-3 gap-4 p-6">
            {gallery.map((img) => (
              <div
                key={img.id}
                className="bg-[#303030] p-3 rounded shadow-md text-center"
              >
                <img
                  src={getImageSource(img)}
                  alt={img.title}
                  className="w-full h-[180px] object-cover rounded"
                  onError={(e) => {
                    console.error("Image failed to load:", img);
                    e.target.style.display = 'none'; // Hide broken images
                  }}
                />
                <p className="mt-2 font-mono">{img.title}</p>
                <div className="flex justify-center gap-4 mt-3">
                  <button
                    className="text-green-500 hover:underline text-sm"
                    onClick={() => handleAboutChange(img.id)}
                  >
                    Use in About
                  </button>
                  <button
                    className="text-red-500 hover:underline text-sm"
                    onClick={() =>
                      deleteGalleryImage(img.id).then(() => fetchImages())
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Image */}
          <div className="flex justify-center items-center gap-4 p-6 border-t border-[#5a5a5a] bg-[#222]">
            <input
              type="text"
              placeholder="Enter Title"
              className="w-[240px] h-[40px] rounded px-3 bg-[#ACACAC40]/25 text-white"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="text-white"
              onChange={(e) => setNewImage(e.target.files[0])}
            />
            <button
              onClick={handleAddImage}
              className="flex items-center gap-2 px-4 py-2 rounded bg-[#ACACAC40]/60 border border-white text-white"
            >
              <img src={addIcon} alt="add" className="h-[20px]" />
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutGalleryPage;