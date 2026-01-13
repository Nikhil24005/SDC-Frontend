import React, { useState, useEffect } from "react";
import arrowleft from "../../../assets/buttons/leftarrow.svg";
import arrowRight from "../../../assets/buttons/rightarrow.svg";
import { getProject } from "../../../api/Public/getProjectDetails";
import imgFallback from "../../../assets/graphics/laptopimg.svg";

const FeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getProject();

        const mappedProjects = Array.isArray(response.data)
          ? response.data.map((p) => ({
              id: p.projectID || p.id,
              isVisible: true,
              projectName: p.title || p.projectName || "Untitled Project",
              projectLink: p.link || p.projectLink || "",
              projectImage: p.imageBase64
                ? `data:image/jpeg;base64,${p.imageBase64}`
                : p.imagePath
                ? p.imagePath
                : imgFallback,
              projectDescription: p.description || p.projectDescription || "",
              teamMembers: p.teamMembers
                ? Array.isArray(p.teamMembers)
                  ? p.teamMembers
                      .map((m) =>
                        typeof m === "string"
                          ? m
                          : `${m.name || ""}${
                              m.position ? " - " + m.position : ""
                            }`
                      )
                      .join("\n")
                  : p.teamMembers.toString().replace(/,/g, "\n")
                : "",
            }))
          : [];

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

    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [projects]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + projects.length) % projects.length
    );
  };

  const getCardAt = (offset) => {
    return projects.length > 0
      ? projects[(currentIndex + offset + projects.length) % projects.length]
      : null;
  };

  if (loading) {
    return (
      <div className="w-full text-center py-20 text-white">
        Loading projects...
      </div>
    );
  }

  if (error) {
    return <div className="w-full text-center py-20 text-red-400">{error}</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="w-full text-center py-20 text-white">
        No projects found.
      </div>
    );
  }

  return (
    <section className="py-12 text-white">
      <h2 className="text-4xl font-semibold text-center mb-12">
        Featured Projects
      </h2>

      <div className="relative flex items-center justify-center max-w-7xl mx-auto px-4">
        {/* Left Arrow */}
        {projects.length > 1 && (
          <button
            onClick={goToPrev}
            className="absolute w-15 h-15 left-4 md:left-40 z-20 shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)] p-2 rounded-xl cursor-pointer"
          >
            <img src={arrowleft} alt="left" className="w-full h-full" />
          </button>
        )}

        {/* Carousel Cards */}
        {projects.length === 1 ? (
          <div className="w-[90%] md:w-[60%] rounded-2xl shadow-lg bg-white/10 p-4">
            <img
              src={projects[0].projectImage}
              alt={projects[0].projectName}
              className="rounded-xl object-cover w-full"
            />
            <div className="mt-4">
              <h3 className="text-xl font-semibold">
                {projects[0].projectName}
              </h3>
              <p className="text-sm text-gray-300 mt-2 whitespace-pre-wrap">
                {projects[0].projectDescription}
              </p>
              {projects[0].teamMembers && (
                <p className="text-xs text-gray-400 mt-2 whitespace-pre-wrap">
                  <strong>Team:</strong>
                  <br />
                  {projects[0].teamMembers}
                </p>
              )}
              {projects[0].projectLink && (
                <a
                  href={projects[0].projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-blue-400 underline text-sm"
                >
                  Visit Project
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="flex -space-x-16 md:-space-x-20 items-center overflow-x-visible">
            {[getCardAt(-1), getCardAt(0), getCardAt(1)].map(
              (project, index) => {
                if (!project) return null;
                const scale =
                  index === 1
                    ? "scale-100 z-20"
                    : "scale-80 md:scale-80 z-10 opacity-30 md:opacity-40";
                return (
                  <div
                    key={`${project.projectName}-${index}`}
                    className={`w-[250px] sm:w-[280px] md:w-full h-full rounded-2xl transition-all duration-500 ${scale} shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)] bg-white/10`}
                  >
                    <div className="p-4 flex flex-col gap-4 h-full">
                      <img
                        src={project.projectImage}
                        alt={project.projectName}
                        className="rounded-xl object-cover w-full"
                      />
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm md:text-xl font-semibold">
                          {project.projectName}
                        </h3>
                        {project.projectLink && (
                          <a
                            href={project.projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)] font-semibold text-yellow-300 transition-all text-xs md:text-sm"
                            style={{ textDecoration: 'none' }}
                          >
                            Visit Project
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap" style={{ fontFamily: 'IBM Plex Mono, monospace' }} >
                        {project.projectDescription}
                      </p>
                      {project.teamMembers && (
                        <p className="text-xs text-gray-400 whitespace-pre-wrap">
                          <strong>Team:</strong>
                          <br />
                          {project.teamMembers}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}

        {/* Right Arrow */}
        {projects.length > 1 && (
          <button
            onClick={goToNext}
            className="absolute w-15 h-15 right-4 md:right-40 z-20 shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)] p-2 rounded-xl cursor-pointer"
          >
            <img src={arrowRight} alt="right" className="w-full h-full" />
          </button>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;
