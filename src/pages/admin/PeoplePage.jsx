import React, { useState, useEffect } from 'react';

import save from "../../assets/icons/save.png";
import attachicon from "../../assets/icons/attachicon.png";
import edit from "../../assets/icons/edit.png";
import deletei from "../../assets/icons/delete.png";
import cross from "../../assets/graphics/Group.svg";
import frame1 from "../../assets/profiles/profile1.jpg";
import frame2 from "../../assets/profiles/profile1.jpg";
import frame3 from "../../assets/profiles/profile1.jpg";
import frame4 from "../../assets/profiles/profile1.jpg";
import { getPeople } from "../../api/Admin/People/getPeople";
import { postPeople } from "../../api/Admin/People/postPeople";
import { updatePeople } from "../../api/Admin/People/updatePeople";
import { deletePeople } from "../../api/Admin/People/deletePeople";

const PeoplePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [teamData1, setTeamData1] = useState([]); // Team Members
  const [teamData2, setTeamData2] = useState([]); // Alumni

  const [isTeamEditing, setIsTeamEditing] = useState(false);
  const [isAlumniEditing, setIsAlumniEditing] = useState(false);
  const [currentEditingTeamId, setCurrentEditingTeamId] = useState(null);

  const [frame1Img] = useState(frame1);
  const [frame2Img] = useState(frame2);
  const [frame3Img] = useState(frame3);
  const frame4Img = frame4;

  const availableProjects = [
    { id: 1, name: "Project Alpha" },
    { id: 2, name: "Project Beta" },
    { id: 3, name: "Project Gamma" },
    { id: 4, name: "Project Delta" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [teamRes, alumniRes] = await Promise.all([
          getPeople("teamMembers"),
          getPeople("alumni"),
        ]);
        setTeamData1(Array.isArray(teamRes.data) ? teamRes.data : []);
        setTeamData2(Array.isArray(alumniRes.data) ? alumniRes.data : []);
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // -- ID Helper
  const getMemberId = (member, type) => {
    // Handle new members with temporary IDs
    if (member.isNew || member.tempId) {
      return member.tempId || 'new-' + Date.now();
    }
    
    if (type === "teamMembers") return member.memberId;
    if (type === "alumni") return member.aluminiId;
    return member.id || member._id;
  };

  const getActiveTeamData = () => {
    if (currentEditingTeamId === 'team1') {
      return [teamData1, setTeamData1, "teamMembers"];
    } else if (currentEditingTeamId === 'team2') {
      return [teamData2, setTeamData2, "alumni"];
    }
    return [[], () => {}, ""];
  };

  // Edit handlers
  const handleChange = (index, field, value) => {
    const [activeTeamData, setActiveTeamData] = getActiveTeamData();
    const updated = [...activeTeamData];
    updated[index][field] = value;
    setActiveTeamData(updated);
  };

  const handleProjectSelection = (memberIndex, projectId) => {
    const [activeTeamData, setActiveTeamData] = getActiveTeamData();
    const updatedTeamData = [...activeTeamData];
    updatedTeamData[memberIndex].projectIds = updatedTeamData[memberIndex].projectIds || [];
    const memberProjectIds = updatedTeamData[memberIndex].projectIds;
    if (memberProjectIds.includes(projectId)) {
      updatedTeamData[memberIndex].projectIds = memberProjectIds.filter(
        (id) => id !== projectId
      );
    } else {
      updatedTeamData[memberIndex].projectIds = [...memberProjectIds, projectId];
    }
    setActiveTeamData(updatedTeamData);
  };

  const handleImageChange = (e, idx) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const [activeTeamData, setActiveTeamData] = getActiveTeamData();
    const updated = [...activeTeamData];
    updated[idx].image = file;
    setActiveTeamData(updated);
  };

  // Helper to build payload for updatePeople
  const buildPayload = (member, type) => {
    if (member.image && typeof member.image !== "string") {
      const formData = new FormData();
      if (type === "teamMembers") {
        formData.append("name", member.name);
        formData.append("branch", member.branch);
        formData.append("position", member.position);
        formData.append("linkdin_url", member.linkdin_url);
        formData.append("github_url", member.github_url);
        formData.append("insta_url", member.insta_url);
        formData.append("projectIds", JSON.stringify(member.projectIds || []));
      } else if (type === "alumni") {
        formData.append("aluminiName", member.aluminiName);
        formData.append("companyName", member.companyName);
        formData.append("lpa", member.lpa);
        formData.append("content", member.content);
      }
      formData.append("image", member.image);
      return formData;
    }
    return member;
  };

  // CRUD
  const handleAddNew = () => {
    const [activeTeamData, setActiveTeamData, type] = getActiveTeamData();
    
    // Create a new empty member object
    let newMember = {};
    if (type === "teamMembers") {
      newMember = {
        name: '', 
        branch: '', 
        position: '',
        linkdin_url: '', 
        github_url: '', 
        insta_url: '',
        image: null,
        projectIds: [],
        // Add a temporary ID for new members
        isNew: true,
        tempId: Date.now()
      };
    } else if (type === "alumni") {
      newMember = {
        aluminiName: '', 
        companyName: '', 
        lpa: '', 
        content: '', 
        image: null,
        // Add a temporary ID for new members
        isNew: true,
        tempId: Date.now()
      };
    }
    
    // Add the new empty member to the active team data for editing
    setActiveTeamData([newMember, ...activeTeamData]);
  };

  const handleDeleteMember = async (index) => {
    const [activeTeamData, setActiveTeamData, type] = getActiveTeamData();
    const member = activeTeamData[index];
    
    try {
      // If it's a new member (not saved to API yet), just remove from local state
      if (member.isNew || member.tempId) {
        const updated = [...activeTeamData];
        updated.splice(index, 1);
        setActiveTeamData(updated);
      } else {
        // If it's an existing member, delete from API first
        const id = getMemberId(member, type);
        await deletePeople(type, id);
        const updated = [...activeTeamData];
        updated.splice(index, 1);
        setActiveTeamData(updated);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete member: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteAllMembers = async () => {
    const [activeTeamData, setActiveTeamData, type] = getActiveTeamData();
    try {
      await Promise.all(
        activeTeamData.map(member => deletePeople(type, getMemberId(member, type)))
      );
      setActiveTeamData([]);
    } catch (err) {
      setError('Failed to delete all members.');
    }
  };

  const handleEditClick = (teamId) => {
    setCurrentEditingTeamId(teamId);
    
    // Check if the team is empty and add a new member automatically
    const currentTeamData = teamId === 'team1' ? teamData1 : teamData2;
    
    if (teamId === 'team1') {
      setIsTeamEditing(true);
      setIsAlumniEditing(false);
      
      // If team is empty, add a new member for editing
      if (!currentTeamData || currentTeamData.length === 0) {
        const newMember = {
          name: '', 
          branch: '', 
          position: '',
          linkdin_url: '', 
          github_url: '', 
          insta_url: '',
          image: null,
          projectIds: [],
          isNew: true,
          tempId: Date.now()
        };
        setTeamData1([newMember]);
      }
      
    } else if (teamId === 'team2') {
      setIsAlumniEditing(true);
      setIsTeamEditing(false);
      
      // If alumni is empty, add a new member for editing
      if (!currentTeamData || currentTeamData.length === 0) {
        const newMember = {
          aluminiName: '', 
          companyName: '', 
          lpa: '', 
          content: '', 
          image: null,
          isNew: true,
          tempId: Date.now()
        };
        setTeamData2([newMember]);
      }
    }
  };

  const handleCloseModal = () => {
    // Reset to original data if canceling
    const originalTeamData = currentEditingTeamId === 'team1' ? teamData1 : teamData2;
    
    // Remove any new unsaved members
    const cleanedData = originalTeamData.filter(member => !member.isNew);
    
    if (currentEditingTeamId === 'team1') {
      setTeamData1(cleanedData);
    } else if (currentEditingTeamId === 'team2') {
      setTeamData2(cleanedData);
    }
    
    // Close modals
    setIsTeamEditing(false);
    setIsAlumniEditing(false);
    setCurrentEditingTeamId(null);
  };

  const handleSaveAndClose = async () => {
    const [activeTeamData, , type] = getActiveTeamData();
    
    // Check for empty cards
    const isEmptyCardPresent = activeTeamData.some(member => {
      if (type === 'teamMembers') {
        return !member.name.trim() && !member.branch.trim() && !member.position.trim() &&
              !member.linkdin_url.trim() && !member.github_url.trim() && !member.insta_url.trim();
      } else if (type === 'alumni') {
        return !member.aluminiName.trim() && !member.companyName.trim() &&
              !member.lpa.trim() && !member.content.trim();
      }
      return false;
    });
    
    if (isEmptyCardPresent) {
      alert("Please add details to any empty cards before saving.");
      return;
    }
    
    try {
      // Process each member - create new ones or update existing ones
      const updatedMembers = [];
      
      for (const member of activeTeamData) {
        if (member.isNew) {
          // Create new member
          const cleanMember = { ...member };
          delete cleanMember.isNew;
          delete cleanMember.tempId;
          
          const payload = buildPayload(cleanMember, type);
          const res = await postPeople(type, payload);
          const newMemberFromAPI = res.data ? res.data : res;
          updatedMembers.push(newMemberFromAPI);
        } else {
          // Update existing member
          const id = getMemberId(member, type);
          const payload = buildPayload(member, type);
          const res = await updatePeople(type, id, payload);
          const updatedMemberFromAPI = res.data ? res.data : member;
          updatedMembers.push(updatedMemberFromAPI);
        }
      }
      
      // Update the main state arrays with the new/updated data
      if (currentEditingTeamId === 'team1') {
        setTeamData1(updatedMembers);
      } else if (currentEditingTeamId === 'team2') {
        setTeamData2(updatedMembers);
      }
      
      // Close modals
      setIsTeamEditing(false);
      setIsAlumniEditing(false);
      setCurrentEditingTeamId(null);
      
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save changes: ' + (err.response?.data?.message || err.message));
    }
  };

  // ----- UI -----
  const labelStyle = "text-white text-[14px] font-[600] font-inter uppercase tracking-[1.12px]";
  const inputStyle = "h-[48px] px-4 py-3 rounded-md opacity-100 shadow-[2px_2px_4px_0px_#00000040,inset_2px_2px_6px_0px_#FFFFFF80] bg-[#121212] text-white text-sm font-inter";

  const renderTeamBox = (title, teamData, teamId) => (
    <div className="mb-10 ">
      <div className='w-full h-[60px] flex justify-between items-center px-7 py-2 bg-[#8E8E8E] rounded-t-xl'>
        <h1 className="font-semibold text-[#333] text-[22px] font-inter">{title}</h1>
        <div className='flex items-center gap-4'>
          {/* <p className='font-mono text-[#333] text-[16px]'>Page</p>
          <button className="w-[80px] h-[32px] rounded-sm bg-[#D2D2D2] text-[#333] px-2 font-mono hover:bg-gray-300 text-[16px]">People</button> */}
           <div className="flex gap-2 items-center text-sm">
          <span>Page</span>
          <button className="px-3 py-1 bg-gray-200 text-black rounded-md text-xs font-medium cursor-pointer">
            People
          </button>
        </div>
        </div>
      </div>

      <div className={`relative bg-[#1a1a1a] w-full text-white font-sans rounded-b-xl px-6 ${Array.isArray(teamData) && teamData.length > 0 ? 'pt-4 min-h-[280px]' : 'min-h-[73px]'} pb-[90px] overflow-hidden`} style={{ boxShadow: '4px 4px 8px rgba(255, 255, 255, 0.2)' }}>
        <div className="scroll-container grid grid-cols-2 gap-6 overflow-y-auto max-h-[245px] pr-2">
          {Array.isArray(teamData) && teamData.map((member, idx) => (
            <div key={getMemberId(member, teamId === "team1" ? "teamMembers" : "alumni") || idx} className="flex p-3 rounded-lg items-center gap-4">
              <img
                src={
                  member.image
                    ? typeof member.image === "string"
                      ? member.image
                      : URL.createObjectURL(member.image)
                    : [frame1Img, frame2Img, frame3Img, frame4Img][idx % 4]
                }
                alt="profile"
                className="w-[130px] h-[130px] rounded-lg object-cover"
              />
              <div className="text-white text-sm leading-relaxed font-mono">
                {teamId === 'team1' ? (
                  <>
                    <p className="font-semibold text-lg">{member.name}</p>
                    <p>{member.branch}</p>
                    <p>{member.position}</p>
                    <p className="text-blue-400 underline cursor-pointer break-all">{member.linkdin_url}</p>
                    <p className="text-blue-400 underline cursor-pointer break-all">{member.github_url}</p>
                    <p className="text-blue-400 underline cursor-pointer break-all">{member.insta_url}</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-lg">{member.aluminiName}</p>
                    <p>Company: {member.companyName}</p>
                    <p>LPA: {member.lpa}</p>
                    <p>Content: {member.content}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className='absolute bottom-0 left-0 w-full h-[63px] flex justify-end gap-5 px-7 py-3 bg-[#30303099]/60 text-[16px] font-semibold rounded-b-xl  items-center'>
          <button className='font-mono w-[105px] h-[40px] shadow-inner rounded-xl border-2 bg-[#ACACAC40]/60 border-white text-white flex py-2 gap-2 px-4' onClick={() => handleEditClick(teamId)}>
            <img src={edit} alt="edit" className='h-[25px] w-[25px]' />
            <p>{teamData.length > 0 ? "EDIT" : "ADD"}</p>
          </button>
          <button
            className='font-mono w-[125px] h-[40px] rounded-xl border-2 bg-[#ACACAC40]/60 border-white text-white flex py-2 gap-2 px-3 justify-center items-center'
            onClick={() => {
              setCurrentEditingTeamId(teamId);
              handleDeleteAllMembers();
            }}
          >
            <img src={deletei} alt="delete" className='h-[25px] w-[25px]' />
            <p>DELETE</p>
          </button>
        </div>
      </div>
    </div>
  );

  // ----
  const [activeTeamData] = getActiveTeamData();

  if (loading) return <div className="text-center text-white pt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 pt-10">{error}</div>;

  return (
    <div className='w-full overflow-y-auto flex justify-center items-start pt-5 px-4'
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#4a4a4a #1a1a1a",
          msOverflowStyle: "auto",
        }}>
      <div className='w-full h-[75vh] pb-[80px]'>
        {renderTeamBox("Team Members", teamData1, 'team1')}
        {renderTeamBox("Alumni", teamData2, 'team2')}

        {isTeamEditing && (
          <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
            <div className="bg-[#1a1a1a] w-[920px] max-h-[90vh] overflow-hidden rounded-xl shadow-lg border border-[#5a5a5a] flex flex-col">
              <div className="h-[65px] w-full flex justify-between items-center px-7 bg-[#8E8E8E] rounded-t-xl">
                <h2 className="text-[#333] font-semibold text-[22px] font-inter">Edit Team Members</h2>
                <img src={cross} alt="close" className="h-[20px] w-[20px] cursor-pointer" onClick={handleCloseModal} />
              </div>

              <div className="flex flex-col max-h-[80vh]">
                <div className="scroll-container overflow-y-auto px-6 pt-6 pb-2 flex flex-col gap-6" style={{ maxHeight: "calc(80vh - 130px)" }}>
                  {activeTeamData.map((member, idx) => (
                    <div key={getMemberId(member, "teamMembers") || idx} className="flex gap-4 items-start p-4 rounded-lg">
                      <label className="relative min-w-[131px] w-[131px] h-[168px] shrink-0 cursor-pointer border-white border-2 rounded-xl">
                        <img
                          src={
                            member.image
                              ? typeof member.image === "string"
                                ? member.image
                                : URL.createObjectURL(member.image)
                              : [frame1Img, frame2Img, frame3Img, frame4Img][idx % 4]
                          }
                          alt=""
                          className='w-full h-full rounded-lg object-cover opacity-20'
                        />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <img src={edit} alt="edit" className='w-[30px] h-[30px]' />
                        </span>
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageChange(e, idx)} />
                      </label>
                      <div className="flex flex-col grow gap-[6px] px-[10px] py-[12px]">
                        <label className={labelStyle}>Student Name</label>
                        <input className={`${inputStyle} w-[620px]`} value={member.name} onChange={e => handleChange(idx, 'name', e.target.value)} placeholder="Student Name" />

                        <label className={labelStyle}>Branch</label>
                        <input className={`${inputStyle} w-[620px]`} value={member.branch} onChange={e => handleChange(idx, 'branch', e.target.value)} placeholder="Branch" />

                        <label className={labelStyle}>Position</label>
                        <input className={`${inputStyle} w-[620px]`} value={member.position} onChange={e => handleChange(idx, 'position', e.target.value)} placeholder="Position" />

                        <label className={labelStyle}>LinkedIn URL</label>
                        <input className={`${inputStyle} w-[620px]`} value={member.linkdin_url} onChange={e => handleChange(idx, 'linkdin_url', e.target.value)} placeholder="LinkedIn" />

                        <label className={labelStyle}>GitHub URL</label>
                        <input className={`${inputStyle} w-[620px]`} value={member.github_url} onChange={e => handleChange(idx, 'github_url', e.target.value)} placeholder="GitHub" />

                        <label className={labelStyle}>Instagram URL</label>
                        <input className={`${inputStyle} w-[620px]`} value={member.insta_url} onChange={e => handleChange(idx, 'insta_url', e.target.value)} placeholder="Instagram" />

                        <label className={labelStyle}>Projects</label>
                        <div className="flex flex-col gap-2 p-4 rounded-md opacity-100 shadow-[2px_2px_4px_0px_#00000040,inset_2px_2px_6px_0px_#FFFFFF80] bg-[#121212]">
                          {availableProjects.map((project) => (
                            <div key={project.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`project-${idx}-${currentEditingTeamId}-${project.id}`}
                                className="h-5 w-5 border-2 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                checked={(member.projectIds || []).includes(project.id)}
                                onChange={() => handleProjectSelection(idx, project.id)}
                              />
                              <label htmlFor={`project-${idx}-${currentEditingTeamId}-${project.id}`} className="text-white text-sm font-inter">
                                {project.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <img
                        src={deletei}
                        alt="delete"
                        className="h-[33px] w-[33px] cursor-pointer mt-12 mr-24 bg-[#333333] shrink-0"
                        onClick={() => handleDeleteMember(idx)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end items-center gap-2 px-6 py-4 bg-[#2a2a2a] rounded-b-xl border-t border-[#444]">
                  <button onClick={handleSaveAndClose} className='font-mono w-[115px] h-[45px] rounded-md border bg-[#4a4a4a] border-white text-white flex items-center justify-center gap-2'>
                    <img src={save} alt="save" className='h-[20px] w-[20px]' />
                    <span>SAVE</span>
                  </button>
                  <button onClick={handleAddNew} className='font-mono w-[140px] h-[45px] rounded-md border bg-[#4a4a4a] border-white text-white flex items-center justify-center gap-2'>
                    <img src={attachicon} alt="add new" className='h-[20px] w-[20px]' />
                    <span>ADD NEW</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAlumniEditing && (
          <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
            <div className="bg-[#1a1a1a] w-[920px] max-h-[90vh] overflow-hidden rounded-xl shadow-lg border border-[#5a5a5a] flex flex-col">
              <div className="h-[65px] w-full flex justify-between items-center px-7 bg-[#8E8E8E] rounded-t-xl">
                <h2 className="text-[#333] font-semibold text-[22px] font-inter">Edit Alumni</h2>
                <img src={cross} alt="close" className="h-[20px] w-[20px] cursor-pointer" onClick={handleCloseModal} />
              </div>
              <div className="flex flex-col max-h-[80vh]">
                <div className="scroll-container overflow-y-auto px-6 pt-6 pb-2 flex flex-col gap-6" style={{ maxHeight: "calc(80vh - 130px)" }}>
                  {activeTeamData.map((member, idx) => (
                    <div key={getMemberId(member, "alumni") || idx} className="flex gap-4 items-start p-4 rounded-lg">
                      <label className="relative min-w-[131px] w-[131px] h-[168px] shrink-0 cursor-pointer border-white border-2 rounded-xl">
                        <img
                          src={
                            member.image
                              ? typeof member.image === "string"
                                ? member.image
                                : URL.createObjectURL(member.image)
                              : [frame1Img, frame2Img, frame3Img, frame4Img][idx % 4]
                          }
                          alt=""
                          className='w-full h-full rounded-lg object-cover opacity-20'
                        />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <img src={edit} alt="edit" className='w-[30px] h-[30px]' />
                        </span>
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageChange(e, idx)} />
                      </label>
                      <div className="flex flex-col grow gap-[6px] px-[10px] py-[12px]">
                        <label className={labelStyle}>Alumni Name</label>
                        <input className={`${inputStyle} w-[620px]`} value={member.aluminiName} onChange={e => handleChange(idx, 'aluminiName', e.target.value)} placeholder="Alumni Name" />

                        <label className={labelStyle}>Company Name</label>
                        <input className={`${inputStyle} w-[620px]`} value={member.companyName} onChange={e => handleChange(idx, 'companyName', e.target.value)} placeholder="Company Name" />

                        <label className={labelStyle}>LPA</label>
                        <input className={`${inputStyle} w-[620px]`} value={member.lpa} onChange={e => handleChange(idx, 'lpa', e.target.value)} placeholder="LPA" />

                        <label className={labelStyle}>Content</label>
                        <input className={`${inputStyle} w-[620px]`} value={member.content} onChange={e => handleChange(idx, 'content', e.target.value)} placeholder="Content" />
                      </div>
                      <img
                        src={deletei}
                        alt="delete"
                        className="h-[33px] w-[33px] cursor-pointer mt-12 mr-24 bg-[#333333] shrink-0"
                        onClick={() => handleDeleteMember(idx)}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end items-center gap-2 px-6 py-4 bg-[#2a2a2a] rounded-b-xl border-t border-[#444]">
                  <button onClick={handleSaveAndClose} className='font-mono w-[115px] h-[45px] rounded-md border bg-[#4a4a4a] border-white text-white flex items-center justify-center gap-2'>
                    <img src={save} alt="save" className='h-[20px] w-[20px]' />
                    <span>SAVE</span>
                  </button>
                  <button onClick={handleAddNew} className='font-mono w-[140px] h-[45px] rounded-md border bg-[#4a4a4a] border-white text-white flex items-center justify-center gap-2'>
                    <img src={attachicon} alt="add new" className='h-[20px] w-[20px]' />
                    <span>ADD NEW</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
          input[type="checkbox"] {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid #8E8E8E;
            border-radius: 4px;
            cursor: pointer;
            outline: none;
            transition: none;
            position: relative;
            background-color: #8E8E8E;
          }
          input[type="checkbox"]:checked {
            background-color: #8E8E8E;
            border-color: #8E8E8E;
          }
          input[type="checkbox"]:checked::before {
            content: '✓';
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: lightgray;
            font-size: 14px;
            font-weight: bold;
          }
          input[type="checkbox"]:focus {
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
          }
        `}</style>
      </div>
    </div>
  );
};

export default PeoplePage;
