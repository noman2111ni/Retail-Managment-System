import React, { useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchSales } from "../../../../store/slices/saleSlice";
import { fetchPurchases } from "../../../../store/slices/purchaseSlice";

export default function WeeklyCombinedChart() {
  const dispatch = useDispatch();
  const { sales } = useSelector((state) => state.sales);
  const { purchases } = useSelector((state) => state.purchases);

  useEffect(() => {
    dispatch(fetchSales());
    dispatch(fetchPurchases());
  }, [dispatch]);

  const weeklyData = useMemo(() => {
    const weekMap = {
      Sun: { sales: 0, purchases: 0 },
      Mon: { sales: 0, purchases: 0 },
      Tue: { sales: 0, purchases: 0 },
      Wed: { sales: 0, purchases: 0 },
      Thu: { sales: 0, purchases: 0 },
      Fri: { sales: 0, purchases: 0 },
      Sat: { sales: 0, purchases: 0 },
    };

    sales.forEach((sale) => {
      const day = new Date(sale.created_at).toLocaleDateString("en-US", { weekday: "short" });
      weekMap[day].sales += parseFloat(sale.total_amount || 0);
    });

    purchases.forEach((purchase) => {
      const day = new Date(purchase.created_at).toLocaleDateString("en-US", { weekday: "short" });
      weekMap[day].purchases += parseFloat(purchase.total_amount || 0);
    });

    return Object.entries(weekMap).map(([day, values]) => ({
      name: day,
      Sales: values.sales,
      Purchases: values.purchases,
    }));
  }, [sales, purchases]);

  return (
    <Card className="shadow-2xl rounded-xl bg-white/60 dark:bg-gray-900/40 backdrop-blur-lg border border-gray-200 dark:border-gray-700 hover:shadow-3xl transition-shadow duration-300 h-[450px]">
      <CardContent className="p-6 md:p-8">
        <h2 className="font-bold text-xl md:text-xl mb-6 text-gray-900 dark:text-gray-100">
          Weekly Sales & Purchases
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={weeklyData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="name" stroke="#6B7280" tickLine={false} />
            <YAxis stroke="#6B7280" tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31,41,55,0.9)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                padding: "8px 12px",
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: 10 }}
            />
            <Bar
              dataKey="Sales"
              fill="#4F46E5"
              radius={[6, 6, 0, 0]}
              barSize={24}
            />
            <Bar
              dataKey="Purchases"
              fill="#22C55E"
              radius={[6, 6, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
