import React, { useState } from "react";
import { Listbox } from "@headlessui/react";
import cross from "../assets/icons/cross.svg";
import attachicon from "../assets/icons/attachicon.png";
import { postApplication } from "../api/Public/postApplication";

const branches = ["CSE", "CS-AI", "CS-DS", "IT"];
const years = ["1st", "2nd", "3rd", "4th"];
const positions = [
  "Frontend Developer",
  "Backend Developer",
  "UI Designer",
  "Social Media Manager",
];

const ApplicationFormNew = ({ onSuccess, onClose }) => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    email: "",
    year: "",
    branch: "",
    enrollmentNumber: "",
    position: "",
    pastExperience: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState({});

  // Enhanced input handling with stricter constraints
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Name: Only letters and spaces, no numbers or special characters
    if (name === "name") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        return; // Reject invalid characters
      }
      // Limit to reasonable length
      if (value.length > 50) {
        return;
      }
    }

    // Contact Number: Only digits, exactly 10 digits, must start with 6-9
    if (name === "contactNumber") {
      processedValue = value.replace(/[^0-9]/g, ""); // Remove non-digits
      if (processedValue.length > 10) {
        processedValue = processedValue.slice(0, 10);
      }
    }

    // Email: Basic format validation
    if (name === "email") {
      // Allow typing but validate format later
      if (value.length > 100) {
        return;
      }
    }

    // Enrollment Number: Alphanumeric, uppercase
    if (name === "enrollmentNumber") {
      processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (processedValue.length > 15) {
        processedValue = processedValue.slice(0, 15);
      }
    }

    // Past Experience: Word limit of 300 words
    if (name === "pastExperience") {
      const words = value.trim() === '' ? [] : value.trim().split(/\s+/);
      if (words.length > 300) {
        processedValue = words.slice(0, 300).join(" ");
      }
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Enhanced file validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const fiveMB = 5 * 1024 * 1024;

    if (selectedFile) {
      // Check file type
      if (selectedFile.type !== "application/pdf") {
        setErrors((prev) => ({ ...prev, file: "Only PDF files are allowed" }));
        setFile(null);
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Check file size
      if (selectedFile.size > fiveMB) {
        setErrors((prev) => ({ ...prev, file: "File size must be less than 5MB" }));
        setFile(null);
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Check if file is not corrupted (basic check)
      if (selectedFile.size === 0) {
        setErrors((prev) => ({ ...prev, file: "File appears to be empty or corrupted" }));
        setFile(null);
        e.target.value = ''; // Clear the input
        return;
      }

      setFile(selectedFile);
      setErrors((prev) => ({ ...prev, file: null }));
    }
  };

  // Comprehensive validation function
  const validate = () => {
    const newErrors = {};
    
    // Name validation (MANDATORY)
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name must contain only letters and spaces";
    }
    
    // Contact Number validation (MANDATORY)
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Enter a valid 10-digit mobile number starting with 6-9";
    }

    // Email validation (MANDATORY)
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@medicaps\.ac\.in$/.test(formData.email.trim())) {
      newErrors.email = "Email must be a valid @medicaps.ac.in address";
    }

    // Year validation (MANDATORY)
    if (!formData.year || !selectedYear) {
      newErrors.year = "Please select your year";
    }
    
    // Branch validation (MANDATORY)
    if (!formData.branch || !selectedBranch) {
      newErrors.branch = "Please select your branch";
    }
    
    // Position validation (MANDATORY)
    if (!formData.position || !selectedPosition) {
      newErrors.position = "Please select a position to apply for";
    }
    
    // Enrollment Number validation (MANDATORY)
    if (!formData.enrollmentNumber || !formData.enrollmentNumber.trim()) {
      newErrors.enrollmentNumber = "Enrollment number is required";
    } else if (!/^[A-Z0-9]{8,15}$/.test(formData.enrollmentNumber)) {
      newErrors.enrollmentNumber = "Enter a valid enrollment number (8-15 alphanumeric characters)";
    }

    // File validation (MANDATORY)
    if (!file) {
      newErrors.file = "Resume (PDF) is required";
    }
    
    // Past Experience is optional, so no validation needed
    
    return newErrors;
  };

  // Enhanced submit handler
  const handleApply = async () => {
    // Clear previous feedback and errors
    setFeedback("");
    setErrors({});

    // Step 1: Validate all mandatory fields
    const validationErrors = validate();

    // Step 2: If any validation errors exist, stop processing
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFeedback("Please fill the form properly. All fields marked with * are mandatory.");
      
      // Scroll to first error (optional UX improvement)
      const firstErrorField = Object.keys(validationErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"], [data-field="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return; // STOP - Do not process the request
    }

    // Step 3: All validations passed, proceed with submission
    setLoading(true);
    
    try {
      // Prepare form data for submission
      const form = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value.toString().trim());
      });
      
      // Add file
      if (file) {
        form.append("file", file);
      }

      // Submit the application
      await postApplication(form);
      
      // Success feedback
      setFeedback("Application submitted successfully!");
      
      // Reset form
      setFormData({
        name: "",
        contactNumber: "",
        email: "",
        year: "",
        branch: "",
        enrollmentNumber: "",
        position: "",
        pastExperience: "",
      });
      setFile(null);
      setSelectedBranch("");
      setSelectedYear("");
      setSelectedPosition("");
      
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Application submission failed:", error);
      setFeedback("An error occurred while submitting your application. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate word count for past experience
  const wordCount = formData.pastExperience.trim() === '' ? 0 : formData.pastExperience.trim().split(/\s+/).length;

  return (
    <div className=" bg-black/10 p-6 rounded-xl w-[95%] max-w-4xl relative">
      <h1 className="font-sans font-medium text-[18px] leading-[1.5] tracking-normal text-center justify-center w-full h-[36px] text-3xl opacity-100 text-white ">
        Application Form
      </h1>
      {onClose && (
        <button onClick={onClose} className="absolute top-3 right-4 text-white text-xl">
          <img src={cross} alt="close" className="mt-[0.4rem] h-[20px] w-[20px]" />
        </button>
      )}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="text-left">
          {/* Name Field */}
          <div className="mt-[2rem]">
            <label className="text-14 text-white uppercase ml-[0.5rem] " style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 14 }}>
              Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full pl-[1rem] bg-transparent border ${errors.name ? 'border-red-500' : 'border-white/30'} rounded-xl px-3 py-2 text-white`}
              placeholder="Enter your Full name"
              maxLength="50"
              style={{ boxShadow: "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80", fontFamily: "IBM Plex Mono", fontWeight: 400 }}
            />
            {errors.name && <div className="text-red-400 text-xs ml-2 mt-1">{errors.name}</div>}
          </div>

          {/* Contact Number and Email Row */}
          <div className="flex flex-col md:flex-row mt-[0.5rem] gap-5">
            <div className="flex-1">
              <label className=" text-white uppercase ml-[0.5rem]" style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 14 }}>
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                name="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={handleChange}
                className={`w-full pl-[1rem] bg-transparent border ${errors.contactNumber ? 'border-red-500' : 'border-white/30'} rounded-xl px-3 py-2 text-white`}
                placeholder="Enter your Contact no."
                maxLength="10"
                style={{ boxShadow: "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80", fontFamily: "IBM Plex Mono", fontWeight: 400 }}
              />
              {errors.contactNumber && <div className="text-red-400 text-xs ml-2 mt-1">{errors.contactNumber}</div>}
            </div>
            <div className="flex-1">
              <label className=" text-white uppercase ml-[0.5rem]" style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 14 }}>
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-[1rem] bg-transparent border ${errors.email ? 'border-red-500' : 'border-white/30'} rounded-xl px-3 py-2 text-white`}
                placeholder="Enter your Email ID"
                style={{ boxShadow: "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80", fontFamily: "IBM Plex Mono", fontWeight: 400 }}
              />
              {errors.email && <div className="text-red-400 text-xs ml-2 mt-1">{errors.email}</div>}
            </div>
          </div>

          {/* Year and Branch Row */}
          <div className="flex flex-col md:flex-row mt-[0.5rem] gap-5">
            <div className="flex-1" data-field="year">
              <label className=" text-white uppercase ml-[0.5rem] " style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 14 }}>
                Year <span className="text-red-500">*</span>
              </label>
              <Listbox value={selectedYear} onChange={(val) => { 
                setSelectedYear(val); 
                setFormData((prev) => ({ ...prev, year: val })); 
                if(errors.year) setErrors(p => ({...p, year: null})); 
              }}>
                <div className="relative mt-1">
                  <Listbox.Button className={`relative w-full cursor-pointer rounded-xl bg-transparent border ${errors.year ? 'border-red-500' : 'border-white/30'} text-left px-4 py-2 text-white shadow-lg backdrop-blur-sm h-[40px]`} style={{ boxShadow: "2px 2px 4px #00000040, inset 2px 2px 6px #FFFFFF80", fontFamily: "IBM Plex Mono" }}>
                    {selectedYear ? selectedYear : <span className="text-white opacity-50">Select your Year</span>}
                  </Listbox.Button>
                  <Listbox.Options style={{ boxShadow: "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80" }} className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-black/50 text-white shadow-lg backdrop-blur-sm border border-white/30">
                    {years.map((year, idx) => (
                      <Listbox.Option key={idx} value={year} className={({ active }) => `cursor-pointer px-4 py-2 ${active ? "bg-white/20" : "bg-transparent"}`}>
                        {year}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              {errors.year && <div className="text-red-400 text-xs ml-2 mt-1">{errors.year}</div>}
            </div>
            <div className="flex-1" data-field="branch">
              <label className="text-xs text-white uppercase ml-[0.5rem]" style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 14 }}>
                Branch <span className="text-red-500">*</span>
              </label>
              <Listbox value={selectedBranch} onChange={(val) => { 
                setSelectedBranch(val); 
                setFormData((prev) => ({ ...prev, branch: val })); 
                if(errors.branch) setErrors(p => ({...p, branch: null})); 
              }}>
                <div className="relative mt-1">
                  <Listbox.Button className={`relative w-full cursor-pointer rounded-xl bg-transparent border ${errors.branch ? 'border-red-500' : 'border-white/30'} text-left px-4 py-2 text-white shadow-lg backdrop-blur-sm h-[40px]`} style={{ boxShadow: "2px 2px 4px #00000040, inset 2px 2px 6px #ffffff80", fontFamily: "IBM Plex Mono" }}>
                    {selectedBranch ? selectedBranch : <span className="text-white opacity-50">Select your Branch</span>}
                  </Listbox.Button>
                  <Listbox.Options style={{ boxShadow: "2px 2px 4px 0px #00000040, inset 2px 2px 6px #ffffff80" }} className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-black/10 text-white shadow-lg backdrop-blur border border-white/30">
                    {branches.map((branch, idx) => (
                      <Listbox.Option key={idx} value={branch} className={({ active }) => `cursor-pointer px-4 py-2 ${active ? "bg-white/20 " : "bg-transparent "}`}>
                        {branch}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              {errors.branch && <div className="text-red-400 text-xs ml-2 mt-1">{errors.branch}</div>}
            </div>
          </div>

          {/* Enrollment Number and Position Row */}
          <div className="flex flex-col md:flex-row mt-[0.5rem] gap-5">
            <div className="flex-1">
              <label className="text-xs text-white uppercase ml-[0.5rem]" style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 14 }}>
                Enrollment Number <span className="text-red-500">*</span>
              </label>
              <input
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleChange}
                maxLength="15"
                className={`w-full h-[40px] pl-[1rem] bg-transparent border ${errors.enrollmentNumber ? 'border-red-500' : 'border-white/30'} rounded-xl px-3 py-2 text-white`}
                placeholder="Enter your Enrollment no."
                style={{ boxShadow: "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80", fontFamily: "IBM Plex Mono", fontWeight: 400 }}
              />
              {errors.enrollmentNumber && <div className="text-red-400 text-xs ml-2 mt-1">{errors.enrollmentNumber}</div>}
            </div>
            <div className="flex-1" data-field="position">
              <label className="text-xs text-white uppercase ml-[0.5rem]" style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 14 }}>
                Position <span className="text-red-500">*</span>
              </label>
              <Listbox value={selectedPosition} onChange={(val) => { 
                setSelectedPosition(val); 
                setFormData((prev) => ({ ...prev, position: val })); 
                if(errors.position) setErrors(p => ({...p, position: null})); 
              }}>
                <div className="relative mt-1">
                  <Listbox.Button className={`relative w-full cursor-pointer rounded-xl bg-transparent border ${errors.position ? 'border-red-500' : 'border-white/30'} text-left px-4 py-2 text-white shadow-lg backdrop-blur-sm h-[40px]`} style={{ boxShadow: "2px 2px 4px #00000040, inset 2px 2px 6px #FFFFFF80", fontFamily: "IBM Plex Mono" }}>
                    {selectedPosition ? selectedPosition : <span className="text-white opacity-50">Select Position to Apply</span>}
                  </Listbox.Button>
                  <Listbox.Options style={{ boxShadow: "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80" }} className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-black/10 text-white shadow-lg backdrop-blur-sm border border-white/30">
                    {positions.map((pos, idx) => (
                      <Listbox.Option key={idx} value={pos} className={({ active }) => `cursor-pointer px-4 py-2 ${active ? "bg-white/20" : "bg-transparent"}`}>
                        {pos}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              {errors.position && <div className="text-red-400 text-xs ml-2 mt-1">{errors.position}</div>}
            </div>
          </div>
        </div>

        {/* Past Experience (Optional) */}
        <div>
          <label className=" text-white uppercase ml-[0.5rem] flex" style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 14 }}>
            Past Experiences (Optional)
          </label>
          <textarea
            name="pastExperience"
            value={formData.pastExperience}
            onChange={handleChange}
            rows={3}
            className="w-full pl-[1rem] border border-white/30 rounded-xl px-3 py-2 text-white "
            placeholder="Mention past experiences if any"
            style={{ boxShadow: "2px 2px 4px 0px #00000040, inset 2px 2px 6px 0px #FFFFFF80", fontFamily: "IBM Plex Mono", fontWeight: 400 }}
          />
          <div className="text-right text-xs text-gray-300 pr-2">{wordCount}/300 words</div>
        </div>

        {/* File Upload and Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6">
          <div data-field="file">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf"
                aria-label="Upload Resume"
              />
              <div className={`flex items-center bg-[#2B88A8] text-white text-sm px-4 py-2 rounded-md font-semibold text-[14px] cursor-pointer hover:opacity-90 w-fit ${errors.file ? 'ring-2 ring-red-500' : ''}`}>
                <img src={attachicon} alt="PlusButton" className="w-3 h-3 mr-2" />
                ATTACH RESUME <span className="text-red-500 ml-1">*</span>
              </div>
              {file && <span className="text-white text-xs ml-2">{file.name}</span>}
            </label>
            {errors.file && <div className="text-red-400 text-xs ml-2 mt-1">{errors.file}</div>}
          </div>
          <button 
            type="button" 
            onClick={handleApply} 
            className="bg-[#2B88A8] text-white font-semibold px-6 py-2 rounded-md mt-4 sm:mt-0 flex items-center justify-center min-w-[100px] hover:bg-[#236f8a] disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V4a8 8 0 00-8 8h0z"></path>
              </svg>
            ) : null}
            {loading ? 'APPLYING...' : 'APPLY'}
          </button>
        </div>

        {/* Feedback Display */}
        {feedback && (
          <div className={`mt-4 text-center font-semibold p-3 rounded-md ${
            feedback.includes('success') || feedback.includes('submitted') 
              ? 'text-green-400 bg-green-400/10 border border-green-400/20' 
              : 'text-red-400 bg-red-400/10 border border-red-400/20'
          }`}>
            {feedback}
          </div>
        )}
      </form>
    </div>
  );
};

export default ApplicationFormNew;