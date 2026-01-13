import { authApi } from '../../config'; // ✅ Use config.js for authenticated admin requests

export const deletePeople = async (id) => {
  try {
    const url = `/admin/people/${id}`;
    const response = await authApi.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
