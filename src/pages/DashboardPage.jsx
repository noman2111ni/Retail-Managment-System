import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { PlusCircle, ShoppingCart, Package, Users, Bell, LogOut } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const salesData = [
    { day: "Mon", sales: 400 },
    { day: "Tue", sales: 300 },
    { day: "Wed", sales: 500 },
    { day: "Thu", sales: 200 },
    { day: "Fri", sales: 600 },
    { day: "Sat", sales: 800 },
    { day: "Sun", sales: 700 },
];

const recentOrders = [
    { id: "ORD001", customer: "John Doe", amount: "$120", status: "Completed" },
    { id: "ORD002", customer: "Jane Smith", amount: "$250", status: "Pending" },
    { id: "ORD003", customer: "Mark Lee", amount: "$80", status: "Cancelled" },
];

const topProducts = [
    { name: "Laptop Pro 15", sales: 120 },
    { name: "Wireless Headphones", sales: 95 },
    { name: "Smart Watch", sales: 80 },
];

const lowStockItems = [
    { name: "USB-C Cable", stock: 3 },
    { name: "Gaming Mouse", stock: 5 },
];

const recentCustomers = [
    { name: "Alice Brown", joined: "2 days ago" },
    { name: "David Wilson", joined: "4 days ago" },
];

export default function DashboardPage({ onItemClick, className }) {
   
    return (
        <div className="flex flex-col w-full h-screen ">
            {/* Top Navbar */}
            <header className="flex justify-between items-center bg-white border-b px-6 py-3 shadow-sm">
                <h1 className="text-xl font-bold text-gray-700">Retail Manager</h1>
                <div className="flex items-center gap-4">
                    <Bell className="text-gray-500 cursor-pointer hover:text-gray-700" />
                    <div>
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main
                className={`flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 ${className || ""}`}
                onClick={onItemClick}
                style={{ cursor: onItemClick ? "pointer" : "default" }}
            >
                {/* KPI Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                    {[
                        { title: "Total Sales", value: "$12,340" },
                        { title: "Orders", value: "345" },
                        { title: "Customers", value: "1,230" },
                        { title: "Low Stock", value: "8" },
                    ].map((item, index) => (
                        <Card key={index} className="hover:shadow-lg transition-all duration-300 border border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-gray-500">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{item.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <Card className="shadow-sm border border-gray-200">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4 flex-wrap">
                        <Button variant="default"><PlusCircle className="mr-2 h-4 w-4" /> Add Product</Button>
                        <Button variant="default"><ShoppingCart className="mr-2 h-4 w-4" /> New Sale</Button>
                        <Button variant="default"><Package className="mr-2 h-4 w-4" /> Manage Stock</Button>
                        <Button variant="default"><Users className="mr-2 h-4 w-4" /> New Customer</Button>
                    </CardContent>
                </Card>

                {/* Sales Chart */}
                <Card className="shadow-sm border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-gray-700">Weekly Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData}>
                                <XAxis dataKey="day" stroke="#888888" />
                                <YAxis stroke="#888888" />
                                <Tooltip />
                                <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="shadow-sm border border-gray-200">
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={topProducts}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="sales" fill="#2563eb" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Low Stock Alerts */}
                <Card className="shadow-sm border border-gray-200">
                    <CardHeader>
                        <CardTitle>Low Stock Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {lowStockItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between border-b py-2">
                                <span>{item.name}</span>
                                <Badge variant="destructive">{item.stock} left</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="shadow-sm border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-gray-700">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.customer}</TableCell>
                                        <TableCell>{order.amount}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    order.status === "Completed"
                                                        ? "success"
                                                        : order.status === "Pending"
                                                            ? "warning"
                                                            : "destructive"
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Recent Customers */}
                <Card className="shadow-sm border border-gray-200">
                    <CardHeader>
                        <CardTitle>Recent Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentCustomers.map((cust, idx) => (
                            <div key={idx} className="flex justify-between border-b py-2">
                                <span>{cust.name}</span>
                                <span className="text-gray-500 text-sm">{cust.joined}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
