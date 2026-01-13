import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import backgroundImage from '../../../assets/images/mesh-gradient.webp';
import projectImage from '../../../assets/images/project.png';
import icon from '../../../assets/icons/Icons.png';
import { getProject } from "../../../api/Public/getProjectDetails";

export default function ProjectDetails() {
  const { title } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await getProject();
        const projects = response.data || [];

        const mappedProjects = projects.map((p) => ({
          id: p.projectID || p.id,
          title: p.title || 'Untitled Project',
          link: p.link || '',
          description: p.description || '',
          image: p.imageBase64
            ? `data:image/jpeg;base64,${p.imageBase64}`
            : p.imagePath || projectImage,
          teamMembers: p.teamMembers
            ? Array.isArray(p.teamMembers)
              ? p.teamMembers.map((m) =>
                  typeof m === 'string'
                    ? m
                    : `${m.name || 'Unnamed'}${m.position ? ' – ' + m.position : ''}`
                )
              : [p.teamMembers.toString()]
            : [],
        }));

        const decodedTitle = decodeURIComponent(title);
        const found = mappedProjects.find((p) => p.title === decodedTitle);

        if (found) {
          setProject(found);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    if (title) {
      fetchProjectDetails();
    }
  }, [title]);

  const handleViewLive = () => {
    if (project?.link) {
      window.open(project.link, '_blank');
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen p-2 flex items-center justify-center"
        style={{
          // backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-white text-xl">Loading project details...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div
        className="min-h-screen p-2 flex items-center justify-center"
        style={{
          // backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-red-400 text-xl">{error || 'Project not found'}</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen mt-10 p-2"
      style={{
        // backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-[1420px] mx-auto py-6 pr-8 md:px-20 lg:px-24">
        {/* Title + Back */}
        <div className="flex items-center text-white py-6 mb-8 ml-[-12px]">
          <img
            src={icon}
            alt="Back"
            onClick={() => navigate(-1)}
            className="md:w-[50px] md:h-[50px] cursor-pointer mr-10"
          />
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">{project.title}</h2>
        </div>

        {/* Project image & button */}
        <div className="mb-16 ml-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[589px_1fr] gap-x-12 items-start">
          <div className="relative w-full h-auto">
            <img
              src={project.image}
              alt={`${project.title} Preview`}
              className="w-full h-auto rounded-xl"
              onError={(e) => {
                e.target.src = projectImage;
              }}
            />

            {/* Mobile View Live Button */}
            {project.link && (
              <button
                onClick={handleViewLive}
                className="absolute bottom-4 right-4 px-8 py-3 rounded-full text-[#00FF26] shadow-[2px_2px_4px_0px_#00000040,_inset_2px_2px_6px_0px_#FFFFFF80] md:hidden"
              >
                View Live
              </button>
            )}
          </div>

          {/* Desktop View Live Button */}
          {project.link && (
            <div className="hidden md:flex justify-start items-end h-full">
              <button
                onClick={handleViewLive}
                className="w-full md:w-fit lg:w-[167px] lg:h-[52px] px-8 py-3 rounded-full text-[#00FF26] shadow-[2px_2px_4px_0px_#00000040,_inset_2px_2px_6px_0px_#FFFFFF80]"
              >
                View Live
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="pt-3 pb-16 ml-14">
          <p className="text-base text-[#D2D2D2] text-justify leading-relaxed">
            {project.description || 'No description available.'}
          </p>
        </div>

        {/* Team Members */}
        <div className="text-white flex flex-col gap-7 mt-4 pb-20 ml-14">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Team Members</h2>

          {project.teamMembers && project.teamMembers.length > 0 ? (
            <ul className="space-y-2 list-disc list-inside">
              {project.teamMembers.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-2 list-disc list-inside">
              <li>Student Name – Project Manager</li>
              <li>Student Name – UI/UX Designer</li>
              <li>Student Name – UI Designer</li>
              <li>Student Name – Frontend Developer</li>
              <li>Student Name – Backend Developer</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
