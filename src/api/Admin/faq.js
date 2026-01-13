// /api/admin/faq.js
import { authApi } from '../config'; // ✅ Use config.js for authenticated admin requests

// Get all FAQs (admin)
export const getAllFAQs = async () => {
  try {
    console.log('❓ Fetching all FAQs (admin)...');
    const res = await authApi.get('/admin/faq/getall');
    console.log('✅ FAQs fetched:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Error fetching FAQs:', error.response?.data || error.message);
    console.error('🔍 Response status:', error.response?.status);
    throw error;
  }
};

// Add a new FAQ
export const addFAQ = async ({ ques, ans }) => {
  try {
    console.log('➕ Adding new FAQ...');
    const res = await authApi.post('/admin/faq/addfaq', { ques, ans });
    console.log('✅ FAQ added:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Error adding FAQ:', error.response?.data || error.message);
    throw error;
  }
};

// Update an existing FAQ
export const updateFAQ = async (id, { ques, ans }) => {
  try {
    const res = await authApi.put(`/admin/faq/updatefaq/${id}`, { ques, ans });
    return res.data;
  } catch (error) {
    console.error('Error updating FAQ:', error.response?.data || error.message);
    throw error;
  }
};

// Delete an FAQ
export const deleteFAQ = async (id) => {
  try {
    const res = await authApi.delete(`/admin/faq/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting FAQ:', error.response?.data || error.message);
    throw error;
  }
};
