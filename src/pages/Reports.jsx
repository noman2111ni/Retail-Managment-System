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
    <div className="p-6 bg-gray-100 min-h-screen overflow-y-auto">
      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => console.log("Searching for:", search)}
          >
            <FaSearch size={18} />
          </button>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overview Card */}
       {/* Overview Card */}
<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-xl font-bold mb-4">Overview</h2>

  <ul className="mt-4 space-y-4">
    <li className="flex justify-between items-center">
      <span>Total Profit Revenue:</span>
      <span className="text-purple-600 font-bold">$25,000</span>
    </li>
    <li className="flex justify-between items-center">
      <span>Sales:</span>
      <span className="text-orange-500 font-bold">$50,000</span>
    </li>
    <li className="flex justify-between items-center">
      <span>Net Purchase Value:</span>
      <span className="text-purple-600 font-bold">$20,000</span>
    </li>
    <li className="flex justify-between items-center">
      <span>Net Sale Value:</span>
      <span className="text-orange-500 font-bold">$30,000</span>
    </li>
  </ul>
</div>

        {/* Best Selling Category Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Best Selling Category</h2>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border-b">Category</th>
                <th className="p-3 border-b">Turnover</th>
                <th className="p-3 border-b">Increased By</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{item.category}</td>
                    <td className="p-3 border-b">{item.turnover}</td>
                    <td className="p-3 border-b text-green-600 font-semibold">
                      {item.increasedBy}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-3 text-center text-gray-500">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profit & Revenue Graph */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Profit & Revenue (Monthly)</h2>
          <button className="text-gray-600 hover:text-gray-800">
            <FaRegCalendarAlt size={20} />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
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
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Best Selling Products</h2>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border-b">Product</th>
              <th className="p-3 border-b">Product ID</th>
              <th className="p-3 border-b">Category</th>
              <th className="p-3 border-b">Remaining Quantity</th>
              <th className="p-3 border-b">Turnover</th>
              <th className="p-3 border-b">Increased By</th>
            </tr>
          </thead>
          <tbody>
            {bestSellingProducts.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-3 border-b">{item.product}</td>
                <td className="p-3 border-b">{item.productId}</td>
                <td className="p-3 border-b">{item.category}</td>
                <td className="p-3 border-b">{item.remainingQty}</td>
                <td className="p-3 border-b">{item.turnover}</td>
                <td className="p-3 border-b text-green-600 font-semibold">
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
