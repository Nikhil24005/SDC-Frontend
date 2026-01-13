import { authApi } from '../../config'; // ✅ Use authApi for admin endpoints

export const getProject = async () => {
  try {
    const res = await authApi.get('/admin/projects');
    return res.data;
  } catch (error) {
    console.error('Error fetching Projects:', error.response?.data || error.message);
    return [];
  }
};

