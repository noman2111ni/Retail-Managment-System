import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteSale, fetchSales } from "../../../../store/slices/saleSlice";
import { RxCross1 } from "react-icons/rx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FaAccessibleIcon, FaSalesforce } from "react-icons/fa";

const SalesPage = () => {
  const { sales, error } = useSelector((state) => state.sales);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch]);

  console.log("Sales Data:", sales);

  if (error) return <p className="text-red-500">❌ {error}</p>;

  const grandTotal = sales.reduce(
    (sum, sale) => sum + parseFloat(sale.total_amount || 0),
    0
  );
  const dleteSaleHandler = (id) => {
    dispatch(deleteSale(id));
  }
  return (
    <div>
      <div className="p-6 min-h-screen  dark:bg-gray-900">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-3xl font-bold mb-6 
             bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 
             bg-clip-text text-transparent flex items-center gap-4">
            <FaAccessibleIcon className="text-yellow-400" />     <span>Sales Records</span>
          </h2>
          <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow">
            Grand Total: Rs {grandTotal.toFixed(2)}
          </div>
        </div>

        {/* Sales Records */}
        {sales.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No sales found.</p>
        ) : (
          sales.map((sale) => (
            <div
              key={sale.id}
              className="relative bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700"
            >

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => dleteSaleHandler(sale.id)}
                      className="absolute top-2 right-3 p-1 rounded-full 
                   hover:bg-red-50 dark:hover:bg-red-900/20 
                   text-gray-500 dark:text-gray-400 
                   hover:text-red-600 transition"
                    >
                      <RxCross1 className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-red-600 text-white text-sm px-3 py-1 rounded-md shadow-md">
                    Delete Sale
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* Sale Header */}
              <div className="flex justify-between items-center mb-3 mt-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Invoice: #{sale.invoice_no.slice(-4)}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(sale.created_at).toLocaleString()}
                </span>
              </div>

              {/* Customer & Branch Info */}

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-b">
                      <th className="p-2 text-left">#</th>
                      <th className="p-2 text-left">Product</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-center">Unit Price</th>
                      <th className="p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale.items.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{item.product_name}</td>
                        <td className="p-2 text-center">{item.quantity}</td>
                        <td className="p-2 text-center">Rs {item.unit_price}</td>
                        <td className="p-2 text-right">
                          Rs {(item.quantity * item.unit_price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                <div className="mb-2 space-y-1 flex justify-between">
                  <p>
                    <span className="font-medium">Subtotal:</span> Rs{" "}
                    {sale.subtotal}
                  </p>
                  <p>
                    <span className="font-medium">Discount:</span> Rs{" "}
                    {sale.discount}
                  </p>

                  <p>
                    <span className="font-medium">Balance:</span> Rs{" "}
                    {(sale.total_amount - sale.paid_amount).toFixed(2)}
                  </p>

                </div>
                <p>
                  <span className="font-medium">  Customer_Name:    </span>
                  {sale.customer_name}
                </p>
                <p>
                  <span className="font-medium">
                    payment_method:</span> {" "}
                  {sale.
                    payment_method}
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Total: Rs {sale.total_amount}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SalesPage;
