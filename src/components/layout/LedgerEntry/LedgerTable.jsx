import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteLedgerEntry, fetchLedger } from "../../../../store/slices/ledgerSlice";
import { Input } from "@/components/ui/input";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const LedgerTable = () => {
  const dispatch = useDispatch();
  const { entries } = useSelector((state) => state.ledger);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(fetchLedger());
  }, [dispatch]);

  // Filter entries
  let filteredEntries = entries.filter(
    (entry) =>
      entry.description?.toLowerCase().includes(search.toLowerCase()) ||
      entry.reference?.toLowerCase().includes(search.toLowerCase())
  );

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

  const totalPages = Math.ceil(filteredEntries.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentEntries = filteredEntries.slice(startIdx, startIdx + rowsPerPage);

  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(deleteLedgerEntry(deleteId));
      toast.success("Entry deleted successfully");
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      {/* Heading */}
      <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
        Ledger Entries
      </h2>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <Input
          placeholder="Search description, reference..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:max-w-md"
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

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Transaction</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Amount</th>
              <th className="px-4 py-3 text-left">Reference</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((entry, idx) => (
              <tr
                key={entry.id}
                className={`transition-all ${
                  idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                } hover:bg-amber-50 dark:hover:bg-amber-900`}
              >
                <td className="px-4 py-2 whitespace-nowrap">{new Date(entry.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 truncate max-w-[200px]">{entry.description}</td>
                <td className="px-4 py-2 capitalize font-medium">{entry.transaction_type}</td>
                <td className="px-4 py-2 text-right font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
                  Rs. {entry.amount}
                </td>
                <td className="px-4 py-2 truncate max-w-[160px]">{entry.reference}</td>
                <td className="px-4 py-2">{entry.created_by}</td>
                <td className="px-4 py-2 text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <MdDeleteForever
                              size={22}
                              className="text-red-500 hover:text-red-700 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(entry.id);
                              }}
                            />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this ledger entry? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-600 text-white" onClick={handleConfirmDelete}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-red-600 text-white text-sm px-3 py-1 rounded-md shadow-md">
                        Delete Entry
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-3">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="p-2 rounded-xl text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600 shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
        >
          <IoIosArrowBack />
        </button>
        <span className="px-3 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))}
          className="p-2 rounded-xl text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600 shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default LedgerTable;
