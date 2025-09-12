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
import { ShoppingCart, Users, Package, AlertTriangle, Archive } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchnewProducts } from "../../../../store/newproductSlice";
import { fetchSales } from "../../../../store/slices/saleSlice";
import { fetchPurchases } from "../../../../store/slices/purchaseSlice";
import { fetchVendors } from "../../../../store/slices/vendorSlice";
import SalesPurchasesChart from "./SalesPurchasesChart";
import WeeklyCharts from "./WeeklyCombinedChart";

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"];

export default function Dashboard() {
  const dispatch = useDispatch();

  const { vendors } = useSelector((state) => state.vendors);
  const { data: newproducts } = useSelector((state) => state.newProducts);
  const { sales, loading: salesLoading, error: salesError } = useSelector((state) => state.sales);

  useEffect(() => {
    dispatch(fetchnewProducts());
    dispatch(fetchSales());
    dispatch(fetchPurchases());
    dispatch(fetchVendors());
  }, [dispatch]);

  // === Sales Stats ===
  const salesGrandTotal = sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount || 0), 0);
  const purshasesGrandTotal = sales.reduce((sum, purchase) => sum + parseFloat(purchase.total_amount || 0), 0);
  const recentSales = [...sales].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);



  const lowStockCount = newproducts.filter((p) => p.quantity <= 4).length;

  return (
    <div className="p-4 md:p-6 grid gap-6 min-h-screen dark:bg-gray-900 z-0">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
        <Card className="shadow-lg rounded-2xl bg-white/70 dark:bg-white/0 backdrop-blur-md border">
          <CardContent className="flex items-center justify-between p-4 md:p-6">
            <div>
              <p className="text-gray-500 dark:text-gray-400   ">Total Products</p>
              <h2 className=" text-gray-900 dark:text-gray-100 text-lg md:text-2xl font-bold" >{newproducts.length}</h2>
            </div>
            <Package className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl bg-white/70 dark:bg-white/0 backdrop-blur-md border">
          <CardContent className="flex items-center justify-between p-4 md:p-6">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Sales</p>
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                PKR {salesGrandTotal.toFixed(2)}
              </h2>
            </div>
            <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl bg-white/70 dark:bg-white/0 backdrop-blur-md border">
          <CardContent className="flex items-center justify-between p-4 md:p-6">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Vendors</p>
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100">{vendors.length}</h2>
            </div>
            <Users className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-2xl bg-white/70 dark:bg-white/0 backdrop-blur-md border">
          <CardContent className="flex items-center justify-between p-4 md:p-6">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Purchases</p>
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100">{purshasesGrandTotal.toFixed(2)}</h2>
            </div>
            <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
          </CardContent>
        </Card>

      </div>
      <Card className="shadow-lg rounded-2xl bg-white/70 dark:bg-white/0 backdrop-blur-md border">
        <CardContent className="flex items-center justify-between p-4 md:p-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Low Stock</p>
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100">{lowStockCount}</h2>
          </div>
          <AlertTriangle className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Sales */}
        <WeeklyCharts />
        {/* Sales by Category */}
        <SalesPurchasesChart />
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mt-6">
        {/* Recent Sales */}
        <Card className="shadow-lg rounded-2xl bg-white/70 dark:bg-white/0 backdrop-blur-md border">
          <CardContent className="p-4 md:p-6">
            <h2 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Sales</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                    <th className="p-2 md:p-3">Invoice</th>
                    <th className="p-2 md:p-3">Customer</th>
                    <th className="p-2 md:p-3">Items</th>
                    <th className="p-2 md:p-3">Total</th>
                    <th className="p-2 md:p-3">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {salesLoading ? (
                    <tr><td colSpan="5" className="p-3 text-center">Loading...</td></tr>
                  ) : salesError ? (
                    <tr><td colSpan="5" className="p-3 text-center text-red-500">{salesError}</td></tr>
                  ) : recentSales.length === 0 ? (
                    <tr><td colSpan="5" className="p-3 text-center">No recent sales</td></tr>
                  ) : recentSales.map((sale) => (
                    <tr key={sale.id} className="border-b hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition">
                      <td className="p-2 md:p-3">#{sale.invoice_no.slice(-4)}</td>
                      <td className="p-2 md:p-3">{sale.customer_name}</td>
                      <td className="p-2 md:p-3">{sale.items?.length || 0}</td>
                      <td className="p-2 md:p-3">{sale.total_amount}</td>
                      <td className="p-2 md:p-3">{sale.payment_method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
