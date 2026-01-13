
import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import Testimonial1 from "../../../assets/graphics/Testimonial1.svg";
import linkedin from "../../../assets/social/linkeldin.png";
import git from "../../../assets/social/GitIcon.svg";
import cross from "../../../assets/icons/cross.svg";
import attachicon from "../../../assets/buttons/PlusButton.svg";
import { getPeople } from "../../../api/Public/getPeople";

const years = ["1st", "2nd", "3rd", "4th"];
const branches = [
  "Computer Science Core",
  "Computer Science AI",
  "Information Technology",
  "Electronics",
];
const positions = ["Member", "Lead", "Coordinator"];

const ProfileCard = ({ name, role, position, image, linkedinUrl, gitUrl }) => {
  return (
    <div className="w-full md:gap-8 p-4 md:p-4 rounded-xl shadow-[2px_2px_4px_0px_#00000040,inset_2px_2px_6px_0px_#FFFFFF80] text-white flex flex-row items-center">
      {/* Image on the left */}
      <div className="w-[70px] h-[150px] md:w-[120px] md:h-[140px] rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={image || Testimonial1}
          alt={name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Text on the right */}
      <div className="flex flex-col justify-center text-left h-auto w-full ml-4 mt-0">
        <h3 className="font-semibold text-md md:text-xl leading-[1.5rem] font-serif">
          {name}
        </h3>
        <p className="font-normal text-[12px] md:text-[14px] leading-[20px] font-serif">
          {role}
        </p>
        <p className="font-normal text-[10px] md:text-[14px] leading-[24px] font-serif">
          {position}
        </p>
        <div className="flex items-center gap-2 md:gap-4 mt-10">
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={linkedin}
                alt="LinkedIn"
                className="w-8 h-8 md:w-10 md:h-10 cursor-pointer hover:opacity-80"
              />
            </a>
          )}
          {gitUrl && (
            <a href={gitUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={git}
                alt="GitIcon"
                className="w-8 h-8 md:w-10 md:h-10 cursor-pointer hover:opacity-80"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const JoinCard = ({ setShowModal }) => (
  <div className="w-[380px] md:w-[815px] gap-[20px] p-4 rounded-xl shadow-[2px_2px_4px_0px_#00000040,inset_2px_2px_6px_0px_#FFFFFF80] text-white flex flex-col justify-center items-center text-center">
    <h3 className="w-full md:w-[293px] h-[32px] text-white font-semibold text-lg md:text-2xl leading-[<line-height>] tracking-[0em]">
      You Could Be One Of Us!
    </h3>
    <p className="text-center font-normal text-base md:text-sm leading-[<lineHeight>] tracking-[0.1rem]">
      Apply Now To Join Our Team
    </p>
    <button
      onClick={() => setShowModal(true)}
      className="w-[116px] h-[51px] opacity-100 px-8 py-2 gap-[16px] rounded-md text-xl font-semibold bg-[#AA1E6B] shadow-[0px_0px_25px_0px_#8E2DE240] cursor-pointer"
    >
      APPLY
    </button>
  </div>
);

const TeamMembers = () => {
  const [showModal, setShowModal] = useState(false);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getPeople();
        const teamData = response?.data || response;
        if (Array.isArray(teamData)) {
          setTeam(teamData);
        } else {
          setTeam([]);
        }
      } catch (err) {
        console.error("Error fetching team:", err);
        setError("Failed to load team members.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleApply = () => {
    // You can add your form submission logic here
    console.log("Form Data:", formData);
    console.log("Resume File:", resumeFile);
    alert(
      "Application submitted! (This is a demo. Actual submission logic would be here.)"
    );
    setShowModal(false); // Close the modal after applying
    // Optionally reset form data
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
    setSelectedYear(null);
    setSelectedBranch(null);
    setSelectedPosition(null);
    setResumeFile(null);
  };

  return (
    <div className="w-full opacity-100 relative top-[40px pb-10 md:pr-30 md:pl-30">
      <div className="w-full mx-auto flex flex-col gap-12">
        <h2 className="text-center text-white font-semibold text-4xl leading-[2rem] tracking-normal">
          Team That Make It Happen
        </h2>

        {/* Grid of Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 align-center w-full ">
          {loading && (
            <p className="text-white text-center col-span-2 md:col-span-3">
              Loading...
            </p>
          )}
          {error && (
            <p className="text-red-500 text-center col-span-2 md:col-span-3">
              {error}
            </p>
          )}
          {!loading &&
            !error &&
            team.map((member, idx) => (
              <ProfileCard
                key={member.memberId || idx}
                name={member.name}
                role={member.branch}
                position={member.position}
                image={member.imagePath}
                linkedinUrl={member.linkdin_url}
                gitUrl={member.github_url}
              />
            ))}
          <JoinCard setShowModal={setShowModal} />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div
            style={{
              boxShadow:
                "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80",
              background: "rgba(0, 0, 0, 0.15)",
              backdropFilter: "blur(5px)",
            }}
            className=" bg-black/10 p-6 rounded-xl w-[95%] max-w-4xl relative"
          >
            <h1 className="font-sans font-medium text-[18px] leading-[1.5] tracking-normal text-center justify-center w-full h-[36px] text-3xl opacity-100 text-white ">
              Application Form
            </h1>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-white text-xl"
            >
              <img
                src={cross}
                alt=""
                className="mt-[0.4rem] h-[20px] w-[20px]"
              />
            </button>
            <form className="space-y-4">
              <div className="text-left">
                <div className="mt-[2rem]">
                  <label
                    className="text-14 text-white uppercase ml-[0.5rem] "
                    style={{
                      fontFamily: "Inter",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      boxShadow:
                        "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80",
                      fontFamily: "IBM Plex Mono",
                      fontWeight: 400,
                      wordWrap: "break-word",
                    }}
                    className="w-full pl-[1rem] bg-transparent border border-white/30 rounded-xl px-3 py-2 text-white "
                    placeholder="Enter your Full name"
                    onKeyDown={(e) => {
    const key = e.key;
    const isValid =
      /^[a-zA-Z\s]$/.test(key) || // allow letters and space
      key === "Backspace" ||
      key === "Tab" ||
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "Delete";
    if (!isValid) {
      e.preventDefault();
    }
  }}
  onPaste={(e) => {
    const paste = e.clipboardData.getData("text");
    if (/[^a-zA-Z\s]/.test(paste)) {
      e.preventDefault();
    }
  }}
                  />
                </div>
                <div className="flex mt-[0.5rem] gap-5">
                  <div>
                    <label
                      className=" text-white uppercase ml-[0.5rem]"
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      Contact Number
                    </label>
                    <input
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      onInput={(e) => {
                        let val = e.target.value.replace(/[^0-9]/g, "");

                        // If first diGitIcon is NOT 6,7,8,9 — block it
                        if (val.length === 1 && !/^[6-9]/.test(val)) {
                          val = "";
                        }

                        // Always limit to 10 diGitIcons
                        val = val.slice(0, 10);
                        e.target.value = val;
                      }}
                      style={{
                        boxShadow:
                          "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80",
                        fontFamily: "IBM Plex Mono",
                        fontWeight: 400,
                        wordWrap: "break-word",
                      }}
                      className="w-[410px] pl-[1rem] bg-transparent border border-white/30 rounded-xl px-3 py-2 text-white"
                      placeholder="Enter your Contact no."
                      onKeyDown={(e) => {
    const key = e.key;
    const allowed =
      /^[0-9]$/.test(key) ||
      key === "Backspace" ||
      key === "Tab" ||
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "Delete";
    if (!allowed) {
      e.preventDefault();
    }
  }}
  onPaste={(e) => {
    const paste = e.clipboardData.getData("text");
    if (!/^[6-9][0-9]{0,9}$/.test(paste)) {
      e.preventDefault();
    }
  }}
                    />
                  </div>
                  <div>
                    <label
                      className=" text-white uppercase ml-[0.5rem]"
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      Email
                    </label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onInput={(e) => {
                        const val = e.target.value;

                        // If the user types '@' and the domain isn't medicaps.ac.in, block it
                        if (
                          val.includes("@") &&
                          !val.endsWith("@medicaps.ac.in")
                        ) {
                          // Optional: auto-replace domain
                          const prefix = val.split("@")[0];
                          e.target.value = prefix + "@medicaps.ac.in";
                        }
                      }}
                      style={{
                        boxShadow:
                          "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80",
                        fontFamily: "IBM Plex Mono",
                        fontWeight: 400,
                        wordWrap: "break-word",
                      }}
                      className="w-[420px] pl-[1rem] bg-transparent border border-white/30 rounded-xl px-3 py-2 text-white"
                      placeholder="Enter your Email ID"
                        onBlur={(e) => {
    const value = e.target.value;
    if (
      value !== "" &&
      !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)
    ) {
      alert("Please enter a valid Gmail address");
    }
  }}

                    />
                  </div>
                </div>
                <div className="flex mt-[0.5rem] gap-5">
                  <div>
                    <label
                      className=" text-white uppercase ml-[0.5rem] "
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      Year
                    </label>
                    <Listbox
                      value={selectedYear}
                      onChange={(val) => {
                        setSelectedYear(val);
                        setFormData((prev) => ({ ...prev, year: val }));
                      }}
                    >
                      <div className="relative mt-1 w-[410px]">
                        <Listbox.Button
                          className="relative w-[412px] cursor-pointer rounded-xl bg-transparent border border-white/30 text-left px-4 py-2 text-white shadow-lg backdrop-blur-sm"
                          style={{
                            boxShadow:
                              "2px 2px 4px #00000040, inset 2px 2px 6px #FFFFFF80",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: 400,
                            wordWrap: "break-word",
                          }}
                        >
                          {selectedYear ? (
                            selectedYear
                          ) : (
                            <span className="text-white opacity-50">
                              Select your Year
                            </span>
                          )}
                        </Listbox.Button>
                        <Listbox.Options
                          style={{
                            boxShadow:
                              "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80",
                          }}
                          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-black/50 text-white shadow-lg backdrop-blur-sm border border-white/30"
                        >
                          {years.map((year, idx) => (
                            <Listbox.Option
                              key={idx}
                              value={year}
                              className={({ active }) =>
                                `cursor-pointer px-4 py-2 ${
                                  active ? "bg-white/20" : "bg-transparent"
                                }`
                              }
                            >
                              {year}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                  <div>
                    <label
                      className="text-xs text-white uppercase ml-[0.5rem]"
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      Branch
                    </label>
                    <Listbox
                      value={selectedBranch}
                      onChange={(val) => {
                        setSelectedBranch(val);
                        setFormData((prev) => ({ ...prev, branch: val }));
                      }}
                    >
                      <div className="relative mt-1">
                        <Listbox.Button
                          className="relative w-[410px] cursor-pointer rounded-xl bg-transparent border border-white/30 text-left px-4 py-2 text-white shadow-lg backdrop-blur-sm"
                          style={{
                            boxShadow:
                              "2px 2px 4px #00000040, inset 2px 2px 6px #ffffff80",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: 400,
                            wordWrap: "break-word",
                          }}
                        >
                          {selectedBranch ? (
                            selectedBranch
                          ) : (
                            <span className="w-[410px] h-[40px] pl-[1rem] bg-transparent border-white/30 rounded-xl px-3 py-2 text-white opacity-50">
                              Select your Branch
                            </span>
                          )}
                        </Listbox.Button>

                        <Listbox.Options
                          style={{
                            boxShadow:
                              "2px 2px 4px 0px #00000040, inset 2px 2px 6px #ffffff80",
                          }}
                          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-black/10 text-white shadow-lg backdrop-blur border border-white/30"
                        >
                          {branches.map((branch, idx) => (
                            <Listbox.Option
                              key={idx}
                              value={branch}
                              className={({ active }) =>
                                `cursor-pointer px-4 py-2 ${
                                  active ? "bg-white/20 " : "bg-transparent "
                                }`
                              }
                            >
                              {branch}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                </div>
                <div className="flex mt-[0.5rem] gap-5">
                  <div>
                    <label
                      className="text-xs text-white uppercase ml-[0.5rem]"
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      Enrollment Number
                    </label>
                    <input
                      name="enrollment"
                      value={formData.enrollment}
                      onChange={handleChange}
                      style={{
                        boxShadow:
                          "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80",
                        fontFamily: "IBM Plex Mono",
                        fontWeight: 400,
                        wordWrap: "break-word",
                      }}
                      className="w-[410px] h-[40px] pl-[1rem] bg-transparent border border-white/30 rounded-xl px-3 py-2 text-white backdrop-opacity-50"
                      placeholder="Enter your Enrollment no."
                    />
                  </div>
                  <div>
                    <label
                      className="text-xs text-white uppercase ml-[0.5rem]"
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      Position
                    </label>
                    <Listbox
                      value={selectedPosition}
                      onChange={(val) => {
                        setSelectedPosition(val);
                        setFormData((prev) => ({
                          ...prev,
                          position: val,
                        }));
                      }}
                    >
                      <div className="relative mt-1 w-[420px]">
                        <Listbox.Button
                          className="relative w-full cursor-pointer rounded-xl bg-transparent border border-white/30 text-left px-4 py-2 text-white shadow-lg backdrop-blur-sm"
                          style={{
                            boxShadow:
                              "2px 2px 4px #00000040, inset 2px 2px 6px #FFFFFF80",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: 400,
                            wordWrap: "break-word",
                          }}
                        >
                          {selectedPosition ? (
                            selectedPosition
                          ) : (
                            <span className="w-[410px] h-[40px] pl-[1rem] bg-transparent border-white/30 rounded-xl text-white opacity-50">
                              Select Position to Apply
                            </span>
                          )}
                        </Listbox.Button>
                        <Listbox.Options
                          style={{
                            boxShadow:
                              "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80",
                          }}
                          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-black/10 text-white shadow-lg backdrop-blur-sm border border-white/30"
                        >
                          {positions.map((pos, idx) => (
                            <Listbox.Option
                              key={idx}
                              value={pos}
                              className={({ active }) =>
                                `cursor-pointer px-4 py-2 ${
                                  active ? "bg-white/20" : "bg-transparent"
                                }`
                              }
                            >
                              {pos}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                </div>
              </div>

              <div>
                <label
                  className=" text-white uppercase ml-[0.5rem] flex"
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  Past Experiences (Optional)
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  style={{
                    boxShadow:
                      "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80",
                    fontFamily: "IBM Plex Mono",
                    fontWeight: 400,
                    wordWrap: "break-word",
                  }}
                  rows={3}
                  className="w-full pl-[1rem] border border-white/30 rounded-xl px-3 py-2 text-white "
                  placeholder="Mention past experiences if any"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between mt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex items-center bg-[#2B88A8] text-white text-sm px-4 py-2 rounded-md font-semibold text-[14px] cursor-pointer hover:opacity-90 w-fit">
                    <img
                      src={attachicon}
                      alt="PlusButton"
                      className="w-3 h-3 mr-2"
                    />
                    ATTACH RESUME
                  </div>

                  {resumeFile && (
                    <span className="text-white text-xs">
                      {resumeFile.name}
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={handleApply}
                  className="bg-[#2B88A8] text-white font-semibold px-6 py-2 rounded-md mt-4 sm:mt-0"
                >
                  APPLY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
