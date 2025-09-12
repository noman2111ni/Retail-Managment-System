import React, { useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useSelector, useDispatch } from "react-redux";
import { fetchSales } from "../../../../store/slices/saleSlice";
import { fetchPurchases } from "../../../../store/slices/purchaseSlice";

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#A855F7", "#F43F5E"];

export default function SalesPurchasesChart() {
    const dispatch = useDispatch();
    const { sales } = useSelector((state) => state.sales);
    const { purchases } = useSelector((state) => state.purchases);

    useEffect(() => {
        dispatch(fetchSales());
        dispatch(fetchPurchases());
    }, [dispatch]);

    const mergedData = useMemo(() => {
        const categoryTotals = {};

        sales.forEach((sale) => {
            sale.items?.forEach((item) => {
                const cat = item.category_name || "Others";
                const value = item.quantity * item.unit_price;
                if (!categoryTotals[cat]) categoryTotals[cat] = { sales: 0, purchases: 0 };
                categoryTotals[cat].sales += value;
            });
        });

        purchases.forEach((purchase) => {
            purchase.items?.forEach((item) => {
                const cat = item.category_name || "Others";
                const value = item.quantity * item.unit_cost;
                if (!categoryTotals[cat]) categoryTotals[cat] = { sales: 0, purchases: 0 };
                categoryTotals[cat].purchases += value;
            });
        });

        const dataArray = [];
        Object.entries(categoryTotals).forEach(([cat, vals]) => {
            dataArray.push({ name: `${cat} (Sales)`, value: vals.sales });
            dataArray.push({ name: `${cat} (Purchases)`, value: vals.purchases });
        });

        return dataArray;
    }, [sales, purchases]);

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
        return (
            <text x={x} y={y} fill="#fff" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Card className="shadow-xl h-[450px] rounded-xl bg-white/70 dark:bg-gray-800/0 backdrop-blur-md border border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 md:p-6">
                <h2 className="font-bold text-xl md:text-xl mb-4 text-gray-900 dark:text-gray-100">
                    Sales & Purchases by Category
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    {mergedData.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">No data available</p>
                    ) : (
                        <PieChart>
                            <Pie
                                data={mergedData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                isAnimationActive={true}
                            >
                                {mergedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        stroke="#fff"
                                        strokeWidth={2}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(31,41,55,0.9)",
                                    border: "none",
                                    borderRadius: "8px",
                                    color: "#fff",
                                    fontSize: "14px",
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                iconType="circle"
                                wrapperStyle={{ fontSize: 14, color: "#6B7280" }}
                            />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
