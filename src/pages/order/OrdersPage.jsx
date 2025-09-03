import { useState } from "react";
import { Eye, Printer, Trash2, Search, Filter, ChevronDown, MoreVertical, Download, Plus } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export default function OrdersPage() {
    const [statusFilter, setStatusFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    const orders = [
        {
            id: "ORD-001",
            customer: "Walk-in Customer",
            date: "2025-08-23",
            time: "03:45 PM",
            status: "Paid",
            payment: "Cash",
            total: 1550,
            items: 5,
        },
        {
            id: "ORD-002",
            customer: "Ali Khan",
            date: "2025-08-23",
            time: "02:15 PM",
            status: "Pending",
            payment: "Card",
            total: 780,
            items: 3,
        },
        {
            id: "ORD-003",
            customer: "Sara Ahmed",
            date: "2025-08-23",
            time: "11:20 AM",
            status: "Paid",
            payment: "Digital Wallet",
            total: 2450,
            items: 8,
        },
        {
            id: "ORD-004",
            customer: "Walk-in Customer",
            date: "2025-08-22",
            time: "06:05 PM",
            status: "Cancelled",
            payment: "Cash",
            total: 0,
            items: 0,
        },
        {
            id: "ORD-005",
            customer: "Bilal Hassan",
            date: "2025-08-22",
            time: "04:30 PM",
            status: "Paid",
            payment: "Card",
            total: 1200,
            items: 4,
        },
        {
            id: "ORD-006",
            customer: "Fatima Noor",
            date: "2025-08-22",
            time: "01:15 PM",
            status: "Processing",
            payment: "Card",
            total: 890,
            items: 3,
        },
        {
            id: "ORD-007",
            customer: "Walk-in Customer",
            date: "2025-08-21",
            time: "05:40 PM",
            status: "Paid",
            payment: "Cash",
            total: 560,
            items: 2,
        },
    ];

    // Filter orders based on status and search query
    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.payment.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const getStatusColor = (status) => {
        switch (status) {
            case "Paid":
                return "bg-green-100 text-green-800 border border-green-200";
            case "Pending":
                return "bg-yellow-100 text-yellow-800 border border-yellow-200";
            case "Processing":
                return "bg-blue-100 text-blue-800 border border-blue-200";
            case "Cancelled":
                return "bg-red-100 text-red-800 border border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-200";
        }
    };

    const getPaymentIcon = (payment) => {
        switch (payment) {
            case "Cash":
                return "💰";
            case "Card":
                return "💳";
            case "Digital Wallet":
                return "📱";
            default:
                return "⚡";
        }
    };

    return (
        <>
            <div className="p-6  dark:bg-gray-900 min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Manage and track your orders
                        </p>
                    </div>
                    <Link to='new'>
                        <button className="mt-4 md:mt-0 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <Plus size={18} />
                            <span>New Order</span>
                        </button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Paid</p>
                        <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === "Paid").length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === "Pending").length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
                        <p className="text-2xl font-bold text-blue-600">
                            Rs. {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search orders by ID, customer or payment method..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3">
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2 pl-4 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>

                            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Filter size={16} />
                                <span>More Filters</span>
                            </button>

                            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Download size={16} />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700 text-left">
                                <tr>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-300 text-sm">Order ID</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-300 text-sm">Customer</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-300 text-sm hidden lg:table-cell">Date & Time</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-300 text-sm">Status</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-300 text-sm hidden md:table-cell">Payment</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-300 text-sm text-right">Total</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-300 text-sm text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {currentOrders.length > 0 ? (
                                    currentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="p-4 font-medium text-gray-900 dark:text-white">
                                                {order.id}
                                            </td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="text-gray-900 dark:text-white">{order.customer}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.items} items</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                                                <div>
                                                    <p>{order.date}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.time}</p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                        order.status
                                                    )}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <span>{getPaymentIcon(order.payment)}</span>
                                                    <span className="text-gray-700 dark:text-gray-300">{order.payment}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right font-semibold text-gray-900 dark:text-white">
                                                {order.total > 0 ? `Rs. ${order.total.toLocaleString()}` : '-'}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        className="p-1.5 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                                        title="Print receipt"
                                                    >
                                                        <Printer size={16} />
                                                    </button>
                                                    <button
                                                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Delete order"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-500 dark:text-gray-400">
                                            No orders found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredOrders.length > 0 && (
                        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
                            <div className="text-sm text-gray-700 dark:text-gray-400">
                                Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{" "}
                                <span className="font-medium">
                                    {Math.min(indexOfLastOrder, filteredOrders.length)}
                                </span>{" "}
                                of <span className="font-medium">{filteredOrders.length}</span> results
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Outlet />
        </>
    );
}