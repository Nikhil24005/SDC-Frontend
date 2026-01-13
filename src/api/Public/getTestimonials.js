import { publicApi } from '../axios'; // ✅ Use axios.js for public requests

export const getTestimonials = async () => {
  try {
    const res = await publicApi.get('/public/testimonials');
    return res.data;
  } catch (error) {
    console.error('Error fetching testimonials:', error.response?.data || error.message);
    return [];
  }
};
