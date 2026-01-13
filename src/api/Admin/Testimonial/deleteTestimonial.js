import { authApi } from '../../config'; // ✅ Use config.js for authenticated admin requests

export const deleteTestimonial = async (testId) => {
  try {
    const res = await authApi.delete(`/admin/testimonials/${testId}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting testimonial:', error.response?.data || error.message);
    throw error;
  }
};

