import { publicApi } from '../axios'; // ✅ use the public Axios instance

export const getAlumini = async () => {
  try {
    const res = await publicApi.get('/public/people/alumni');
    console.log('Alumni data fetched successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching alumni:', error.response?.data || error.message);
    console.error('Error details:', error);
    return [];
  }
};