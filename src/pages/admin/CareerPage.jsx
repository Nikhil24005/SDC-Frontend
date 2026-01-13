import { useEffect, useState } from "react";
import {
  getAllApplications,
  deleteApplicationById,
} from "../../api/Admin/ApplicationForm.js";

import * as XLSX from "xlsx";
import ViewIcon from "../../assets/icons/resumeIcon.svg";
import DeleteIcon from "../../assets/icons/deleteIcon.svg";
import exported from "../../assets/images/exported.png";

export default function JoiningApplications() {
  const [applications, setApplications] = useState([]);

  // ✅ Added missing states
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await getAllApplications();
      console.log("Response from API:", res.data);

      const apps = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setApplications(apps);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteApplicationById(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error("Error deleting application:", err);
    }
  };

  useEffect(() => {
    const fetchQueries = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("🔍 Services page: About to fetch contacts");
        console.log("🍪 Available cookies:", document.cookie);

        const res = await getContact();
        let data = Array.isArray(res)
          ? res
          : Array.isArray(res.data)
          ? res.data
          : [];
        setQueries(data);
        console.log(
          "✅ Services page: Successfully fetched contacts, count:",
          data.length
        );
      } catch (err) {
        console.error("❌ Services page: Failed to fetch contacts:", err);

        if (err.response?.status === 403) {
          setError(
            "Authentication required. Please log in to access contact queries."
          );
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

  const paginatedQueries = queries.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(queries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Queries");
    XLSX.writeFile(workbook, "queries.xlsx");
  };

  return (
    <div className="w-full text-white p-4 sm:p-6 flex flex-col">
      <div className="bg-[#8E8E8E] text-white rounded-t-xl px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Joining Application Entries</h2>
        <div className="flex gap-2 items-center text-sm">
          <span>Page</span>
          <button className="px-3 py-2 bg-gray-200 text-black rounded-md text-xs font-medium">
            Apply Entries
          </button>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto bg-black scrollbar-hide"
        style={{
          maxHeight: "60vh",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

        {!Array.isArray(applications) || applications.length === 0 ? (
          <div className="px-6 py-6 text-gray-400">No applications found.</div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="bg-black border-t border-gray-700 px-6 py-6 flex flex-col sm:flex-row sm:justify-between gap-4"
            >
              <div className="flex-1 text-sm space-y-1">
                <p>
                  <strong className="text-gray-400">Name:</strong> {app.name}
                </p>
                <p>
                  <strong className="text-gray-400">Contact Number:</strong>{" "}
                  {app.contactNumber}
                </p>
                <p>
                  <strong className="text-gray-400">Email:</strong> {app.email}
                </p>
                <p>
                  <strong className="text-gray-400">Year:</strong> {app.year}
                </p>
                <p>
                  <strong className="text-gray-400">Branch:</strong>{" "}
                  {app.branch}
                </p>
                <p>
                  <strong className="text-gray-400">Enrollment Number:</strong>{" "}
                  {app.enrollmentNumber}
                </p>
                <p>
                  <strong className="text-gray-400">Position:</strong>{" "}
                  {app.position}
                </p>
                <p>
                  <strong className="text-gray-400">Past Experiences:</strong>{" "}
                  {app.pastExperience}
                </p>

                <div className="flex gap-3 mt-4">
                  <a
                    href={app.resume_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all"
                  >
                    <img src={ViewIcon} alt="View Resume" className="w-4 h-4" />
                    VIEW RESUME
                  </a>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="flex items-center gap-2 cursor-pointer bg-[#ACACAC40]/60 hover:bg-[#ACACAC40]/100 border-[#FFFFFF] text-white border px-4 py-2 rounded-lg text-sm"
                  >
                    <img src={DeleteIcon} alt="Delete" className="w-4 h-4" />
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="w-full bg-[#30303099] flex items-center justify-end px-[28px] py-[12px] rounded-b-xl mt-auto">
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-[8px] rounded-md px-4 py-2 bg-[#ACACAC40] border border-white backdrop-blur-[4px] shadow-[2px_4px_4px_0px_#00000040,inset_2px_2px_8px_0px_#FFFFFF40] cursor-pointer justify-center"
        >
          <img src={exported} alt="exported" className="w-6 h-6" />
          <span className="text-white font-semibold text-base leading-[24px] tracking-[0.02em] uppercase">
            EXPORT AS FILE
          </span>
        </button>
      </div>
    </div>
  );
}
