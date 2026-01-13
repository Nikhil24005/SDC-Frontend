import { authApi } from '../../config'; // ✅ Use config.js for authenticated admin requests

export const updatePeople = async (id, data) => {
  try {
    const url = `/admin/people/${id}`;

    // Always use FormData
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => formData.append(key, v));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // No Content-Type header, let axios/browser handle it!
    const response = await authApi.put(url, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
