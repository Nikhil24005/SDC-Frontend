import { authApi } from '../../config'; // ✅ Use config.js for authenticated admin requests

export const getTestimonials = async () => {
  try {
    console.log('📝 Fetching testimonials...');
    const res = await authApi.get('/admin/testimonials');
    console.log('✅ Testimonials fetched:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Error fetching testimonials:', error.response?.data || error.message);
    console.error('🔍 Response status:', error.response?.status);
    return [];
  }
};
