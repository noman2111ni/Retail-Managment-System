import React, { useEffect, useState } from "react";
import axios from "axios";

const AuditLogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 🔑 Token fetch from localStorage
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          "https://retailm.pythonanywhere.com/api/audit-logs/",
          {
            headers: {
              Authorization: `Bearer ${token}`, // 🔥 Token send in header
            },
          }
        );
        setLogs(res.data || []);
      } catch (err) {
        console.error("Error fetching logs:", err);
        setError("Failed to load audit logs (Unauthorized or Server Error)");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLogs();
    } else {
      setError("No access token found. Please log in.");
    }
  }, [token]);

  const filteredLogs = (Array.isArray(logs) ? logs : [])
    .filter(
      (log) =>
        (log.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
          log.action.toLowerCase().includes(search.toLowerCase()) ||
          log.model_name.toLowerCase().includes(search.toLowerCase())) &&
        (actionFilter ? log.action === actionFilter : true)
    )
    .sort((a, b) =>
      sortAsc
        ? new Date(a.timestamp) - new Date(b.timestamp)
        : new Date(b.timestamp) - new Date(a.timestamp)
    );

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Audit Logs
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Review all system actions performed by users.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by user, action, or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none flex-1 mb-2 sm:mb-0"
          />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none"
          >
            <option value="">All Actions</option>
            {uniqueActions.map((act) => (
              <option key={act} value={act}>
                {act.charAt(0).toUpperCase() + act.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition"
          >
            Sort: {sortAsc ? "Oldest → Newest" : "Newest → Oldest"}
          </button>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className=" text-gray-900 dark:text-gray-200">
              <tr className="text-sm uppercase tracking-wider">
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Action</th>
                <th className="px-6 py-3 text-left">Model</th>
                <th className="px-6 py-3 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading logs...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && paginatedLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                    No logs found.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                paginatedLogs.map((log, idx) => (
                  <tr
                    key={log.id}
                    className={`transition duration-200 ${
                      idx % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-700/50"
                        : "bg-white dark:bg-gray-800"
                    } hover:bg-yellow-100 dark:hover:bg-gray-600/30`}
                  >
                    <td className="px-6 py-4">{log.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">
                      {log.user_name || "Deleted User"}
                    </td>
                    <td className="px-6 py-4 capitalize">{log.action}</td>
                    <td className="px-6 py-4">{log.model_name}</td>
                    <td className="px-6 py-4">
                      {new Date(log.timestamp).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-700 dark:text-gray-300">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600 text-white"
            }`}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsTable;
