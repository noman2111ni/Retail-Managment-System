// src/components/sales/SaleForm.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSale } from "../../../../store/slices/saleSlice";
import { fetchBranches } from "../../../../store/slices/branchSlice";
import { fetchnewProducts } from "../../../../store/newproductSlice";
import { Loader2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";

const SaleForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.sales);
  const { data: branches = [] } = useSelector((state) => state.branches);
  const { data: products = [] } = useSelector((state) => state.newProducts);

  const [invoiceNo, setInvoiceNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [branch, setBranch] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [createdBy] = useState("DevNoman (admin)");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([{ product: "", quantity: 1, unit_price: "" }]);

  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchnewProducts());
    setInvoiceNo(`INV-${Math.floor(Math.random() * 100000)}`);
  }, [dispatch]);

  // 🔹 Recalculate Totals
  const recalcTotals = (newItems, discountValue = discount) => {
    const sub = newItems.reduce(
      (sum, item) => sum + item.quantity * (parseFloat(item.unit_price) || 0),
      0
    );
    setSubtotal(sub);
    setTotalAmount(sub - discountValue);
  };

  // ➕ Add item
  const addItem = () => {
    const newItems = [...items, { product: "", quantity: 1, unit_price: "" }];
    setItems(newItems);
    recalcTotals(newItems);
  };

  // ✏️ Update item
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === "product") {
      const selectedProduct = products.find((p) => p.id === parseInt(value));
      if (selectedProduct) {
        newItems[index].unit_price = selectedProduct.unit_cost || 0;
      }
    }

    setItems(newItems);
    recalcTotals(newItems);
  };

  // ❌ Remove item
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    recalcTotals(newItems);
  };

  // 🚀 Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (paidAmount > totalAmount) {
      alert("❌ Paid amount cannot exceed total amount!");
      return;
    }

    const saleData = {
      invoice_no: invoiceNo,
      customer_name: customerName,
      customer_phone: customerPhone,
      branch,
      subtotal,
      discount,
      total_amount: totalAmount,
      paid_amount: paidAmount,
      payment_method: paymentMethod,
      created_by: createdBy,
      notes,
      items: items.map((item) => ({
        product: parseInt(item.product),
        quantity: parseInt(item.quantity),
        unit_price: parseFloat(item.unit_price),
      })),
    };

    dispatch(createSale(saleData));
    navigate("/sales");

  };

  return (

    <div className="min-h-screen  dark:bg-gray-800 py-3">
      <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 ">
        <form
          onSubmit={handleSubmit}
          className="relative space-y-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 transition-colors border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            🧾 Create Sale
          </h2>
          <RxCross1 className=" absolute top-4 right-4 text-gray-500 dark:text-gray-400 cursor-pointer" onClick={() => navigate(-1)} />
          {/* Invoice & Branch */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Invoice No
              </label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="border p-2 w-full rounded bg-gray-50 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="border p-2 w-full rounded bg-gray-50 dark:bg-gray-800 dark:text-white"
                required
              >
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="border p-2 w-full rounded bg-gray-50 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Customer Phone
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="border p-2 w-full rounded bg-gray-50 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-bold mb-2 text-gray-800 dark:text-white">
              🛒 Sale Items
            </h3>
            {items.map((item, index) => (
              <div
                key={index}
                className="grid sm:grid-cols-4 gap-2 items-center mb-3 border p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <select
                  value={item.product}
                  onChange={(e) => updateItem(index, "product", e.target.value)}
                  className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", e.target.value)}
                  className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
                  required
                />

                <input
                  type="number"
                  placeholder="Unit Price"
                  value={item.unit_price}
                  onChange={(e) => updateItem(index, "unit_price", e.target.value)}
                  className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
                  required
                />

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2 text-white rounded flex justify-center 
             bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 
             hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600"
                >
                  <Trash2 size={16} />
                </button>

              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 
             hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded transition"
            >
              ➕ Add Item
            </button>
          </div>

          {/* Summary Section */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Subtotal
              </label>
              <input
                type="number"
                value={subtotal}
                readOnly
                className="border p-2 w-full rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Discount
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => {
                  setDiscount(Number(e.target.value));
                  recalcTotals(items, Number(e.target.value));
                }}
                className="border p-2 w-full rounded bg-gray-50 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Total Amount
              </label>
              <input
                type="number"
                value={totalAmount}
                readOnly
                className="border p-2 w-full rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Paid Amount
              </label>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="border p-2 w-full rounded bg-gray-50 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Payment Method & Created By */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="border p-2 w-full rounded bg-gray-50 dark:bg-gray-800 dark:text-white"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="credit">Credit</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Created By
              </label>
              <input
                type="text"
                value={createdBy}
                readOnly
                className="border p-2 w-full rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border p-2 w-full rounded bg-gray-50 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 
             hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg shadow flex items-center justify-center transition"
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : "💾 Save Sale"}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-center mt-2">
              Error: {JSON.stringify(error)}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SaleForm;
