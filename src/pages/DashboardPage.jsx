import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Input } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";
import SalesPurchasePage from "./SalesPurchasePage";
import TablesDemo from "@/components/layout/TablesDemo";

// const salesData = [
//     { day: "Mon", sales: 400 },
//     { day: "Tue", sales: 300 },
//     { day: "Wed", sales: 500 },
//     { day: "Thu", sales: 200 },
//     { day: "Fri", sales: 600 },
//     { day: "Sat", sales: 800 },
//     { day: "Sun", sales: 700 },
// ];


// const topProducts = [
//     { name: "Laptop Pro 15", sales: 120 },
//     { name: "Wireless Headphones", sales: 95 },
//     { name: "Smart Watch", sales: 80 },
// ];


export default function DashboardPage({ onItemClick, className }) {
    return (
        <div className="flex flex-col w-full h-screen">
            {/* Top Navbar */}
            <header className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm bg-white dark:bg-gray-900">
                <div className="relative w-88">
                    {/* Search icon */}
                    <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-white" />

                    {/* Input field */}
                    <Input
                        placeholder="Search products, orders, etc."
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none  dark:bg-gray-900 dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-6">
                    <ModeToggle />
                    <Bell className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200" />
                    <div>
                        <div className="flex flex-row flex-wrap items-center gap-12">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main
                className={`flex-1 overflow-y-auto p-6 space-y-6  dark:bg-gray-900 ${className || ""} ` }
                onClick={onItemClick}
                style={{ cursor: onItemClick ? "pointer" : "default" }}
            >
                {/* KPI Cards */}
                <div className="grid gap-6 md:grid-cols-4 border border-gray-200 dark:border-gray-800 p-4 rounded-lg  dark:bg-gray-900">
                    {[
                        { title: "Total Sales", value: "$12,340" },
                        { title: "Orders", value: "345" },
                        { title: "Customers", value: "1,230" },
                        { title: "Low Stock", value: "8" },
                    ].map((item, index) => (
                        <Card
                            key={index}
                            className="hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800"
                        >
                            <CardHeader>
                                <CardTitle className="text-gray-500 dark:text-gray-400">
                                    {item.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    {item.value}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <SalesPurchasePage />
                <TablesDemo/>



            </main>
        </div>
    );
}
