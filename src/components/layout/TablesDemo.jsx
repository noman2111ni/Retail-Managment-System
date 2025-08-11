import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
  { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
  { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" }
]

function TableDemo() {
  return (
    <div className=" mt overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            Top Selling Stock
        </h1>
      <Table className="w-full text-sm">

        
        {/* Table Header */}
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800/60">
            <TableHead className="w-[140px] font-semibold text-gray-700 dark:text-gray-300">Invoice</TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Payment Status</TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Payment Method</TableHead>
            <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">Total Amount</TableHead>
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow
              key={invoice.invoice}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                {invoice.invoice}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    invoice.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300"
                      : invoice.paymentStatus === "Pending"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/30 dark:text-yellow-300"
                      : "bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-300"
                  }`}
                >
                  {invoice.paymentStatus}
                </span>
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right text-gray-900 dark:text-gray-100">{invoice.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        {/* Table Footer */}
        <TableFooter>
          <TableRow className="bg-gray-50 dark:bg-gray-800/60 font-semibold">
            <TableCell colSpan={3} className="text-gray-700 dark:text-gray-300">
              Total
            </TableCell>
            <TableCell className="text-right text-gray-900 dark:text-gray-100">
              $2,500.00
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export default TableDemo
