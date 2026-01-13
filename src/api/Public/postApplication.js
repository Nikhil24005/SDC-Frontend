import { publicApi } from '../axios'; // ✅ Use axios.js for public requests

export const postApplication = async (formData) => {
  try {
    console.log('📝 Submitting application form...');
    const res = await publicApi.post('/public/application', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('✅ Application submitted successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Error submitting application form:', error.response?.data || error.message);
    console.error('📋 Form data that failed:', formData);
    throw error;
  }
};