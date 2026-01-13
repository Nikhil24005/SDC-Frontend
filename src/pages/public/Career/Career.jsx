import React, { useState } from "react";
import { Listbox } from "@headlessui/react";
import cross from "../../../assets/icons/cross.svg";
import attachicon from "../../../assets/icons/attachicon.png"; // or .png depending on your file
import { postApplication } from "../../../api/Public/postApplication";
import ApplicationFormNew from "../../../components/ApplicationFormNew";
import President from "../../../assets/icons/president1.png";
import tech from "../../../assets/icons/tech.png";
import team from "../../../assets/icons/group.png";


const branches = ["CSE", "CS-AI", "CS-DS", "IT"];
const years = ["1st", "2nd", "3rd", "4th"];
const positions = [
  "Frontend Developer",
  "Backend Developer",
  "UI Designer",
  "Social Media Manager",
];
const roleDescriptions = {
  "President": "Leads the Student Developers Community with vision. Oversees all operations and sets long-term goals.",
  "Vice President": "Supports the President in execution. Coordinates between teams for smooth functioning.",
  "Secretary": "Maintains documentation and communication. Ensures timely updates and meeting records.",
  "Project Manager": "Plans and manages ongoing projects. Ensures deliverables are met on time.",
  "Technical Head": "Leads technical initiatives and mentoring. Oversees coding standards and innovation.",
  "Design Head": "Handles the community’s design needs. Maintains a consistent and creative visual identity.",
  "Team Lead": "Guides a specific team on tasks or events. Bridges communication between members and heads.",
  "Developer": "Builds software solutions and tools. Participates in coding, testing, and collaboration.",
  "Designer": "Creates UI/UX, posters, and digital content. Works closely with the media and dev team.",
  "Trainee": "Learns through hands-on experience. Assists in projects under senior guidance.",
};


const Career = () => {
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const roles = [
    ["President", "Vice President"],
    ["Secretary", "Project Manager"],
    ["Technical Head", "Design Head"],
    ["Team Lead", "Developer"],
    ["Designer", "Trainee"],
  ];
  const roleImages = {
  President: President, 
  "Vice President": President,
  "Secretary": President,
  "Project Manager": team,
  "Technical Head": team,
  "Design Head": team,
  "Team Lead": team,
  "Developer": tech,
  "Designer": tech,
  "Trainee": tech,
};
  const [showModal, setShowModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    year: "",
    branch: "",
    enrollment: "",
    position: "",
    experience: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    console.log("Resume attached:", e.target.files[0]);
  };

  const handleApply = async () => {
    setLoading(true);
    setFeedback("");
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => form.append(key, value));
    if (resumeFile) form.append("resume", resumeFile);
    try {
      await postApplication(form);
      setFeedback("Application submitted successfully!");
      setShowModal(false);
      setFormData({
        name: "",
        contact: "",
        email: "",
        year: "",
        branch: "",
        enrollment: "",
        position: "",
        experience: "",
      });
      setResumeFile(null);
      setSelectedBranch("");
      setSelectedYear("");
      setSelectedPosition("");
    } catch (error) {
      setFeedback("Failed to submit application. Please try again.");
      console.error("Application failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className=" text-white px-6 sm:px-20 py-24 font-sans">
        <h2 className="text-4xl font-bold mb-10  pb-4 ml-15">Career At SDC</h2>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {roles.map(([left, right], index) => (
            <React.Fragment key={index}>
              {/* Left Cell */}
              <div className="ml-0 md:ml-15 px-4 py-7 w-full md:w-[586px] bg-blur bg-transparent  rounded-xl" style={{
    boxShadow: "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80"
  }}>
                <img src={roleImages[left]} alt={left} className="w-7 h-7 mb-2 ml-2" />
                <h3 className="ml-2 text-lg font-semibold font-inter">{left}</h3>
                <p className="text-white/80 ml-2 text-sm mt-1 font-mono leading-6">
                  {roleDescriptions[left]}
                </p>
              </div>

              {/* Right Cell */}
              <div className=" px-4 py-7 w-full md:w-[586px] bg-blur bg-transparent  rounded-xl" style={{
    boxShadow: "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80"
  }}>
    <img src={roleImages[right]} alt={right} className="w-7 h-7 mb-2 ml-2" />
                <h3 className="text-lg font-semibold font-inter ml-2">{right}</h3>
                <p className="text-white/80 text-sm mt-1 font-mono leading-6 ml-2">
                  {roleDescriptions[right]}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h4 className="text-lg font-bold mb-2">
            Build More Than Code — Build a Better Future
          </h4>
          <p className="text-white/80 mb-4 mx-auto text-sm max-w-2xl font-mono leading-6">
            Join our team of innovators, problem-solvers, and changemakers. Your
            skills can drive real-world impact.
            <br />
            Ready to make a difference?
          </p>
          <button
            style={{
              boxShadow: "0px 6px 30px rgba(255, 255, 255, 0.1)",
            }}
            className="bg-[#AA1E6B] text-white font-semibold px-6 py-3 rounded-md transition"
            onClick={() => setShowModal(true)}
          >
            JOIN US NOW
          </button>
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              {/* <ApplicationForm onSuccess={() => setShowModal(true)} onClose={() => setShowModal(false)} /> */}
              <ApplicationFormNew onSuccess={() => setShowModal(true)} onClose={() => setShowModal(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Career;
