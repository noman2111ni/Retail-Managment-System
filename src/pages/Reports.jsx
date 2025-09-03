import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaRegCalendarAlt, FaSearch } from "react-icons/fa";

const ReportPage = () => {
  const [search, setSearch] = useState("");

  // Placeholder data for Best Selling Categories
  const bestSellingCategories = [
    { category: "Vegetables", turnover: "$12,500", increasedBy: "15%" },
    { category: "House holds", turnover: "$8,200", increasedBy: "10%" },
    { category: "Food", turnover: "$6,000", increasedBy: "8%" },
  ];

  // Placeholder data for Best Selling Products
  const bestSellingProducts = [
    {
      product: "Tomatoes",
      productId: "P001",
      category: "Vegetables",
      remainingQty: "120kg",
      turnover: "$3,200",
      increasedBy: "12%",
    },
    {
      product: "Detergent",
      productId: "P002",
      category: "House holds",
      remainingQty: "80",
      turnover: "$2,500",
      increasedBy: "9%",
    },
    {
      product: "Bread",
      productId: "P003",
      category: "Food",
      remainingQty: "200",
      turnover: "$1,800",
      increasedBy: "7%",
    },
  ];

  const filteredCategories = bestSellingCategories.filter((item) =>
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const monthlyData = [
    { month: "Jan", profit: 4000, revenue: 2400 },
    { month: "Feb", profit: 3000, revenue: 2210 },
    { month: "Mar", profit: 5000, revenue: 3200 },
    { month: "Apr", profit: 4500, revenue: 3100 },
    { month: "May", profit: 6000, revenue: 4000 },
    { month: "Jun", profit: 7000, revenue: 4600 },
    { month: "Jul", profit: 8000, revenue: 5000 },
    { month: "Aug", profit: 7500, revenue: 4900 },
    { month: "Sep", profit: 6800, revenue: 4700 },
    { month: "Oct", profit: 7200, revenue: 4800 },
    { month: "Nov", profit: 8100, revenue: 5300 },
    { month: "Dec", profit: 9000, revenue: 5800 },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen overflow-y-auto">
      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => console.log("Searching for:", search)}
          >
            <FaSearch size={18} />
          </button>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overview Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 dark:shadow-none dark:border dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Overview</h2>
          <ul className="mt-4 space-y-4">
            <li className="flex justify-between items-center">
              <span className="dark:text-gray-300">Total Profit Revenue:</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">$25,000</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="dark:text-gray-300">Sales:</span>
              <span className="text-orange-500 dark:text-orange-400 font-bold">$50,000</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="dark:text-gray-300">Net Purchase Value:</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">$20,000</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="dark:text-gray-300">Net Sale Value:</span>
              <span className="text-orange-500 dark:text-orange-400 font-bold">$30,000</span>
            </li>
          </ul>
        </div>

        {/* Best Selling Category Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 dark:shadow-none dark:border dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Best Selling Category</h2>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-3 border-b dark:border-gray-600 dark:text-gray-200">Category</th>
                <th className="p-3 border-b dark:border-gray-600 dark:text-gray-200">Turnover</th>
                <th className="p-3 border-b dark:border-gray-600 dark:text-gray-200">Increased By</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 border-b dark:border-gray-600 dark:text-gray-100">{item.category}</td>
                    <td className="p-3 border-b dark:border-gray-600 dark:text-gray-100">{item.turnover}</td>
                    <td className="p-3 border-b text-green-600 dark:text-green-400 font-semibold dark:border-gray-600">
                      {item.increasedBy}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-3 text-center text-gray-500 dark:text-gray-400">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profit & Revenue Graph */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6 dark:shadow-none dark:border dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-gray-100">Profit & Revenue (weak)</h2>
          <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
            <FaRegCalendarAlt size={20} />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                color: "#111",
                borderRadius: "0.5rem",
                border: "1px solid #e5e7eb",
              }}
              wrapperStyle={{
                backgroundColor: "inherit",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#d72626ff"
              strokeWidth={2}
              name="Profit"
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#9c20d2ff"
              strokeWidth={2}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Best Selling Product Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6 dark:shadow-none dark:border dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Best Selling Products</h2>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-3 border-b dark:border-gray-600 dark:text-gray-200">Product</th>
              <th className="p-3 border-b dark:border-gray-600 dark:text-gray-200">Product ID</th>
              <th className="p-3 border-b dark:border-gray-600 dark:text-gray-200">Category</th>
              <th className="p-3 border-b dark:border-gray-600 dark:text-gray-200">Remaining Quantity</th>
              <th className="p-3 border-b dark:border-gray-600 dark:text-gray-200">Turnover</th>
              <th className="p-3 border-b dark:border-gray-600 dark:text-gray-200">Increased By</th>
            </tr>
          </thead>
          <tbody>
            {bestSellingProducts.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3 border-b dark:border-gray-600 dark:text-gray-100">{item.product}</td>
                <td className="p-3 border-b dark:border-gray-600 dark:text-gray-100">{item.productId}</td>
                <td className="p-3 border-b dark:border-gray-600 dark:text-gray-100">{item.category}</td>
                <td className="p-3 border-b dark:border-gray-600 dark:text-gray-100">{item.remainingQty}</td>
                <td className="p-3 border-b dark:border-gray-600 dark:text-gray-100">{item.turnover}</td>
                <td className="p-3 border-b text-green-600 dark:text-green-400 font-semibold dark:border-gray-600">
                  {item.increasedBy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportPage;