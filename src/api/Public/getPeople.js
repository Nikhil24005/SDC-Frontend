import { publicApi } from '../axios'; // ✅ Fixed: named import

export const getPeople = async () => {
  try {
    console.log('👥 Fetching team members...');
    const res = await publicApi.get('/public/people/team');
    console.log('✅ Team members fetched successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Error fetching team members:', error.response?.data || error.message);
    console.error('🔍 Response status:', error.response?.status);
    console.error('📋 Error details:', error);
    throw error;
  }
};