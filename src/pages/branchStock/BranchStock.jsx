// components/StockMovementsTable.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteStockMovement,
    fetchStockMovements,
} from "../../../store/slices/stockSlice";
import { Search } from "lucide-react";
import { MdDeleteForever } from "react-icons/md";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { toast } from "react-toastify";

export default function StockMovementsTable() {
    const dispatch = useDispatch();
    const { movements } = useSelector((state) => state.stock);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("ALL");
    const [page, setPage] = useState(1);
    const [selectedMovements, setSelectedMovements] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [bulkDelete, setBulkDelete] = useState(false);
    const perPage = 6;

    useEffect(() => {
        dispatch(fetchStockMovements());
    }, [dispatch]);

    // Filter + Search
    const filteredData = movements.filter((mov) => {
        const product = mov.product_name || mov.product || "";
        const branch = mov.branch_name || mov.branch || "";
        const reason = mov.reason || "";
        const matchSearch =
            product.toLowerCase().includes(search.toLowerCase()) ||
            branch.toLowerCase().includes(search.toLowerCase()) ||
            reason.toLowerCase().includes(search.toLowerCase());
        const matchType =
            filterType === "ALL" ||
            (mov.movement_type &&
                mov.movement_type.toUpperCase() === filterType);
        return matchSearch && matchType;
    });

    const totalPages = Math.ceil(filteredData.length / perPage);
    const paginatedData = filteredData.slice(
        (page - 1) * perPage,
        page * perPage
    );

    // Checkbox handlers
    const toggleSelect = (id) => {
        setSelectedMovements((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedMovements.length === paginatedData.length) {
            setSelectedMovements([]);
        } else {
            setSelectedMovements(paginatedData.map((mov) => mov.id));
        }
    };

    // Individual delete
    const confirmDelete = async () => {
        if (deleteTarget) {
            await dispatch(deleteStockMovement(deleteTarget));
            toast.success("Stock record deleted");
            dispatch(fetchStockMovements());
            setDeleteTarget(null);
        }
    };

    // Bulk delete
    const confirmBulkDelete = async () => {
        for (let id of selectedMovements) {
            await dispatch(deleteStockMovement(id));
            toast.success("Selected stock records deleted");
        }
        dispatch(fetchStockMovements());
        setSelectedMovements([]);
        setBulkDelete(false);
    };

    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="p-4 md:p-6 lg:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                    📦 Stock Movements
                </h2>

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
                    <div className="relative w-full md:w-1/3">
                        <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by product, branch, or reason..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ALL">All</option>
                        <option value="IN">IN</option>
                        <option value="OUT">OUT</option>
                    </select>
                </div>

                {/* Bulk Delete Button */}
                {selectedMovements.length > 0 && (
                    <AlertDialog open={bulkDelete} onOpenChange={setBulkDelete}>
                        <AlertDialogTrigger asChild>
                            <button
                                onClick={() => setBulkDelete(true)}
                                className="mb-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                                Delete Selected ({selectedMovements.length})
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Delete {selectedMovements.length} selected records?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setBulkDelete(false)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmBulkDelete} className="bg-red-600 text-white hover:bg-red-700">
                                    Confirm Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

                {/* Card View */}
                {paginatedData.length === 0 ? (
                    <p className="text-center py-6 text-gray-500 dark:text-gray-400">
                        No stock movement found
                    </p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                        {paginatedData.map((mov) => {
                            const dateValue = mov.created_at || mov.timestamp || null;
                            const isSelected = selectedMovements.includes(mov.id);

                            return (
                                <div
                                    key={mov.id}
                                    className={`p-4 border rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-800 hover:shadow-md transition ${isSelected ? "bg-amber-100 dark:bg-amber-900" : ""}`}
                                >
                                    <div className="flex justify-between items-center mb-2 relative">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelect(mov.id)}
                                            />
                                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 capitalize">
                                                {mov.product_name || mov.product || "Unnamed"}
                                            </h3>
                                        </div>

                                        {/* Tooltip + Individual AlertDialog */}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button
                                                                onClick={() => setDeleteTarget(mov.id)}
                                                                className="p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-600 transition"
                                                            >
                                                                <MdDeleteForever className="w-4 h-4" />
                                                            </button>
                                                        </AlertDialogTrigger>

                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Delete this stock record?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel onClick={() => setDeleteTarget(null)}>
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-red-600 text-white hover:bg-red-700"
                                                                    onClick={confirmDelete}
                                                                >
                                                                    Confirm Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TooltipTrigger>
                                                <TooltipContent side="left" className="bg-red-600 text-white text-sm px-3 py-1 rounded-md shadow-md">
                                                    Delete Stock
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <strong>Branch:</strong> {mov.branch_name || mov.branch || "-"}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <strong>Quantity:</strong> {mov.quantity || 0}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <strong>Created by:</strong> {mov.created_by_name || "-"}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <strong>Product name:</strong> {mov.product_name || "System"}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <strong>Reference:</strong> {mov.reference || "System"}
                                    </p>

                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            {dateValue ? new Date(dateValue).toLocaleString() : "N/A"}
                                        </p>
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-bold ${mov.movement_type?.toUpperCase() === "IN"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                                }`}
                                        >
                                            {mov.movement_type?.toUpperCase() || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex flex-wrap justify-center items-center mt-6 gap-2 text-sm md:text-base">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-700 dark:text-gray-200"
                        >
                            Prev
                        </button>
                        <span className="text-gray-700 dark:text-gray-300">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-700 dark:text-gray-200"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
