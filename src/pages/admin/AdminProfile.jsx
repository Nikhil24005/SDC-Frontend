import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import key  from "../../assets/icons/key.png";
import save from "../../assets/icons/save.png";
import cross from "../../assets/icons/cross.svg";
import edit from "../../assets/icons/edit.png";
import icons from "../../assets/icons/Icons.png";
import { 
  getCurrentAdminProfile, 
  updateAdminProfile, 
  changeAdminPassword, 
  getAllAdmins 
} from "../../api/Admin/profile";
import { getAdminData } from "../../utils/cookieAuth";



const AdminProfile = () => {
  const [page, setPage] = useState(1);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [allAdmins, setAllAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editDetails, setEditDetails] = useState({
    name: '',
    phoneNumber: '',
    email: ''
  });
  const [editProfile, setEditProfile] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const contentRef = useRef(null);

  // Fetch admin data on component mount
  useEffect(() => {
    fetchAdminData();
  }, []);

  // ✅ Hide header/sidebar when modals are open
  useEffect(() => {
    const header = document.querySelector(".header");
    const sidebar = document.querySelector(".sidebar");

    const shouldHide = showChangePasswordModal || showEditDetailsModal;

    if (header) header.style.display = shouldHide ? "none" : "block";
    if (sidebar) sidebar.style.display = shouldHide ? "none" : "block";

    // Optional cleanup if component unmounts
    return () => {
      if (header) header.style.display = "block";
      if (sidebar) sidebar.style.display = "block";
    };
  }, [showChangePasswordModal, showEditDetailsModal]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the currently logged-in admin from cookies
      const loggedInAdmin = getAdminData();

      // Fetch all admins data from database
      const allAdminsFromDB = await getAllAdmins();
      
      // Find the current admin by matching with logged-in admin data
      let currentAdminData = null;
      let otherAdmins = allAdminsFromDB;
      
      if (loggedInAdmin) {
        // Try to find matching admin by email, adminId, id, or _id
        // Check each matching criteria separately for debugging
        const matchByEmail = allAdminsFromDB.find(admin => admin.email === loggedInAdmin.email);
        const matchByAdminId = allAdminsFromDB.find(admin => admin.adminId === loggedInAdmin.adminId);
        const matchById = allAdminsFromDB.find(admin => admin.id === loggedInAdmin.id);
        
        // Use the first successful match (prioritize email, then adminId, then id)
        currentAdminData = matchByEmail || matchByAdminId || matchById || null;
        
        if (currentAdminData) {
          // Remove current admin from others list using the found admin's data
          otherAdmins = allAdminsFromDB.filter(admin => 
            admin.email !== currentAdminData.email && 
            admin.adminId !== currentAdminData.adminId
          );
        } else {
          // If logged-in admin not found in database, show warning
          console.warn('Logged-in admin not found in database admins list');
          setError('Current admin profile not found in database');
        }
      } else {
        // If no logged-in admin data in cookies, show error
        console.warn('No logged-in admin data found in cookies');
        setError('Please log in again to view admin profile');
      }

      setCurrentAdmin(currentAdminData);
      setAllAdmins(otherAdmins);
      
      if (currentAdminData) {
        // Set edit details with current admin data
        setEditDetails({
          name: currentAdminData?.name || '',
          phoneNumber: currentAdminData?.contact_no || currentAdminData?.phoneNumber || '',
          email: currentAdminData?.email || ''
        });

        // Set edit profile with current admin data
        setEditProfile({
          name: currentAdminData?.name || '',
          email: currentAdminData?.email || '',
          phoneNumber: currentAdminData?.contact_no || currentAdminData?.phoneNumber || ''
        });
      }

    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  // Create display list with current admin first, then other admins
  const displayAdmins = currentAdmin ? [currentAdmin, ...allAdmins] : allAdmins;

  const itemsPerPage = 3;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedAdmins = displayAdmins.slice(startIndex, startIndex + itemsPerPage);

  // Loading state
  if (loading) {
    return (
      <div className="w-[1136px] min-h-screen absolute top-[132px] left-[272px]">
        <div className="w-[1136px] h-[60px] flex justify-between items-center px-[28px] py-[8px] bg-[#8E8E8E] rounded-t-2xl">
          <h2 className="text-[#333333] font-semibold text-2xl">Admin Details</h2>
        </div>
        <div className="w-full h-[722px] bg-[#141414] rounded-b-xl flex items-center justify-center">
          <p className="text-white text-xl">Loading admin data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-[1136px] min-h-screen absolute top-[132px] left-[272px]">
        <div className="w-[1136px] h-[60px] flex justify-between items-center px-[28px] py-[8px] bg-[#8E8E8E] rounded-t-2xl">
          <h2 className="text-[#333333] font-semibold text-2xl">Admin Details</h2>
        </div>
        <div className="w-full h-[722px] bg-[#141414] rounded-b-xl flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-xl mb-4">{error}</p>
            <button 
              onClick={fetchAdminData}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const openChangePasswordModal = () => setShowChangePasswordModal(true);
  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const openEditDetailsModal = () => {
    if (currentAdmin) {
      setEditDetails({
        name: currentAdmin.name || '',
        phoneNumber: currentAdmin.contact_no || currentAdmin.phoneNumber || '',
        email: currentAdmin.email || ''
      });
      setEditProfile({
        name: currentAdmin.name || '',
        email: currentAdmin.email || '',
        phoneNumber: currentAdmin.contact_no || currentAdmin.phoneNumber || ''
      });
    }
    setShowEditDetailsModal(true);
  };
  
  const closeEditDetailsModal = () => setShowEditDetailsModal(false);

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match!');
      return;
    }

    try {
      await changeAdminPassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccessMessage('Password updated successfully!');
      closeChangePasswordModal();
    } catch (error) {
      setError('Failed to update password: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const updatedProfile = await updateAdminProfile(editDetails);
      
      // Update current admin data
      setCurrentAdmin(prev => ({ ...prev, ...editDetails }));
      
      setSuccessMessage('Profile updated successfully!');
      closeEditDetailsModal();
    } catch (error) {
      setError('Failed to update profile: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="w-[1136px] absolute top-[132px] left-[272px]">
      <div className="w-[1136px] h-[60px] flex justify-between items-center px-[28px] py-[8px] bg-[#8E8E8E] rounded-t-2xl">
        <h2 className="text-[#333333] font-semibold text-2xl">Admin Details</h2>
      </div>

      <div className="w-full h-[480px] bg-[#141414] rounded-b-xl shadow-[2px_2px_6px_0px_#FFFFFF26] flex flex-col">
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto scroll-container relative"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#4a4a4a #1a1a1a",
            msOverflowStyle: "auto",
          }}
        >
          <style>{`
            .scroll-container::-webkit-scrollbar {
              width: 6px;
            }
            .scroll-container::-webkit-scrollbar-track {
              background: #1a1a1a;
              border-radius: 3px;
            }
            .scroll-container::-webkit-scrollbar-thumb {
              background: #4a4a4a;
              border-radius: 3px;
            }
            .scroll-container::-webkit-scrollbar-thumb:hover {
              background: #5a5a5a;
            }
          `}</style>

          {paginatedAdmins.length > 0 ? (
            paginatedAdmins.map((admin, index) => (
              <div
                key={admin.id || index}
                className={`w-full text-white flex justify-between items-start pt-4 pb-8 ${
                  index !== paginatedAdmins.length - 1 || displayAdmins.length > itemsPerPage * page
                    ? "border-b border-white border-opacity-20"
                    : ""
                }`}
              >
                <div className="flex-1 pl-10 pr-4">
                  <p className="text-base p-1">
                    <strong className="text-[#8E8E8E]">Name:</strong> {admin.name || 'N/A'}
                  </p>
                  <p className="text-base p-1">
                    <strong className="text-[#8E8E8E]">Contact Number:</strong> {admin.contact_no || admin.contact || admin.phoneNumber || 'N/A'}
                  </p>
                  <p className="text-base p-1">
                    <strong className="text-[#8E8E8E]">Email:</strong> {admin.email || 'N/A'}
                  </p>
                  {index === 0 && (
                    <p className="text-base p-1">
                      <strong className="text-[#8E8E8E]">Role:</strong> Current Admin
                    </p>
                  )}
                </div>

                {index === 0 && (
                  <div className="p-4 flex flex-col justify-start items-center gap-4  mr-10">
                    <button
                      onClick={openChangePasswordModal}
                      className="w-[260px] h-[45px] flex items-center justify-center gap-[8px] rounded-md px-4 py-2 bg-[#ACACAC0D] border border-white backdrop-blur-[4px] shadow-custom cursor-pointer"
                    >
                      <img src={key} alt="change password" className="w-5 h-5" />
                      <span className="text-white font-semibold text-base uppercase">
                        CHANGE PASSWORD
                      </span>
                    </button>
                    <button
                      onClick={openEditDetailsModal}
                      className="w-[260px] h-[45px] flex items-center justify-center gap-[8px] rounded-md px-4 py-2 bg-[#ACACAC40] border border-white backdrop-blur-[4px] shadow-custom cursor-pointer"
                    >
                      <img src={edit} alt="edit" className="w-6 h-6" />
                      <span className="text-white font-semibold text-base uppercase">
                        EDIT DETAILS
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-white text-center text-base py-10">No admin details to display.</p>
          )}
        </div>
      </div>

      {/* Modals are already defined below, no change needed there */}
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-white text-xl font-mono">Loading...</div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg z-50">
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg z-50">
          <p>{successMessage}</p>
          <button 
            onClick={() => setSuccessMessage('')}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-[#000000CC] flex items-center justify-center z-[9999]">
          {/* Modal content... */}
            
          <div className="w-[1094px] h-[411px] bg-[#1a1a1a] opacity-100 rotate-0 rounded-2xl shadow-[0px_4px_10px_0px_#00000040] relative">
            <div className="w-full h-[60px] flex justify-between items-center px-6 py-4 bg-[#8E8E8E] opacity-100 rotate-0 rounded-t-2xl">
                <h3 style={{fontWeight:"600" ,fontSize:24}}className="text-[#333333] p-1 font-inter font-semibold leading-[24px] tracking-[0.02em] h-[32px] w-[270px]">
                    Change Your Password
                </h3>
                <button
                    onClick={closeChangePasswordModal}
                    // className="w-[25px] h-[25px]"
                    // className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#0303030d] border border-white backdrop-blur-[4px] shadow-[2px_4px_4px_0px_#00000040,inset_2px_2px_8px_0px_#FFFFFF40] cursor-pointer"
                >
                    <img src={cross} alt="close" className="w-[25px] h-[25px]" />
                </button>
            </div>

            <form className="flex flex-col gap-1" onSubmit={handlePasswordChange}>
              <div className="p-8 ">
              <label className="text-white font-mono text-base font-bold leading-[24px] tracking-[0.02em] uppercase">
                OLD PASSWORD
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                required
               className="w-[1018px] font-mono mb-2 px-3 py-2 rounded-md text-white [box-shadow:inset_3px_3px_8px_rgba(255,255,255,0.3)]"
              />

              <label className="text-white font-mono text-base font-bold leading-[24px] tracking-[0.02em] uppercase">
                NEW PASSWORD
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                required
                 className="w-[1018px] font-mono mb-2 px-3 py-2 rounded-md text-white [box-shadow:inset_3px_3px_8px_rgba(255,255,255,0.3)]"
              />

                 <label className="text-white font-mono text-base font-bold leading-[24px] tracking-[0.02em] uppercase">
                RE-ENTER NEW PASSWORD
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                 className="w-[1018px] font-mono px-3 py-2 rounded-md text-white [box-shadow:inset_3px_3px_8px_rgba(255,255,255,0.3)]"
              /></div>
<div className="h-[73px] w-[1094px] flex justify-end  bg-[#303030]/60 rounded-b-xl border-t border-[#5a5a5a] shrink-0">
              <button
                type="submit"
               className='font-mono my-3 mx-7 [box-shadow:inset_3px_3px_8px_rgba(255,255,255,0.3)] w-[254px] h-[45px] rounded-xl border-[2px] bg-[#ACACAC40]/60 border-[#FFFFFF] text-white flex py-3 px-4 gap-3 '
              ><img src={save} alt="" className='h-[25px] w-[25px]' />
                <span className="text-white font-semibold text-base leading-[24px] uppercase">
                  UPDATE NEW PASSWORD
                </span>
              </button></div>
            </form>
          </div>
        </div>
        
      )}

      {showEditDetailsModal && (
        <div className="fixed inset-0 bg-[#000000CC] flex items-center justify-center z-[9999]">
          {/* Modal content... */}
          
           <div className="w-[1094px] h-[411px] bg-[#1a1a1a]  opacity-100 rotate-0 rounded-2xl shadow-[0px_4px_10px_0px_#00000040] relative">
             <div className="w-full h-[60px] flex justify-between items-center px-6 py-4 bg-[#8E8E8E] opacity-100 rotate-0 rounded-t-2xl">
                 <h3 className="text-[#333333] font-inter text-xl font-semibold leading-[24px] tracking-[0.02em] w-full">
                    Edit Admin Details
                </h3>
                <button
                    onClick={closeEditDetailsModal}
                    // className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#ACACAC0D] border border-white backdrop-blur-[4px] shadow-[2px_4px_4px_0px_#00000040,inset_2px_2px_8px_0px_#FFFFFF40] cursor-pointer"
                >
               <img src={cross} alt="close" className="w-[25px] h-[25px]" />
               </button>
             </div>

             <form className="flex flex-col" onSubmit={handleProfileUpdate}>
              <div className="p-8">
              <label className="text-white  not-odd:font-mono text-base font-bold leading-[24px] tracking-[0.02em] uppercase">
                NAME
              </label>
              <input
                type="text"
                value={editDetails.name}
                placeholder="Enter full name"
                onChange={(e) => setEditDetails({ ...editDetails, name: e.target.value })}
                required
              className="w-[1018px] font-mono mb-2 px-3 py-2 rounded-md text-white [box-shadow:inset_3px_3px_8px_rgba(255,255,255,0.3)]"
              />

             <label className="text-white font-mono text-base font-bold leading-[24px] tracking-[0.02em] uppercase mt-2">
                CONTACT NUMBER
              </label>
              <input
               type="text"
                placeholder="Enter phone number"
                 value={editDetails.phoneNumber || ''}
  onChange={(e) => setEditDetails({ ...editDetails, phoneNumber: e.target.value })}
               className="w-[1018px] font-mono px-3 py-2 mb-2 rounded-md text-white [box-shadow:inset_3px_3px_8px_rgba(255,255,255,0.3)]"
              />             <label className="text-white font-mono text-base font-bold leading-[24px] tracking-[0.02em] uppercase mt-2">
                EMAIL
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                 value={editDetails.email}
  onChange={(e) => setEditDetails({ ...editDetails, email: e.target.value })}
                required
                className="w-[1018px] font-mono px-3 py-2 rounded-md text-white [box-shadow:inset_3px_3px_8px_rgba(255,255,255,0.3)]"
              />
</div>
<div className="h-[75px] w-[1094px] flex justify-end  bg-[#303030]/60 rounded-b-xl  shrink-0">
              <button
                type="submit"
                 className='font-mono my-4 mx-7 [box-shadow:inset_3px_3px_8px_rgba(255,255,255,0.3)] w-[105px] h-[45px] rounded-xl border-[2px] bg-[#ACACAC40]/60 border-[#FFFFFF] text-white flex py-2.5 px-4 gap-3 '
              >  <img src={save} alt="" className='h-[22px] w-[22px]' />
              <span className="text-white font-semibold font-mono text-base leading-[24px] uppercase">
                    SAVE
                  </span>
                </button></div>
              </form>
            </div>
</div>
      
      )}
    </div>
  );
};

export default AdminProfile;