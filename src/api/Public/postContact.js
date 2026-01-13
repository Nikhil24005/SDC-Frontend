import { publicApi } from '../axios'; // ✅ Use axios.js for public requests

export const postContact = async (formData) => {
  try {
    console.log('📞 Submitting contact form...');
    const res = await publicApi.post('/public/contact', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('✅ Contact form submitted successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Error submitting contact form:', error.response?.data || error.message);
    console.error('📋 Form data that failed:', formData);
    throw error;
  }
};