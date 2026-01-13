import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { getContact } from "../../api/Admin/Contact/getContact";
import exported from "../../assets/images/exported.png";

const ServicesPage = () => {
  const [page, setPage] = useState(1);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  const itemsPerPage = 3;

  useEffect(() => {
    const fetchQueries = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔍 Services page: About to fetch contacts');
        console.log('🍪 Available cookies:', document.cookie);
        
        const res = await getContact();
        let data = Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : [];
        setQueries(data);
        console.log('✅ Services page: Successfully fetched contacts, count:', data.length);
      } catch (err) {
        console.error('❌ Services page: Failed to fetch contacts:', err);
        
        if (err.response?.status === 403) {
          setError("Authentication required. Please log in to access contact queries.");
        } else {
          setError("Failed to load contact queries. Please try again.");
        }
        
        setQueries([]); // Set empty array only on error
      } finally {
        setLoading(false);
      }
    };
    fetchQueries();
  }, []);

  const paginatedQueries = queries.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(queries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Queries");
    XLSX.writeFile(workbook, "queries.xlsx");
  };

  return (
    <div className="w-[1136px] absolute top-[132px] left-[272px] opacity-100 rotate-0 overflow-hidden m-6">
      {/* Header */}
      <div className="w-full h-[60px] flex justify-between items-center px-[28px] py-[8px] bg-[#8E8E8E] rounded-t-2xl">
        <h2 className="text-[#333333] font-semibold font-sans text-lg">
          Contact Form Queries
        </h2>
        <div className="flex ml-auto space-x-4">
          {/* <input
            placeholder="Page"
            className="w-[48px] h-[32px] text-center rounded-sm px-1 py-1 text-base"
            value={page}
            onChange={(e) => setPage(Number(e.target.value) || 1)}
          />
          <input
            placeholder="Work"
            className="w-[59px] h-[32px] bg-[#D2D2D2] placeholder-black text-center rounded-sm px-2 py-1 text-base"
          /> */}
           <div className="flex gap-2 items-center text-sm">
          <span>Page</span>
          <button className="px-3 py-1 bg-gray-200 text-black rounded-md text-xs font-medium cursor-pointer">
            Query
          </button>
        </div>
        </div>
      </div>

      {/* Body */}
      <div className="w-full bg-[#141414] rounded-b-xl shadow-[2px_2px_6px_0px_#FFFFFF26] flex flex-col">
        <div
          ref={contentRef}
          className="pt-[32px] pb-[24px] flex-1 overflow-y-auto scroll-container"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#4a4a4a #1a1a1a",
            msOverflowStyle: "auto",
          }}
        >
          <style jsx="true" global="true">{`
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

          {loading ? (
            <p className="text-white text-center text-base py-10">Loading...</p>
          ) : error ? (
            <p className="text-red-400 text-center text-base py-10">{error}</p>
          ) : paginatedQueries.length > 0 ? (
            paginatedQueries.map((query, index) => (
              <div
                key={index}
                className={`w-full h-[268px] text-white flex justify-between items-start ${
                  index !== paginatedQueries.length - 1 ? "border-b border-white" : ""
                }`}
              >
                <div className="p-8 w-full">
                  <p className="text-base p-1">
                    <strong style={{ color: "#8E8E8E" }}>Date:</strong> {query.date}
                  </p>
                  <p className="text-base p-1">
                    <strong style={{ color: "#8E8E8E" }}>Name:</strong> {query.name}
                  </p>
                  <p className="text-base p-1">
                    <strong style={{ color: "#8E8E8E" }}>Email:</strong> {query.email}
                  </p>
                  <p className="text-base p-1">
                    <strong style={{ color: "#8E8E8E" }}>Contact:</strong> {query.contact}
                  </p>
                  <p className="text-base p-1">
                    <strong style={{ color: "#8E8E8E" }}>Query:</strong> {query.query}
                  </p>
                  <p className="text-base p-1">
                    <strong style={{ color: "#8E8E8E" }}>Message:</strong> {query.message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white text-center text-base py-10">No queries to display.</p>
          )}
        </div>

        {/* Footer */}
        <div className="w-full h-[80px] bg-[#30303099] flex items-center justify-between px-[28px] py-[12px] rounded-b-xl mt-auto">
          <button
            onClick={handleExportExcel}
            className="w-[190px] h-[45px] flex items-center gap-[8px] rounded-md px-4 py-2 bg-[#ACACAC40] border border-white backdrop-blur-[4px] shadow-[2px_4px_4px_0px_#00000040,inset_2px_2px_8px_0px_#FFFFFF40] cursor-pointer ml-220"
          >
            <img src={exported} alt="exported" className="w-6 h-6" />
            <span className="text-white font-semibold text-base leading-[24px] tracking-[0.02em] uppercase">
              EXPORT AS FILE
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
