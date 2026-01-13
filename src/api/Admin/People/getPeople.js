import { authApi } from '../../config'; // ✅ Use authApi for admin endpoints (requires credentials)

/**
 * Fetches people data from the backend.
 * @returns {Promise<Array>} The list of all people
 */
export const getPeople = async () => {
  try {
    const response = await authApi.get('/admin/people');
    console.log('Fetched people:', response.data); 
    return response.data;
  } catch (error) {
    console.error('Error fetching people:', error);
    throw error;
  }
};
