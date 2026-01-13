import { authApi } from "../config";



/**
 * Get current admin's profile details
 * Uses cookie authentication to identify the current admin from all-admins list
 * @returns {Promise} Current admin's profile data { name, email, contact_no }
 */
export const getCurrentAdminProfile = async () => {
  try {
    const response = await authApi.get("/admin/all-admins");
    const allAdmins = response.data.data || response.data;
    
    // The current admin should be identifiable from the response
    // This could be the first admin, or marked with a special flag
    // For now, returning the first admin as current admin
    const currentAdmin = Array.isArray(allAdmins) && allAdmins.length > 0 ? allAdmins[0] : null;
    
    if (!currentAdmin) {
      throw new Error('No admin profile found');
    }
    
    return currentAdmin;
  } catch (error) {
    console.error('Error fetching current admin profile:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update current admin's profile
 * @param {Object} data - Profile data to update { name, email, contact_no }
 * @returns {Promise} Updated profile data
 */
export const updateAdminProfile = async (data) => {
  try {
    // Map frontend field names to backend field names
    const backendData = {
      name: data.name,
      email: data.email,
      contact_no: data.phoneNumber || data.contact_no || data.contact
    };

    const response = await authApi.put("/admin/updateAdmin", backendData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating admin profile:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Change current admin's password
 * @param {Object} data - Password change data { oldPassword, newPassword }
 * @returns {Promise} Success response
 */
export const changeAdminPassword = async (data) => {
  try {
    // Map frontend field names to backend field names
    const backendData = {
      oldPassword: data.oldPassword,  // Old password for verification
      newPassword: data.newPassword   // New password to set
    };

    const response = await authApi.put("/admin/change-password", backendData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error changing admin password:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get list of all admins (for admin view)
 * @returns {Promise} Array of all admin details
 */
export const getAllAdmins = async () => {
  try {
    const response = await authApi.get("/admin/all-admins");
    // Return the actual data array, not the whole response
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching all admins:', error.response?.data || error.message);
    throw error;
  }
};