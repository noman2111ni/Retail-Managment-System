import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchnewProducts } from "../../../../store/newproductSlice";

const API_SALES = "https://retailm.pythonanywhere.com/api/sales/";

const SaleForm = () => {
  const dispatch = useDispatch();
  const { data: products = [], error } = useSelector(
    (state) => state.newProducts
  );

  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    price: "",
    payment_method: "Cash",
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });

  // Fetch products from API via Redux
  useEffect(() => {
    dispatch(fetchnewProducts());
  }, [dispatch]);

  // Input change handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit handler (API call)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ type: "", message: "" });

    try {
      const response = await axios.post(API_SALES, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      console.log("Sale Created:", response.data);
      setNotification({
        type: "success",
        message: "✅ Sale added successfully!",
      });

      // Reset form
      setFormData({
        product: "",
        quantity: "",
        price: "",
        payment_method: "Cash",
      });
    } catch (error) {
      console.error("❌ Error creating sale:", error);
      setNotification({
        type: "error",
        message: "❌ Failed to add sale. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        New Sale
      </h2>

      {/* Notification */}
      {notification.message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            notification.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {notification.message}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Product Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Product
          </label>
          <select
            name="product"
            value={formData.product}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Stock: {p.stock})
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Payment Method
          </label>
          <select
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Credit">Credit</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-2 rounded-xl font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Sale"}
        </button>
      </form>
    </div>
  );
};

export default SaleForm;
