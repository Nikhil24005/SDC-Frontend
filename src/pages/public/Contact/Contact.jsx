import { FaInstagram, FaLinkedin } from "react-icons/fa";
import React, { useState, useRef, useEffect } from "react"; // Import React
import meshGradient from "../../../assets/images/mesh-gradient.webp";
import instagramIcon from "../../../assets/social/instagramIcon.svg";
import linkedinIcon from "../../../assets/social/linkedinIcon.svg";
import { postContact } from "../../../api/Public/postContact";
import { getFAQs } from "../../../api/Public/faq"; // ✅ public API

// --- Memoized Map Component ---
// This prevents the map from re-rendering and flickering on form submission.
const MemoizedMap = React.memo(() => {
  return (
    <div className="w-[320px] md:w-[586px] h-[260px] md:h-[474px] rounded-2xl overflow-hidden shadow-lg">
      <iframe
        title="Medi-Caps University Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.359124896248!2d75.8078493154157!3d22.63935263628287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fc1a8a555555%3A0x1bbafa70e3369137!2sMedi-Caps%20University!5e0!3m2!1sen!2sin!4v1678286915830!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
});

const Contact = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [openFaq, setOpenFaq] = useState(-1);
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState("");
  const queryRef = useRef(null);

  // Form state
  const [name, setName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Form submission state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // FAQ state
  const [faqs, setFaqs] = useState([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [faqsError, setFaqsError] = useState("");

  const queries = [
    "Application Development",
    "Software Development",
    "Website Development",
    "Join Our Team",
    "Other",
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (queryRef.current && !queryRef.current.contains(event.target)) {
        setIsQueryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch FAQs from backend
  useEffect(() => {
    const fetchFaqs = async () => {
      setFaqsLoading(true);
      setFaqsError("");
      try {
        const res = await getFAQs();
        const mappedFaqs = Array.isArray(res.data)
          ? res.data.map((faq) => ({
              question: faq.ques,
              answer: faq.ans,
              _id: faq._id,
            }))
          : [];
        setFaqs(mappedFaqs);
      } catch (err) {
        setFaqsError("Failed to load FAQs. Please try again later.");
      } finally {
        setFaqsLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  // --- Input Validation Handlers ---

  const handleNameChange = (e) => {
    const value = e.target.value;
    // Allow only letters and spaces
    if (/^[A-Za-z\s]*$/.test(value)) {
      setName(value);
      if (formErrors.name) setFormErrors({ ...formErrors, name: null });
    }
  };

  const handleContactChange = (e) => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setContactNo(value);
      if (formErrors.contactNo)
        setFormErrors({ ...formErrors, contactNo: null });
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (formErrors.email) setFormErrors({ ...formErrors, email: null });
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    const wordCount =
      value.trim() === "" ? 0 : value.trim().split(/\s+/).length;

    if (wordCount <= 500) {
      setMessage(value);
      if (formErrors.message) setFormErrors({ ...formErrors, message: null });
    } else {
      // Prevent typing more than 500 words by slicing the text
      const truncatedValue = value.split(/\s+/).slice(0, 500).join(" ");
      setMessage(truncatedValue);
    }
  };

  // --- Form Validation Logic ---
  const validateForm = () => {
    const errors = {};
    if (!/^[A-Za-z\s]+$/.test(name)) {
      errors.name = "Name must only contain letters.";
    }
    if (!/^\d{10}$/.test(contactNo)) {
      // Assuming a 10-digit number
      errors.contactNo = "Please enter a valid 10-digit number.";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!message.trim()) {
      errors.message = "Message cannot be empty.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous general errors

    if (!validateForm()) {
      setError("Please correct the errors before submitting.");
      return;
    }

    setLoading(true);
    setSuccess("");
    try {
      // This is the connection to your API endpoint. It's correctly implemented.
      await postContact({
        name,
        contactNo,
        query: selectedQuery,
        email,
        message,
      });
      setSuccess("Your message has been sent successfully!");
      // Clear form on success
      setName("");
      setContactNo("");
      setSelectedQuery("");
      setEmail("");
      setMessage("");
      setFormErrors({});
    } catch (err) {
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const wordCount =
    message.trim() === "" ? 0 : message.trim().split(/\s+/).length;

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-25"
      style={{
        backgroundImage: `url(${meshGradient})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Outer Glass Card */}
      <div className="relative w-full md:mt-12 rounded-3xl bg-white/2 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col items-center gap-12 px-4 py-10 md:px-16 md:py-16">
        {/* Outer Glass Overlay */}
        <div className="absolute inset-0 bg-white/5 rounded-3xl shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)] z-0" />

        <div className="relative z-10 flex flex-col items-center gap-3.5">
          <div className="inline-flex justify-center items-center gap-2.5">
            <div className="text-white text-[30px] md:text-[55px] -mt-5 font-bold font-inter leading-[48px] md:leading-[72px] text-center">
              Let's Build the Future, Together.
            </div>
          </div>
          <div className="inline-flex justify-center items-center gap-2.5">
            <div className="max-w-[758px] text-center text-[#D2D2D2] text-[14px] md:text-[20px] font-medium font-inter leading-8 md:leading-9">
              Have a vision? We're here to help you code it into reality. Reach
              out — innovation starts with a conversation.
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="w-full max-w-6xl -mt-6 md:mt-0 md:p-8 rounded-2xl bg-white/3 shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)]">
          {/* Desktop View - Original Layout */}
          <div className="hidden md:block">
            <div className="relative z-10 w-full flex flex-row justify-center items-center gap-10">
              {/* Contact */}
              <div className="w-40 min-w-[160px] flex-1 flex flex-col justify-center items-start gap-3">
                <div className="self-stretch p-0.5 flex items-center gap-2.5">
                  <div className="text-white text-2xl font-semibold font-inter leading-[32px]">
                    Contact
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="p-0.5 flex flex-col gap-1">
                    <div className="text-white text-base font-normal font-mono leading-6">
                      Phone No.
                    </div>
                    <div className="text-[#D2D2D2] text-sm font-normal font-mono leading-5">
                      +91-07313111500
                    </div>
                  </div>
                  <div className="self-stretch p-0.5 flex flex-col gap-1">
                    <div className="text-white text-base font-normal font-mono leading-6">
                      Email ID
                    </div>
                    <div className="text-[#D2D2D2] text-sm font-normal font-mono leading-5">
                      sdc@medicaps.ac.in
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-px h-30 bg-white opacity-50"></div>

              {/* Social Media */}
              <div className="w-40 min-w-[160px] flex-1 flex flex-col justify-center items-center gap-3">
                <div className="self-stretch p-0.5 flex items-center gap-2.5">
                  <div className="text-white text-2xl font-semibold font-inter leading-[32px]">
                    Social Media
                  </div>
                </div>
                <div className="self-stretch flex flex-col gap-2">
                  <a
                    href="https://instagram.com/medicaps_sdc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#AA1E6B] rounded-lg shadow-[0px_0px_25px_0px_rgba(142,45,226,0.25)] flex items-center gap-2 hover:bg-[#8a1456] transition-colors"
                  >
                    <img
                      src={instagramIcon}
                      alt="Instagram"
                      className="w-5 h-5 object-contain"
                    />
                    <span className="text-white text-xs font-semibold font-inter uppercase tracking-tight">
                      Instagram
                    </span>
                  </a>
                  <a
                    href="https://linkedin.com/company/sdc-medicapsuniversity"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#AA1E6B] rounded-lg shadow-[0px_0px_25px_0px_rgba(142,45,226,0.25)] flex items-center gap-2 hover:bg-[#8a1456] transition-colors"
                  >
                    <img
                      src={linkedinIcon}
                      alt="LinkedIn"
                      className="w-5 h-5 object-contain"
                    />
                    <span className="text-white text-xs font-semibold font-inter uppercase tracking-tight">
                      LinkedIn
                    </span>
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div className="w-px h-30 bg-white opacity-50"></div>

              {/* Operating Hour */}
              <div className="w-40 min-w-[160px] flex-1 flex flex-col justify-center items-start gap-3">
                <div className="self-stretch p-0.5 flex items-center gap-2.5">
                  <div className="text-white text-2xl -mt-6 font-semibold font-inter leading-[32px]">
                    Operating Hour
                  </div>
                </div>
                <div className="self-stretch p-0.5 flex flex-col gap-1">
                  <div className="text-white text-base font-normal font-mono leading-6">
                    Mon - Fri
                  </div>
                  <div className="text-[#D2D2D2] text-sm font-normal font-mono leading-5">
                    8:30 AM - 5:00 PM IST
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-px h-30 bg-white opacity-50"></div>

              {/* Office Address */}
              <div className="w-40 min-w-[160px] flex-1 flex flex-col justify-center items-start gap-3">
                <div className="self-stretch p-0.5 flex items-center gap-2.5">
                  <div className="text-white text-2xl -mt-6 font-semibold font-inter leading-[32px]">
                    Office Address
                  </div>
                </div>
                <div className="self-stretch p-0.5 flex items-center gap-2.5">
                  <div className="text-[#D2D2D2] text-sm font-normal font-mono leading-5">
                    A.B. Road Pigdamber, Rau, Indore,
                    <br />
                    Madhya Pradesh -453331
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View - Card Layout with Expanded Width */}
          <div className="block md:hidden rounded-2xl bg-white/3 p-4 shadow-[inset_0_0_14px_rgba(255,255,255,0.3),inset_-1px_-3px_2px_rgba(255,255,255,0.1),inset_1px_3px_2px_rgba(255,255,255,0.3)]">
            <div className="w-full">
              <div className="grid grid-cols-1 gap-10">
                {/* Top Row - Contact and Social Media */}
                <div className="grid grid-cols-2 gap-1 relative">
                  {/* Contact */}
                  <div className="flex flex-col gap-6">
                    <h3 className="text-white text-xl font-semibold font-inter">
                      Contact
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-white text-sm font-medium font-mono mb-2">
                          Phone No.
                        </div>
                        <div className="text-gray-200 text-xs font-mono leading-relaxed break-all">
                          +91-07313111500
                        </div>
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium font-mono mb-2">
                          Email ID
                        </div>
                        <div className="text-gray-200 text-xs font-mono leading-relaxed break-all">
                          sdc@medicaps.ac.in
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vertical divider between Contact and Social Media */}
                  <div className="absolute left-1/2 top-0 h-full w-px bg-white opacity-50 transform -translate-x-1/2"></div>

                  {/* Social Media */}
                  <div className="flex flex-col gap-6 pl-6">
                    <h3 className="text-white text-xl font-semibold font-inter text-center">
                      Social Media
                    </h3>
                    <div className="flex flex-col gap-3">
                      <a
                        href="https://instagram.com/medicaps_sdc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-[#AA1E6B] rounded-lg flex items-center gap-2 hover:bg-[#8a1456] transition-colors shadow-lg"
                      >
                        <img
                          src={instagramIcon}
                          alt="Instagram"
                          className="w-4 h-4 object-contain flex-shrink-0"
                        />
                        <span className="text-white text-xs font-semibold font-inter uppercase tracking-tight">
                          INSTAGRAM
                        </span>
                      </a>
                      <a
                        href="https://linkedin.com/company/sdc-medicapsuniversity"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-[#AA1E6B] rounded-lg flex items-center gap-2 hover:bg-[#8a1456] transition-colors shadow-lg"
                      >
                        <img
                          src={linkedinIcon}
                          alt="LinkedIn"
                          className="w-4 h-4 object-contain flex-shrink-0"
                        />
                        <span className="text-white text-xs font-semibold font-inter uppercase tracking-tight">
                          LINKEDIN
                        </span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Bottom Row - Operating Hours and Office Address */}
                <div className="grid grid-cols-2 gap-16 relative">
                  {/* Operating Hour */}
                  <div className="flex flex-col gap-6">
                    <h3 className="text-white text-xl font-semibold font-inter">
                      Operating Hour
                    </h3>
                    <div>
                      <div className="text-white text-sm font-medium font-mono mb-2">
                        Mon - Fri
                      </div>
                      <div className="text-gray-200 text-xs font-mono leading-relaxed">
                        • 8:30 AM - 5:00 PM IST
                      </div>
                    </div>
                  </div>

                  {/* Vertical divider between Operating Hours and Office Address */}
                  <div className="absolute left-1/2 top-0 h-full w-px bg-white opacity-50 transform -translate-x-1/2"></div>

                  {/* Office Address */}
                  <div className="flex flex-col gap-6">
                    <h3 className="text-white text-xl font-semibold font-inter">
                      Office Address
                    </h3>
                    <div className="text-gray-200 text-xs font-mono leading-relaxed">
                      A.B. Road Pigdamber,
                      <br />
                      Rau, Indore,
                      <br />
                      Madhya Pradesh
                      <br />
                      -453331
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> 
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="w-full max-w-[1440px] px-4 py-16 flex flex-col items-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-full">
          {/* Indore Map Image on the left */}
          <MemoizedMap />

          {/* Contact Form on the right */}
          <form
            className="w-full max-w-[586px] flex flex-col justify-between items-center gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="w-full flex flex-col gap-3.5">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white text-sm font-semibold font-inter uppercase tracking-wide">
                  Name
                </label>
                <div className="relative h-12 flex items-center rounded-[10px] shadow-[inset_2px_2px_6px_0px_rgba(255,255,255,0.50)] overflow-hidden px-4 py-3">
                  <div className="absolute w-[753.43px] h-24 left-[-83.71px] top-[-22.67px] bg-white/0" />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="relative z-10 bg-transparent outline-none border-none w-full text-base font-normal font-ibmplexmono text-[#D2D2D2] placeholder:text-[#D2D2D2]"
                    value={name}
                    onChange={handleNameChange}
                    required
                  />
                </div>
                {formErrors.name && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Contact & Query */}
              <div className="flex flex-col md:flex-row gap-2.5 w-full">
                {/* Contact */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-white text-sm font-semibold font-inter uppercase tracking-wide">
                    Contact
                  </label>
                  <div className="relative h-12 flex items-center rounded-[10px] shadow-[inset_2px_2px_6px_0px_rgba(255,255,255,0.50)] overflow-hidden px-4 py-3">
                    <div className="absolute w-96 h-24 left-[-41.14px] top-[-22.67px] bg-white/0" />
                    <input
                      type="tel"
                      placeholder="Enter phone no."
                      className="relative z-10 bg-transparent outline-none border-none w-full text-base font-normal font-ibmplexmono text-[#D2D2D2] placeholder:text-[#D2D2D2]"
                      value={contactNo}
                      onChange={handleContactChange}
                      required
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
                  {formErrors.contactNo && (
                    <p className="text-red-400 text-xs mt-1">
                      {formErrors.contactNo}
                    </p>
                  )}
                </div>

                {/* Query - Custom Dropdown */}
                <div
                  className="flex-1 flex flex-col gap-1.5 relative"
                  ref={queryRef}
                >
                  <label className="text-white text-sm font-semibold font-inter uppercase tracking-wide">
                    Query
                  </label>
                  <div
                    className="w-full px-4 py-3 relative rounded-[10px] shadow-[inset_2px_2px_6px_0px_rgba(255,255,255,0.50)] flex flex-col justify-center items-start gap-2.5 cursor-pointer h-12"
                    onClick={() => setIsQueryOpen(!isQueryOpen)}
                  >
                    {/* Selected or placeholder */}
                    <div className="relative z-10 w-full flex justify-between items-center">
                      <span className="text-white text-base font-normal font-ibmplexmono">
                        {selectedQuery || "Select query"}
                      </span>
                      <svg
                        className={`w-4 h-4 text-white transition-transform ${
                          isQueryOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {isQueryOpen && (
                    <div className="absolute z-30 w-full top-full mt-1 bg-[#1A1A1A] rounded-[10px] shadow-lg border border-[#333333] overflow-hidden">
                      {queries.map((query, index) => (
                        <div key={index}>
                          {index > 0 && (
                            <div className="h-px bg-[#333333]"></div>
                          )}
                          <div
                            className="w-full py-3 px-4 hover:bg-[#2A2A2A] transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedQuery(query);
                              setIsQueryOpen(false);
                            }}
                          >
                            <div className="text-white text-base font-normal font-ibmplexmono">
                              {query}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mail */}
              <div className="flex flex-col gap-1.5 mt-2.5">
                <label className="text-white text-sm font-semibold font-inter uppercase tracking-wide">
                  Mail
                </label>
                <div className="relative h-12 flex items-center rounded-[10px] shadow-[inset_2px_2px_6px_0px_rgba(255,255,255,0.50)] overflow-hidden px-4 py-3">
                  <div className="absolute w-[753.43px] h-24 left-[-83.71px] top-[-22.67px] bg-white/0" />
                  <input
                    type="email"
                    placeholder="Enter email id"
                    className="relative z-10 bg-transparent outline-none border-none w-full text-base font-normal font-ibmplexmono text-[#D2D2D2] placeholder:text-[#D2D2D2]"
                    value={email}
                    onChange={handleEmailChange}
                    required
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
                {formErrors.email && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-white text-sm font-semibold font-inter uppercase tracking-wide">
                  Message
                </label>
                <div className="relative flex-1 min-h-[96px] flex flex-col rounded-[10px] shadow-[inset_2px_2px_6px_0px_rgba(255,255,255,0.50)] overflow-hidden">
                  <div className="absolute w-[753.43px] h-60 left-[-83.71px] top-[-59.03px] bg-white/0" />
                  <textarea
                    placeholder="Describe your query"
                    className="relative z-10 bg-transparent outline-none border-none w-full flex-grow px-4 py-3 resize-none text-base font-normal font-ibmplexmono text-[#D2D2D2] placeholder:text-[#D2D2D2]"
                    value={message}
                    onChange={handleMessageChange}
                    required
                  />
                  <div className="relative z-10 text-right px-4 pb-2 text-xs font-ibmplexmono text-[#D2D2D2]">
                    {wordCount}/500 words
                  </div>
                </div>
                {formErrors.message && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.message}
                  </p>
                )}
              </div>
            </div>
            {/* Success/Error Messages */}
            {success && (
              <div className="w-full text-green-400 text-center font-semibold">
                {success}
              </div>
            )}
            {error && (
              <div className="w-full text-red-400 text-center font-semibold">
                {error}
              </div>
            )}
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-8 py-4 bg-pink-700 rounded-[10px] shadow-[0px_0px_25px_0px_rgba(142,45,226,0.25)] flex justify-center items-center gap-4 mt-2 disabled:opacity-60"
              disabled={loading}
            >
              <span className="text-white text-base font-semibold font-inter uppercase tracking-tight">
                {loading ? "Submitting..." : "Submit"}
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-[1440px] flex flex-col items-center mt-16">
        {/* FAQ Heading */}
        <div className="w-full flex flex-col items-center pb-8">
          <div className="text-white text-5xl font-semibold font-inter leading-[56px] mb-8">
            FAQ
          </div>
        </div>
        {/* FAQ Items */}
        <div className="w-full flex flex-col items-center pb-16">
          {faqsLoading ? (
            <div className="text-white text-lg">Loading FAQs...</div>
          ) : faqsError ? (
            <div className="text-red-400 text-lg">{faqsError}</div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-5">
                {faqs.map((faq, idx) => (
                  <div
                    key={faq._id || idx}
                    className={`w-[95vw] max-w-[952px] p-6 bg-white rounded-[10px] flex flex-col justify-center items-center gap-4 overflow-hidden transition-all duration-300 ${
                      openFaq === idx ? "" : ""
                    }`}
                    data-faq-number={`faq ${idx + 1}`}
                    data-state={openFaq === idx ? "open" : "closed"}
                  >
                    {/* Question + Toggle Button */}
                    <div className="self-stretch inline-flex justify-between items-center">
                      <div className="flex-1 text-black text-base font-normal font-ibmplexmono leading-normal">
                        {faq.question}
                      </div>
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                        className="w-6 h-6 flex items-center justify-center"
                        aria-label={openFaq === idx ? "Close" : "Open"}
                      >
                        <div
                          className={`w-6 h-6 transform transition-transform duration-300 ease-in-out ${
                            openFaq === idx ? "rotate-45" : "rotate-0"
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: `
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.8333 6.33333C13.6017 6.33333 11.7942 6.33333 9.66667 6.33333C9.66667 4.20583 9.66667 2.39833 9.66667 2.16667C9.66667 1.24583 8.92083 0.5 8 0.5C7.07917 0.5 6.33333 1.24583 6.33333 2.16667C6.33333 2.39833 6.33333 4.20583 6.33333 6.33333C4.20583 6.33333 2.39833 6.33333 2.16667 6.33333C1.24583 6.33333 0.5 7.07917 0.5 8C0.5 8.92083 1.24583 9.66667 2.16667 9.66667C2.23417 9.66667 4.1075 9.66667 6.33333 9.66667C6.33333 11.7942 6.33333 13.6017 6.33333 13.8333C6.33333 14.7542 7.07917 15.5 8 15.5C8.92083 15.5 9.66667 14.7542 9.66667 13.8333C9.66667 13.6017 9.66667 11.7942 9.66667 9.66667C11.8925 9.66667 13.7658 9.66667 13.8333 9.66667C14.7542 9.66667 15.5 8.92083 15.5 8C15.5 7.07917 14.7542 6.33333 13.8333 6.33333Z"
                                  fill="#000000" />
                              </svg>
                            `,
                          }}
                        />
                      </button>
                    </div>
                    {/* Answer */}
                    {openFaq === idx && faq.answer && (
                      <div className="self-stretch flex justify-start items-center gap-2.5">
                        <div className="flex-1 text-zinc-500 text-sm font-normal font-ibmplexmono leading-tight">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
