


import { publicApi } from '../axios'; 

export const getProject = async () => {
  try {
    const res = await publicApi.get('/public/projects');
    return res.data;
  } catch (error) {
    console.error('❌ Error fetching projects:', error.response?.data || error.message);
    console.error('🔍 Response status:', error.response?.status);
    return [];
  }
};
