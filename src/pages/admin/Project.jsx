import React, { useState, useEffect } from "react";
import project from "../../assets/images/project.png";
import edit from "../../assets/icons/edit.png";
import trash from "../../assets/icons/delete.png";
import cross from "../../assets/icons/cross.svg";
import save from "../../assets/icons/save.png";
import plus from "../../assets/icons/add.png";
import { addProject } from "../../api/Admin/Project/addProject";
import { getProject } from "../../api/Admin/Project/getProject";
import { updateProject } from "../../api/Admin/Project/updateProject";
import { deleteProject } from "../../api/Admin/Project/deleteProject";

const WorkPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch projects from backend on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProject();
      console.log("API Response:", res); // Debug log

      // Handle different response structures
      let projectData = [];
      if (Array.isArray(res)) {
        projectData = res;
      } else if (res && Array.isArray(res.data)) {
        projectData = res.data;
      } else if (res && res.projects && Array.isArray(res.projects)) {
        projectData = res.projects;
      }

      // Map backend fields to frontend state
      const mappedProjects = projectData.map((p) => ({
        id: p.projectID || p.id,
        isVisible: true,
        projectName: p.title || p.projectName || "Untitled Project",
        projectLink: p.link || p.projectLink || "",
        projectImage: p.imageBase64
          ? `data:image/jpeg;base64,${p.imageBase64}`
          : p.imagePath
          ? p.imagePath
          : project,
        projectDescription: p.description || p.projectDescription || "",
        teamMembers: p.teamMembers
          ? Array.isArray(p.teamMembers)
            ? p.teamMembers
                .map((m) =>
                  typeof m === "string"
                    ? m
                    : `${m.name || ""}${m.position ? " - " + m.position : ""}`
                )
                .join("\n")
            : p.teamMembers.toString().replace(/,/g, "\n")
          : "",
      }));

      setProjects(mappedProjects);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        "Failed to fetch projects: " +
          (err.response?.data?.message || err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    setLoading(true);
    try {
      await deleteProject(id);
      setProjects(projects.filter((proj) => proj.id !== id));
      setError(null);
    } catch (err) {
      console.error("Delete error:", err);
      setError(
        "Failed to delete project: " +
          (err.response?.data?.message || err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (projectToEdit) => {
    setCurrentProject({ ...projectToEdit }); // Create a copy to edit
    setIsEditing(true);
    setError(null);
  };

  const handleSave = async () => {
    if (!currentProject) return;

    // Validate required fields
    if (!currentProject.projectName?.trim()) {
      setError("Project name is required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Prepare image data
      let imageData = null;
      if (
        currentProject.projectImage &&
        currentProject.projectImage !== project
      ) {
        if (
          typeof currentProject.projectImage === "string" &&
          currentProject.projectImage.startsWith("data:")
        ) {
          imageData = currentProject.projectImage;
        } else if (currentProject.projectImage instanceof File) {
          imageData = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(currentProject.projectImage);
          });
        } else {
          imageData = currentProject.projectImage;
        }
      }

      // Prepare team members data
      const teamMembersString = currentProject.teamMembers
        .split("\n")
        .map((m) => m.replace(/^•\s?/, "").trim())
        .filter(Boolean)
        .join(",");

      // Prepare payload for API
      const payload = {
        title: currentProject.projectName.trim(),
        description: currentProject.projectDescription?.trim() || "",
        link: currentProject.projectLink?.trim() || "",
        imageBase64: imageData,
        teamMembers: teamMembersString,
      };

      console.log("Saving payload:", payload); // Debug log

      // Check if this is an update or add operation
      if (
        currentProject.id &&
        projects.some((p) => p.id === currentProject.id)
      ) {
        // Update existing project
        await updateProject(currentProject.id, payload);
      } else {
        // Add new project
        await addProject(payload);
      }

      // Refresh the projects list
      await fetchProjects();

      // Close the modal
      setIsEditing(false);
      setCurrentProject(null);
    } catch (err) {
      console.error("Save error:", err);
      setError(
        "Failed to save project: " +
          (err.response?.data?.message || err.message || "Unknown error")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }

      // Validate file size (limit to 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError("Please select an image smaller than 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProject({
          ...currentProject,
          projectImage: reader.result,
        });
        setError(null);
      };
      reader.onerror = () => {
        setError("Error reading the image file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("project-image-upload").click();
  };

  const handleCreateNewProject = () => {
    const newProject = {
      id: null,
      isVisible: true,
      projectName: "",
      projectLink: "",
      projectImage: project,
      projectDescription: "",
      teamMembers: "",
    };
    setCurrentProject(newProject);
    setIsEditing(true);
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setCurrentProject({
      ...currentProject,
      [field]: value,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentProject(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main scrollable content area */}
      <div
        className="w-full h-[79vh] overflow-y-auto ml-5"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#4a4a4a #1a1a1a",
          msOverflowStyle: "auto",
        }}
      >
        <style jsx>{`
          /* Custom scrollbar for webkit browsers */
          .w-full::-webkit-scrollbar {
            width: 6px;
          }
          .w-full::-webkit-scrollbar-track {
            background: #1a1a1a;
            border-radius: 3px;
          }
          .w-full::-webkit-scrollbar-thumb {
            background: #4a4a4a;
            border-radius: 3px;
          }
          .w-full::-webkit-scrollbar-thumb:hover {
            background: #5a5a5a;
          }
        `}</style>

        <div className="flex justify-center">
          <div className="w-full max-w-[1136px] space-y-[20px] px-[30px] pt-[5px] pb-[10px] mr-[50px]">
            {/* Sticky header with Create New button */}
            <div className="sticky top-0 z-10 w-full flex justify-end items-center px-[30px] py-[10px]">
              <button
                onClick={handleCreateNewProject}
                disabled={loading}
                className="w-[170px] h-[45px] flex items-center gap-[8px] rounded-md pt-[8px] pr-[16px] pb-[8px] pl-[16px] border border-white backdrop-blur-[4px] shadow-[2px_4px_4px_0px_#00000040,inset_2px_2px_8px_0px_#FFFFFF40] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFFFFF10] transition-colors"
              >
                <img src={plus} alt="plus" className="w-6 h-6" />
                <span className="text-white font-semibold text-[16px] leading-[24px] tracking-[0.02em] uppercase">
                  CREATE NEW
                </span>
              </button>
            </div>

            {/* Projects List */}
            {loading ? (
              <div className="text-white text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-white text-center py-10">
                <p className="text-xl">No projects found.</p>
                <p className="text-gray-400 mt-2">
                  Create your first project to get started!
                </p>
              </div>
            ) : (
              // projects.map(
              //   (proj) =>
              //     proj.isVisible !== false && (
              //       <div
              //         key={proj.id}
              //         className="w-full min-h-[460px] bg-[#141414] rounded-xl shadow-[2px_2px_6px_0px_#FFFFFF26] flex flex-col hover:shadow-[2px_2px_8px_0px_#FFFFFF40] transition-shadow"
              //       >
              projects
                .filter((proj) => proj.isVisible !== false)
                .map((proj, index) => (
                  <div
                    key={index}
                    className="w-full min-h-[460px] bg-[#141414] rounded-xl shadow-[2px_2px_6px_0px_#FFFFFF26] flex flex-col hover:shadow-[2px_2px_8px_0px_#FFFFFF40] transition-shadow"
                  >
                    {/* Project Header */}
                    <div className="w-full h-[60px] bg-[#8E8E8E] flex items-center px-[28px] rounded-t-xl flex-shrink-0">
                      <h2 className="text-[#333333] font-semibold text-[18px] font-sans">
                        Project {index + 1}
                      </h2>
                      <div className="flex ml-auto space-x-4">
                        <div className="flex gap-2 items-center text-sm">
                          <span>Page</span>
                          <button className="px-3 py-1 bg-gray-200 text-black rounded-md text-xs font-medium cursor-pointer">
                            Project
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="flex justify-start items-start px-[48px] pt-[32px] flex-grow">
                      <div className="w-[220px] h-[160px] flex-shrink-0">
                        <img
                          src={proj.projectImage}
                          alt="Project Preview"
                          className="w-full h-full object-cover bg-white border border-white rounded-sm"
                          onError={(e) => {
                            e.target.src = project;
                          }}
                        />
                      </div>

                      <div className="w-[828px] pr-[28px] pb-[24px] pl-[20px] -mt-3">
                        <div className="w-[772px] h-auto pr-[8px] pb-[4px] pl-[8px]">
                          <h4 className="text-white text-[18px] font-semibold leading-[24px] font-sans break-words whitespace-normal">
                            {proj.projectName || "Untitled Project"}
                          </h4>
                          <div className="w-[772px] h-auto gap-[10px] pt-[4px] pr-[8px] pb-[4px] pl-[8px]">
                            <h5 className="w-[752px] h-auto text-[16px] font-semibold leading-[24px] text-[#D2D2D2] -ml-2 break-all whitespace-normal">
                              {proj.projectLink || "No link provided"}
                            </h5>
                          </div>
                        </div>

                        <div className="w-[772px] h-auto pt-[20px] pr-[8px] pl-[8px]">
                          <p className="w-[752px] h-auto text-[14px] leading-[20px] text-[#D2D2D2] text-justify break-words whitespace-normal">
                            {proj.projectDescription ||
                              "No description provided"}
                          </p>
                        </div>

                        <div className="w-[772px] h-[32px] gap-[10px] pr-[8px] pb-[4px] pl-[8px]">
                          <h3 className="text-[16px] font-semibold leading-[24px] text-white">
                            Team Members
                          </h3>
                        </div>

                        <div className="w-[772px] h-auto gap-[10px] pt-[4px] pr-[8px] pb-[4px] pl-[8px]">
                          <ul className="w-[752px] h-auto text-[14px] text-[#D2D2D2] list-disc pl-5 text-justify break-words whitespace-normal">
                            {proj.teamMembers ? (
                              proj.teamMembers
                                .split("\n")
                                .map((member, index) => (
                                  <li key={index}>{member}</li>
                                ))
                            ) : (
                              <li>No team members listed</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Project Actions */}
                    <div className="w-full h-[70px] bg-[#30303099] flex justify-between items-center px-[28px] py-[12px] rounded-b-xl flex-shrink-0 mt-auto">
                      <div className="flex items-center gap-[28px] ml-auto">
                        <button
                          onClick={() => handleEdit(proj)}
                          disabled={loading}
                          className="w-[105px] h-[45px] flex items-center gap-[8px] rounded-md pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#ACACAC40] border border-white backdrop-blur-[4px] shadow-[2px_4px_4px_0px_#00000040,inset_2px_2px_8px_0px_#FFFFFF40] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFFFFF10] transition-colors"
                        >
                          <img src={edit} alt="edit" className="w-6 h-6" />
                          <span className="text-white font-semibold text-[16px] leading-[24px] tracking-[0.02em] uppercase">
                            EDIT
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id)}
                          disabled={loading}
                          className="w-[120px] h-[45px] flex items-center gap-[8px] rounded-md pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#ACACAC40] border border-white backdrop-blur-[4px] shadow-[2px_4px_4px_0px_#00000040,inset_2px_2px_8px_0px_#FFFFFF40] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
                        >
                          <img src={trash} alt="trash" className="w-5 h-5" />
                          <span className="text-white font-semibold text-[16px] leading-[24px] tracking-[0.02em] uppercase">
                            DELETE
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}

            {/* Edit Modal */}
            {isEditing && currentProject && (
              <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/50 flex justify-center items-center">
                <div className="w-[894px] h-auto max-h-[90vh] bg-[#1e1e1e] rounded-lg p-0 shadow-lg text-white relative flex flex-col">
                  {/* Modal Header */}
                  <div className="w-full h-[60px] flex justify-between items-center bg-[#8E8E8E] px-[28px] rounded-t-lg flex-shrink-0">
                    <h2 className="text-[#333333] font-sans font-semibold text-[16px] leading-[24px]">
                      {currentProject.id
                        ? "Edit Project Details"
                        : "Create New Project"}
                    </h2>
                    <button
                      onClick={handleCancel}
                      className="text-[#333333] text-2xl font-bold hover:text-red-600 transition-colors"
                    >
                      <img src={cross} alt="cross" className="w-8 h-8" />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div
                    className="p-6 space-y-4 overflow-y-auto flex-grow"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#4a4a4a #1a1a1a",
                    }}
                  >
                    {/* Image Upload */}
                    <div className="relative w-[252px] h-[190px] mb-4 group cursor-pointer rounded-sm overflow-hidden">
                      <div
                        className="relative w-[252px] h-[190px] mb-4 cursor-pointer rounded-sm overflow-hidden group"
                        onClick={triggerFileInput}
                      >
                        <img
                          src={currentProject.projectImage}
                          alt="Project Preview"
                          className="w-full h-full object-cover rounded-sm"
                          onError={(e) => {
                            e.target.src = project;
                          }}
                        />

                        <div className="absolute inset-0 bg-black/50 flex justify-center items-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <img
                            src={edit}
                            alt="Edit Icon"
                            className="w-12 h-12 opacity-80 hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      <input
                        id="project-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>

                    {/* Project Name */}
                    <div className="w-full font-semibold text-sm leading-[100%] tracking-[0.08em] uppercase">
                      PROJECT NAME *
                      <input
                        type="text"
                        value={currentProject.projectName}
                        onChange={(e) =>
                          handleInputChange("projectName", e.target.value)
                        }
                        className="w-full mt-1 h-auto min-h-[48px] rounded-md pt-[12px] pr-[16px] pb-[12px] pl-[16px] shadow-[2px_2px_4px_0px_#00000040,inset_2px_2px_6px_0px_#FFFFFF80] bg-[#303030] text-[#D2D2D2] box-border break-words whitespace-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter project name"
                        required
                      />
                    </div>

                    {/* Project Link */}
                    <div className="w-full font-semibold text-sm leading-[100%] tracking-[0.08em] uppercase">
                      PROJECT DEPLOYED LINK
                      <input
                        type="url"
                        value={currentProject.projectLink}
                        onChange={(e) =>
                          handleInputChange("projectLink", e.target.value)
                        }
                        className="w-full mt-1 h-auto min-h-[48px] rounded-md pt-[12px] pr-[16px] pb-[12px] pl-[16px] shadow-[2px_2px_4px_0px_#00000040,inset_2px_2px_6px_0px_#FFFFFF80] bg-[#303030] text-[#D2D2D2] box-border break-all whitespace-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://your-project-link.com"
                      />
                    </div>

                    {/* Description */}
                    <div className="w-full font-semibold text-sm leading-[100%] tracking-[0.08em] uppercase">
                      DESCRIPTION
                      <textarea
                        rows="5"
                        value={currentProject.projectDescription}
                        onChange={(e) =>
                          handleInputChange(
                            "projectDescription",
                            e.target.value
                          )
                        }
                        className="w-full mt-1 min-h-[48px] max-h-[250px] rounded-md pt-[12px] pr-[16px] pb-[12px] pl-[16px] resize-none shadow-[2px_2px_4px_0px_#00000040,inset_2px_2px_6px_0px_#FFFFFF80] bg-[#303030] text-[#D2D2D2] box-border overflow-y-auto break-words whitespace-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe your project..."
                      />
                    </div>

                    {/* Team Members */}
                    <div className="w-full font-semibold text-sm leading-[100%] tracking-[0.08em] uppercase">
                      TEAM MEMBERS
                      <textarea
                        rows="5"
                        value={currentProject.teamMembers
                          .split("\n")
                          .map((member) => (member.trim() ? `• ${member}` : ""))
                          .filter(Boolean)
                          .join("\n")}
                        onChange={(e) =>
                          handleInputChange(
                            "teamMembers",
                            e.target.value.replace(/^•\s?/gm, "")
                          )
                        }
                        className="w-full mt-1 min-h-[48px] max-h-[250px] rounded-md pt-[12px] pr-[16px] pb-[12px] pl-[16px] resize-none shadow-[2px_2px_4px_0px_#00000040,inset_2px_2px_6px_0px_#FFFFFF80] bg-[#303030] text-[#D2D2D2] box-border overflow-y-auto break-words whitespace-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter team members (one per line)&#10;Example:&#10;John Doe - Lead Developer&#10;Jane Smith - Designer"
                      />
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="w-full h-[73px] bg-[#30303099] flex items-center justify-end px-[28px] py-[12px] gap-[20px] rounded-b-lg flex-shrink-0">
                    {/* <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="w-[105px] h-[45px] flex items-center gap-[8px] rounded-md pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#666666] border border-gray-400 backdrop-blur-[4px] shadow-[2px_4px_4px_0px_#00000040,inset_2px_2px_8px_0px_#FFFFFF40] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors uppercase"
                    >
                      <span className="text-white font-semibold text-[16px] leading-[24px] tracking-[0.02em] uppercase font-sans">
                        CANCEL
                      </span>
                    </button> */}
                    <button
                      onClick={handleSave}
                      disabled={saving || !currentProject.projectName?.trim()}
                      className="w-[105px] h-[45px] flex items-center gap-[8px] rounded-md pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#ACACAC40] border border-white backdrop-blur-[4px] shadow-[2px_4px_4px_0px_#00000040,inset_2px_2px_8px_0px_#FFFFFF40] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors uppercase"
                    >
                      {saving ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <img src={save} alt="save" className="w-6 h-6" />
                      )}
                      <span className="text-white font-semibold text-[16px] leading-[24px] tracking-[0.02em] uppercase font-sans">
                        {saving ? "SAVING..." : "SAVE"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkPage;
