// components/StockMovementsTable.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteStockMovement,
    fetchStockMovements,
} from "../../../store/slices/stockSlice";
import { Search } from "lucide-react";
import { RxCross1 } from "react-icons/rx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function StockMovementsTable() {
    const dispatch = useDispatch();
    const { movements } = useSelector((state) => state.stock);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("ALL");
    const [page, setPage] = useState(1);
    const perPage = 6; // items per page (cards)
    useEffect(() => {
        dispatch(fetchStockMovements());
    }, [dispatch]);

    // 🔹 Filtering + Search (safe null handling)
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

    // 🔹 Pagination
    const totalPages = Math.ceil(filteredData.length / perPage);
    const paginatedData = filteredData.slice(
        (page - 1) * perPage,
        page * perPage
    );

    // 🔹 Delete with refresh
    const deleteHandle = async (id) => {
        await dispatch(deleteStockMovement(id));
        dispatch(fetchStockMovements());
    };

    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="p-4 md:p-6 lg:p-8">
                <h2
                    className="text-xl md:text-2xl font-bold mb-6 
          bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 
          bg-clip-text text-transparent"
                >
                    📦 Stock Movements
                </h2>

                {/* 🔹 Search & Filters */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
                    <div className="relative w-full md:w-1/3">
                        <Search
                            className="absolute left-2 top-2.5 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search by product, branch, or reason..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 w-full border rounded-lg px-3 py-2 
                dark:bg-gray-800 dark:border-gray-700 
                dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="border rounded-lg px-3 py-2 
              dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 
              focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ALL">All</option>
                        <option value="IN">IN</option>
                        <option value="OUT">OUT</option>
                    </select>
                </div>

                {/* 🔹 Card View */}
                {paginatedData.length === 0 ? (
                    <p className="text-center py-6 text-gray-500 dark:text-gray-400">
                        No stock movement found
                    </p>
                ) : (
                    <div className=" grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                        {paginatedData.map((mov) => {
                            const dateValue = mov.created_at || mov.timestamp || null;
                            return (
                                <div
                                    key={mov.id}
                                    className="p-4 border rounded-xl shadow-sm 
                  dark:border-gray-700 dark:bg-gray-800 
                  hover:shadow-md transition"
                                >
                                    <div className="flex justify-between items-center mb-2 relative">
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 capitalize">
                                            {mov.product_name || mov.product || "Unnamed"}
                                        </h3>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => deleteHandle(mov.id)}
                                                        className="absolute top-2 right-3 p-1 rounded-full 
                   hover:bg-red-50 dark:hover:bg-red-900/20 
                   text-gray-500 dark:text-gray-400 
                   hover:text-red-600 transition"
                                                    >
                                                        <RxCross1 className="w-4 h-4" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="left" className="bg-red-600 text-white text-sm px-3 py-1 rounded-md shadow-md">
                                                    Delete Stock
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <strong>Branch:</strong>{" "}
                                        {mov.branch_name || mov.branch || "-"}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <strong>Quantity:</strong> {mov.quantity || 0}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <strong>Created bt:</strong> {mov.
                                            created_by_name
                                            || "-"}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <strong>Product_name:</strong> {mov.product_name || "System"}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <strong>Reference:</strong> {mov.reference || "System"}
                                    </p>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            {dateValue
                                                ? new Date(dateValue).toLocaleString()
                                                : "N/A"}
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

                {/* 🔹 Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex flex-wrap justify-center items-center mt-6 gap-2 text-sm md:text-base">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50 
                dark:border-gray-700 dark:text-gray-200"
                        >
                            Prev
                        </button>
                        <span className="text-gray-700 dark:text-gray-300">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50 
                dark:border-gray-700 dark:text-gray-200"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
