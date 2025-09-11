import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchases, deletePurchase } from "../../../../store/slices/purchaseSlice";
import { RxCross1 } from "react-icons/rx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FaBoxOpen } from "react-icons/fa";

const PurchasePage = () => {
  const dispatch = useDispatch();
  const { purchases } = useSelector((state) => state.purchases);

  useEffect(() => {
    dispatch(fetchPurchases());
  }, [dispatch]);

  const deletePurchaseHandler = (id) => {
    dispatch(deletePurchase(id));
  };

  const grandTotal = purchases.reduce(
    (sum, purchase) => sum + parseFloat(purchase.total_amount || 0),
    0
  );

  return (
    <div className="p-6 min-h-screen dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-3xl font-bold mb-6 
                       bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 
                       bg-clip-text text-transparent flex items-center gap-4">
          <FaBoxOpen className="text-yellow-400" /> <span>Purchase Records</span>
        </h2>
        <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow">
          Grand Total: Rs {grandTotal.toFixed(2)}
        </div>
      </div>

      {purchases.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No purchases found.</p>
      ) : (
        purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="relative bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700"
          >
            {/* Delete Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => deletePurchaseHandler(purchase.id)}
                    className="absolute top-2 right-3 p-1 rounded-full 
                               hover:bg-red-50 dark:hover:bg-red-900/20 
                               text-gray-500 dark:text-gray-400 
                               hover:text-red-600 transition"
                  >
                    <RxCross1 className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-red-600 text-white text-sm px-3 py-1 rounded-md shadow-md">
                  Delete Purchase
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Purchase Header */}
            <div className="flex justify-between items-center mb-3 mt-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Invoice: #{purchase.invoice_no.slice(-4)}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(purchase.created_at).toLocaleString()}
              </span>
            </div>

            {/* Vendor Info */}
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-medium">Vendor:</span> {purchase.vendor_name || "-"}
            </p>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-b">
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-center">Unit Cost</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {purchase.items.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{item.product_name}</td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-center">Rs {item.unit_cost}</td>
                      <td className="p-2 text-right">Rs {item.total_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <div className="flex justify-between">
                <p><span className="font-medium">Subtotal:</span> Rs {purchase.subtotal}</p>
                <p><span className="font-medium">Discount:</span> Rs {purchase.discount}</p>
              </div>
              <p><span className="font-medium">Paid Amount:</span> Rs {purchase.paid_amount}</p>
              <p><span className="font-medium">Balance:</span> Rs {(purchase.total_amount - purchase.paid_amount).toFixed(2)}</p>
              <p><span className="font-medium">Created By:</span> {purchase.created_by_name || "-"}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Total: Rs {purchase.total_amount}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PurchasePage;
