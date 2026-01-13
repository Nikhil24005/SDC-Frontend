import { authApi } from './config'; // ✅ Use config.js for authenticated admin requests
import { publicApi } from './axios'; // ✅ Use axios.js for public requests

// ✅ PUBLIC: anyone can view
export const getAllGalleryImages = async () => {
  const response = await publicApi.get("/public/gallery");
  return response.data.data; 
};

// ✅ AUTH REQUIRED (Admin)
export const addGalleryImage = async (data) => {
  return await authApi.post("/admin/gallery", data); // 👈 Uses cookies
};

export const updateGalleryImage = async (id, imageFile, title) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("title", title);
  return authApi.put(`/admin/gallery/${id}`, formData); // 👈 Uses cookies
};

export const deleteGalleryImage = async (id) => {
  return authApi.delete(`/admin/gallery/${id}`); // 👈 Uses cookies
};
