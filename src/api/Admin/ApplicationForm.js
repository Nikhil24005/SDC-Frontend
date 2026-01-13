import { authApi } from "../config"; // ✅ Use config.js for authenticated admin requests

// ✅ Get all applications
export const getAllApplications = async () => {
  try {
    console.log('📋 Fetching all applications...');
    const response = await authApi.get("/admin/application-form/getAll");
    console.log('✅ Applications fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching applications:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ Get application by ID
export const getApplicationById = async (id) => {
  try {
    console.log('📋 Fetching application by ID:', id);
    const response = await authApi.get(`/admin/application-form/get/${id}`);
    console.log('✅ Application fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching application by ID:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ Delete application by ID
export const deleteApplicationById = async (id) => {
  try {
    console.log('🗑️ Deleting application by ID:', id);
    const response = await authApi.delete(`/admin/application-form/delete/${id}`);
    console.log('✅ Application deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting application:', error.response?.data || error.message);
    throw error;
  }
};
