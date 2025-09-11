// src/components/purchases/PurchaseForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { fetchnewProducts } from "../../../../store/newproductSlice";
import { addPurchase } from "../../../../store/slices/purchaseSlice";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { fetchVendors } from "../../../../store/slices/vendorSlice";

export default function PurchaseForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: products, loading: productLoading } = useSelector(
    (state) => state.newProducts
  );
  const { vendors } = useSelector((state) => state.vendors);
  const { loading: purchaseLoading } = useSelector((state) => state.purchases);

  const [formData, setFormData] = useState({
    vendor: "",
    invoice_no: "",
    date: new Date().toISOString().split("T")[0],
    items: [{ product: "", quantity: 1, unit_cost: "" }],
  });

  useEffect(() => {
    dispatch(fetchnewProducts());
    dispatch(fetchVendors());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, e) => {
    const newItems = [...formData.items];
    newItems[index][e.target.name] = e.target.value;

    // Auto-fill unit cost if product changes
    if (e.target.name === "product") {
      const selectedProduct = products.find(
        (p) => p.id === parseInt(e.target.value)
      );
      if (selectedProduct) {
        newItems[index]["unit_cost"] = selectedProduct.unit_cost || "";
      }
    }

    setFormData({ ...formData, items: newItems });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: "", quantity: 1, unit_cost: "" }],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      vendor: parseInt(formData.vendor),
      invoice_no: formData.invoice_no,
      date: formData.date,
      items: formData.items.map((item) => ({
        product: parseInt(item.product),
        quantity: parseInt(item.quantity),
        unit_cost: parseFloat(item.unit_cost),
      })),
    };

    dispatch(addPurchase(payload)).then((res) => {
      if (!res.error) {
        toast.success("✅ Purchase added successfully!");
        setFormData({
          vendor: "",
          invoice_no: "",
          date: new Date().toISOString().split("T")[0],
          items: [{ product: "", quantity: 1, unit_cost: "" }],
        });
      } else {
        toast.error("❌ Failed to add purchase. Please try again.");
      }
    });
  };

  // navigate back to vendor purchases page
  const handleClose = () => {
    navigate(`/vendors`);
  };

  return (
    <div className="flex justify-center items-center px-4 py-6 dark:bg-gray-900 min-h-screen">
      <div className="w-full max-w-lg h-[80vh] overflow-y-auto border bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4 relative">
          <h2 className="text-2xl text-center font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            New Purchase
          </h2>

          <RxCross1
            onClick={handleClose}
            className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-black dark:text-gray-300 dark:hover:text-white"
          />

          {/* Vendor Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Vendor
            </label>
            <select
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
              required
            >
              <option value="">Select Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Invoice Number */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Invoice No
            </label>
            <Input
              name="invoice_no"
              value={formData.invoice_no}
              onChange={handleChange}
              placeholder="INV-1001"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Date
            </label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Items */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Items
            </h3>
            {formData.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg dark:bg-gray-900 border"
              >
                {/* Product Dropdown */}
                <select
                  name="product"
                  value={item.product}
                  onChange={(e) => handleItemChange(index, e)}
                  className="border rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                {/* Quantity */}
                <Input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  placeholder="Quantity"
                  required
                />

                {/* Unit Cost */}
                <Input
                  type="number"
                  step="0.01"
                  name="unit_cost"
                  value={item.unit_cost}
                  onChange={(e) => handleItemChange(index, e)}
                  placeholder="Unit Cost"
                  required
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={addItemRow}
            >
              + Add Item
            </Button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full flex items-center justify-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white font-semibold shadow hover:opacity-90"
          >
            {purchaseLoading || productLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Save Purchase"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
