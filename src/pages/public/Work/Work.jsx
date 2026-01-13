import React, { useState, useEffect } from "react";
import backgroundImage from '../../../assets/images/mesh-gradient.webp';
import projectImage from '../../../assets/images/project.png';
// import externalLinkIcon from '../../../assets/icons/breakpoint=Tablet, icon=external-link.png';
import { useNavigate } from 'react-router-dom'; 
import { getProject } from "../../../api/Public/getProjectDetails";

export default function WorkPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getProject();
        const mappedProjects = Array.isArray(response.data)
          ? response.data.map((p) => ({
              id: p.projectID || p.id,
              title: p.title || p.projectName || "Untitled Project",
              link: p.link || p.projectLink || "",
              description: p.description || "No description available.",
              image: p.imageBase64
                ? `data:image/jpeg;base64,${p.imageBase64}`
                : p.imagePath || projectImage,
              teamMembers: p.teamMembers
                ? Array.isArray(p.teamMembers)
                  ? p.teamMembers
                      .map((m) =>
                        typeof m === "string"
                          ? m
                          : `${m.name || ""}${m.position ? " - " + m.position : ""}`
                      )
                      .join(", ")
                  : p.teamMembers.toString()
                : "",
              status: p.status || "In Development",
            }))
          : [];

        setProjects(mappedProjects);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s?.includes("progress") || s?.includes("deployed") || s?.includes("completed")) {
      return "#00FF26";
    }
    return "#FFF600";
  };

  const getStatusDisplay = (status) => {
    const s = status?.toLowerCase();
    if (s?.includes("progress") || s?.includes("deployed") || s?.includes("completed")) {
      return "Deployed";
    }
    return "In Development";
  };

  if (loading) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="text-white text-xl">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen pt-30 pr-2 pb-4 pl-2 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="max-w-[1420px] mx-auto px-3">
        <div className="min-h-screen text-white">
          <h2 className="font-sans font-semibold text-3xl text-center mb-8">
            Our Projects
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-14">
            {projects.map((project, index) => (
              <div
                key={project.id || index}
                onClick={() =>
                  navigate(`/work/projectdetails/${encodeURIComponent(project.title)}`)
                }
                className="hover-animated-card relative w-full max-w-[600px] mx-auto rounded-[2rem] p-6 md:p-8 text-left cursor-pointer group transition-all duration-[800ms]"
              >
                <img
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  className="w-full h-auto max-h-[443px] rounded-xl mb-4 object-cover"
                  onError={(e) => {
                    e.target.src = projectImage;
                  }}
                />

                <div className="flex flex-wrap justify-between items-center w-full mb-2 gap-[10px] p-[10px]">
                  <h2 className="flex-1 min-w-[200px] text-left font-semibold text-[20px]">
                    {project.title}
                  </h2>
                  <span
                    className="min-w-[180px] h-[52px] rounded-[2.5rem] px-[20px] py-[12px] text-[16px] leading-[24px] text-center shadow-[2px_2px_4px_0px_#00000040,_inset_2px_2px_6px_0px_#FFFFFF80]"
                    style={{
                      backgroundColor: "transparent",
                      color: getStatusColor(project.status),
                    }}
                  >
                    {getStatusDisplay(project.status)}
                  </span>
                </div>

                <p className="p-[10px] text-left text-[16px] leading-[24px] tracking-[0.15rem] break-words">
                  {project.description}
                </p>

                {project.teamMembers && (
                  <p className="p-[10px] text-sm text-gray-300 mt-2">
                    <strong>Team:</strong> {project.teamMembers}
                  </p>
                )}

                {project.link && (
                  <a
                    href={project.link}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    {/* <img
                      src={externalLinkIcon}
                      alt="External link"
                      className="w-6 h-6 filter contrast-150"
                    /> */}
                  </a>
                )}
              </div>
            ))}
          </div>

          {projects.length === 0 && !loading && (
            <div className="text-center text-white text-xl mt-10">
              No projects found.
            </div>
          )}
        </div>
      </div>

      {/* Hover + glow styles */}
      <style>{`
        @keyframes fadeBackground {
          0% { background-color: rgba(255, 255, 255, 0.05); }
          40% { background-color: rgba(30, 30, 30, 0.75); }
          100% { background-color: rgba(255, 255, 255, 0.1); }
        }

        .hover-animated-card {
          background-color: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: background-color 0.8s ease-in-out, box-shadow 0.8s ease-in-out;
        }

        .hover-animated-card:hover {
          animation: fadeBackground 0.8s ease-in-out forwards;
          box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.6), 0 0 18px 3px rgba(0, 191, 255, 0.4);
        }
      `}</style>
    </div>
  );
}
