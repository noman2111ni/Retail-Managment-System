import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteLedgerEntry, fetchLedger } from "../../../../store/slices/ledgerSlice";
import { Input } from "@/components/ui/input";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Delete } from "lucide-react";
import { TiDeleteOutline } from "react-icons/ti";
import { MdDeleteForever } from "react-icons/md";


const LedgerTable = () => {
  const dispatch = useDispatch();
  const { entries } = useSelector((state) => state.ledger);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all"); // all | sale | purchase
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(fetchLedger());
  }, [dispatch]);


  // 🔎 Apply Search
  let filteredEntries = entries.filter(
    (entry) =>
      entry.description?.toLowerCase().includes(search.toLowerCase()) ||
      entry.reference?.toLowerCase().includes(search.toLowerCase())
  );

  // 📌 Apply Sale / Purchase Filter
  if (filterType === "sale") {
    filteredEntries = filteredEntries.filter(
      (entry) =>
        entry.transaction_type?.toLowerCase() === "sal" ||
        entry.reference?.toLowerCase().includes("sal")
    );
  } else if (filterType === "purchase") {
    filteredEntries = filteredEntries.filter(
      (entry) =>
        entry.transaction_type?.toLowerCase() === "pur" ||
        entry.reference?.toLowerCase().includes("pur")
    );
  }

  // 📄 Pagination
  const totalPages = Math.ceil(filteredEntries.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentEntries = filteredEntries.slice(
    startIdx,
    startIdx + rowsPerPage
  );
  const handleDelete = (id) => {
    try {
      dispatch(deleteLedgerEntry(id));

    } catch (error) {
      console.error("Failed to delete entry:", error);
    }

  }
  return (
    <div className="p-4 dark:bg-gray-900">
      {/* Heading */}
      <h2
        className="text-3xl font-extrabold mb-4   
          bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 
          bg-clip-text text-transparent font-sans tracking-wide"
      >
        Ledger Entries
      </h2>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <Input
          placeholder="Search by description, reference..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-md w-full"
        />

        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
        >
          <option value="all">All</option>
          <option value="sale">Sale</option>
          <option value="purchase">Purchase</option>
        </select>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full border-collapse   md:text-base">
          <thead className=" dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm">
            <tr>
              <th className="border px-4 py-3 text-left ">Date</th>
              <th className="border px-4 py-3 text-left">Description</th>
              <th className="border px-4 py-3 text-left whitespace-nowrap">Transaction</th>
              <th className="border px-4 py-3 text-right whitespace-nowrap">Amount</th>
              <th className="border px-4 py-3 text-left">Reference</th>
              <th className="border px-4 py-3 text-left">Created</th>
              <th className="border px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300">
            {currentEntries.map((entry, idx) => (
              <tr
                key={entry.id}
                className={` ${idx % 2 === 0
                  ? "bg-gray-50 dark:bg-gray-900"
                  : "bg-white dark:bg-gray-800"
                  } hover:bg-amber-50 dark:hover:bg-amber-900`}
              >
                <td className="border px-4 py-2 whitespace-nowrap">
                  {new Date(entry.date).toLocaleDateString("en-PK", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="border px-4 py-2 truncate max-w-[200px]">
                  {entry.description}
                </td>
                <td className="border px-4 py-2 capitalize whitespace-nowrap font-medium">
                  {entry.transaction_type}
                </td>
                <td className="border px-4 py-2 text-right font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
                  Rs. {entry.amount}
                </td>
                <td className="border px-4 py-2 truncate max-w-[160px]">{entry.reference}</td>
                <td className="border px-4 py-2">{entry.created_by}</td>
                <td className="border px-4 py-2">
                  <MdDeleteForever
                    size={20}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    title="Delete Entry"
                    onClick={() => handleDelete(entry.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
        <div className="flex items-center justify-end w-full gap-3">
          {/* Prev Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="p-2 rounded-xl text-white 
                 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 
                 hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600
                 shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
          >
            <IoIosArrowBack />
          </button>

          {/* Page Info */}
          <span className="px-3 py-2 text-sm font-medium rounded-lg 
                     bg-white dark:bg-gray-800 shadow-sm
                     text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
            Page {currentPage} of {totalPages || 1}
          </span>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))}
            className="p-2 rounded-xl text-white 
                 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 
                 hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600
                 shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>

    </div>
  );
};

export default LedgerTable;
