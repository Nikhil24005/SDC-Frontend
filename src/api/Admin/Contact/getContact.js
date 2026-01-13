import { authApi } from '../../config'; // ✅ Use config.js for authenticated admin requests

export const getContact = async () => {
  try {
    console.log('📞 Fetching contact messages...');
    const res = await authApi.get('/admin/getAllContacts');
    console.log('✅ Contact messages fetched:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Error fetching contact details:', error.response?.data || error.message);
    console.error('🔍 Response status:', error.response?.status);
    if (error.response?.status === 403) {
      console.error('🚫 Authentication failed - check if user is logged in');
    }
    // Don't return empty array - let the error bubble up so components can handle it properly
    throw error;
  }
};
