import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, DollarSign, Package, ShoppingCart, TrendingDown, TrendingUp, BarChart3 } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

export default function SalesPurchasePage() {
  const [transactions, setTransactions] = useState([])
  const [saleForm, setSaleForm] = useState({
    item: "",
    amount: "",
    quantity: "",
    description: "",
  })
  const [purchaseForm, setPurchaseForm] = useState({
    item: "",
    amount: "",
    quantity: "",
    description: "",
  })

  const handleSaleSubmit = (e) => {
    e.preventDefault()
    const newSale = {
      id: Date.now().toString(),
      type: "sale",
      item: saleForm.item,
      amount: Number.parseFloat(saleForm.amount),
      quantity: Number.parseInt(saleForm.quantity),
      description: saleForm.description,
      date: new Date().toLocaleDateString(),
    }
    setTransactions([newSale, ...transactions])
    setSaleForm({ item: "", amount: "", quantity: "", description: "" })
  }

  const handlePurchaseSubmit = (e) => {
    e.preventDefault()
    const newPurchase = {
      id: Date.now().toString(),
      type: "purchase",
      item: purchaseForm.item,
      amount: Number.parseFloat(purchaseForm.amount),
      quantity: Number.parseInt(purchaseForm.quantity),
      description: purchaseForm.description,
      date: new Date().toLocaleDateString(),
    }
    setTransactions([newPurchase, ...transactions])
    setPurchaseForm({ item: "", amount: "", quantity: "", description: "" })
  }

  const totalSales = transactions.filter((t) => t.type === "sale").reduce((sum, t) => sum + t.amount, 0)
  const totalPurchases = transactions.filter((t) => t.type === "purchase").reduce((sum, t) => sum + t.amount, 0)
  const netProfit = totalSales - totalPurchases

  const chartData = useMemo(() => {
    const dateMap = new Map()
    transactions.forEach((transaction) => {
      const date = transaction.date
      if (!dateMap.has(date)) {
        dateMap.set(date, { sales: 0, purchases: 0 })
      }
      const dayData = dateMap.get(date)
      if (transaction.type === "sale") {
        dayData.sales += transaction.amount
      } else {
        dayData.purchases += transaction.amount
      }
    })
    return Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        sales: data.sales,
        purchases: data.purchases,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [transactions])

  return (
    <div className="container mx-auto p- max-w-6xl p-4 border rounded-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Sales & Purchase Manager</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter((t) => t.type === "sale").length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalPurchases.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter((t) => t.type === "purchase").length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${netProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Sales minus purchases</p>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sales & Purchase Trends
            </CardTitle>
            <CardDescription>Daily sales and purchase amounts over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: {
                  label: "Sales",
                  color: "#ef4444",
                },
                purchases: {
                  label: "Purchases",
                  color: "#eab308",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <ChartTooltip content={<ChartTooltipContent />} formatter={(value, name) => [`$${value}`, name]} />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="purchases"
                    stroke="#eab308"
                    strokeWidth={3}
                    dot={{ fill: "#eab308", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#eab308", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Record Sale
          </TabsTrigger>
          <TabsTrigger value="purchases" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Record Purchase
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Transaction History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Record a Sale</CardTitle>
              <CardDescription>Add a new sale transaction to your records</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sale-item">Item/Product</Label>
                    <Input
                      id="sale-item"
                      placeholder="Enter item name"
                      value={saleForm.item}
                      onChange={(e) => setSaleForm({ ...saleForm, item: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale-amount">Sale Amount ($)</Label>
                    <Input
                      id="sale-amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={saleForm.amount}
                      onChange={(e) => setSaleForm({ ...saleForm, amount: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sale-quantity">Quantity</Label>
                  <Input
                    id="sale-quantity"
                    type="number"
                    placeholder="1"
                    value={saleForm.quantity}
                    onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sale-description">Description (Optional)</Label>
                  <Textarea
                    id="sale-description"
                    placeholder="Additional details about the sale"
                    value={saleForm.description}
                    onChange={(e) => setSaleForm({ ...saleForm, description: e.target.value })}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Record Sale
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Record a Purchase</CardTitle>
              <CardDescription>Add a new purchase transaction to your records</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchase-item">Item/Product</Label>
                    <Input
                      id="purchase-item"
                      placeholder="Enter item name"
                      value={purchaseForm.item}
                      onChange={(e) => setPurchaseForm({ ...purchaseForm, item: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchase-amount">Purchase Amount ($)</Label>
                    <Input
                      id="purchase-amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={purchaseForm.amount}
                      onChange={(e) => setPurchaseForm({ ...purchaseForm, amount: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase-quantity">Quantity</Label>
                  <Input
                    id="purchase-quantity"
                    type="number"
                    placeholder="1"
                    value={purchaseForm.quantity}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase-description">Description (Optional)</Label>
                  <Textarea
                    id="purchase-description"
                    placeholder="Additional details about the purchase"
                    value={purchaseForm.description}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, description: e.target.value })}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Record Purchase
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your sales and purchase transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions recorded yet</p>
                  <p className="text-sm">Start by recording your first sale or purchase</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.type === "sale" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {transaction.type === "sale" ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{transaction.item}</h3>
                            <Badge variant={transaction.type === "sale" ? "default" : "secondary"}>
                              {transaction.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Qty: {transaction.quantity} • {transaction.date}
                          </p>
                          {transaction.description && (
                            <p className="text-sm text-muted-foreground mt-1">{transaction.description}</p>
                          )}
                        </div>
                      </div>
                      <div
                        className={`text-lg font-semibold ${
                          transaction.type === "sale" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "sale" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}