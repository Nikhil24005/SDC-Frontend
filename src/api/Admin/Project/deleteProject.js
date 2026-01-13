import { authApi } from '../../config'; // ✅ Use config.js for authenticated admin requests

export const deleteProject = async (projectID) => {
  try {
    const res = await authApi.delete(`/admin/projects/${projectID}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting project:', error.response?.data || error.message);
    throw error;
  }
};


