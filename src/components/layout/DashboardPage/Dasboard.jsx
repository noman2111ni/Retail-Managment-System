import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchnewProducts } from "../../../../store/newproductSlice";

const salesData = [
  { name: "Mon", sales: 1200 },
  { name: "Tue", sales: 800 },
  { name: "Wed", sales: 1600 },
  { name: "Thu", sales: 900 },
  { name: "Fri", sales: 2000 },
  { name: "Sat", sales: 1400 },
  { name: "Sun", sales: 1800 },
];

const categoryData = [
  { name: "Grocery", value: 4000 },
  { name: "Cosmetics", value: 2500 },
  { name: "Beverages", value: 3000 },
  { name: "Dairy", value: 1500 },
];

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

export default function Dashboard() {
   const { data: newproducts} = useSelector(
      (state) => state.newProducts
    );
  const dispatch = useDispatch();
  // save in local storage
  useEffect(() => {
    dispatch(fetchnewProducts())
  },[])
  return (
    <div className="p-6 grid gap-6 min-h-screen bg-gray-50 dark:bg-gray-900 backdrop-blur-lg">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border hover:scale-105 transition-transform duration-300">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-gray-500 dark:text-gray-400">
                  {newproducts.length}
              </p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Products
              </h2>
            </div>
            <Package className="w-10 h-10 text-orange-500" />
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border hover:scale-105 transition-transform duration-300">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Sales</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                PKR 45,000
              </h2>
            </div>
            <ShoppingCart className="w-10 h-10 text-blue-600" />
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border hover:scale-105 transition-transform duration-300">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Customers</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                320
              </h2>
            </div>
            <Users className="w-10 h-10 text-green-600" />
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border hover:scale-105 transition-transform duration-300">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Low Stock</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                15
              </h2>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card className="shadow-lg rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Weekly Sales
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(31,41,55,0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="sales" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Sales */}
        <Card className="shadow-lg rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Sales by Category
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(31,41,55,0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="shadow-lg rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border">
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Recent Sales
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                  <th className="p-3">Invoice</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Payment</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "#INV001",
                    name: "Ali Khan",
                    items: 3,
                    total: "PKR 1,200",
                    pay: "Cash",
                  },
                  {
                    id: "#INV002",
                    name: "Fatima",
                    items: 5,
                    total: "PKR 2,500",
                    pay: "Card",
                  },
                  {
                    id: "#INV003",
                    name: "Hassan",
                    items: 2,
                    total: "PKR 600",
                    pay: "Cash",
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition"
                  >
                    <td className="p-3 text-gray-900 dark:text-gray-100">
                      {row.id}
                    </td>
                    <td className="p-3 text-gray-900 dark:text-gray-100">
                      {row.name}
                    </td>
                    <td className="p-3 text-gray-900 dark:text-gray-100">
                      {row.items}
                    </td>
                    <td className="p-3 text-gray-900 dark:text-gray-100">
                      {row.total}
                    </td>
                    <td className="p-3 text-gray-900 dark:text-gray-100">
                      {row.pay}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
