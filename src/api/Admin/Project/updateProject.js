import { authApi } from '../../config'; // ✅ Use config.js for authenticated admin requests

export const updateProject = async (projectID, { title, description, link, imageBase64, teamMembers }) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('link', link);
  if (imageBase64) {
    if (typeof imageBase64 === 'string' && imageBase64.startsWith('data:')) {
      const arr = imageBase64.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) { 
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], 'project-image.jpg', { type: mime });
      formData.append('image', file);
    } else {
      formData.append('image', imageBase64);
    }
  }
  if (teamMembers) {
    formData.append('teamMembers', teamMembers);
  }
  try {
    const res = await authApi.put(`/admin/projects/${projectID}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (error) {
    console.error('Error updating project:', error.response?.data || error.message);
    throw error;
  }
};

