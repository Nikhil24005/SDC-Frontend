import { authApi } from '../../config'; // ✅ Use config.js for authenticated admin requests

export const addTestimonial = async ({ clientName, des, imageBase64 }) => {
  const formData = new FormData();
  formData.append('clientName', clientName);
  formData.append('des', des);
  if (imageBase64) {
    if (typeof imageBase64 === 'string' && imageBase64.startsWith('data:')) {
      // Convert base64 to File
      const arr = imageBase64.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], 'testimonial-image.jpg', { type: mime });
      formData.append('image', file);
    } else {
      // Already a File or Blob
      formData.append('image', imageBase64);
    }
  }

  try {
    const res = await authApi.post('/admin/testimonials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (error) {
    console.error('Error adding testimonial:', error.response?.data || error.message);
    throw error;
  }
};
