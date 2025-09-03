import { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

export default function AddOrderPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    customer: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    status: "Pending",
    payment: "Cash",
    items: [],
    total: 0,
  });
  const [newItem, setNewItem] = useState({ name: "", qty: 1, price: 0 });
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);
  const handleAddItem = () => {
    if (!newItem.name || newItem.price <= 0) return;
    const updatedItems = [...order.items, newItem];
    const updatedTotal = updatedItems.reduce((sum, item) => sum + item.qty * item.price, 0);
    setOrder({ ...order, items: updatedItems, total: updatedTotal });
    setNewItem({ name: "", qty: 1, price: 0 });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = order.items.filter((_, i) => i !== index);
    const updatedTotal = updatedItems.reduce((sum, item) => sum + item.qty * item.price, 0);
    setOrder({ ...order, items: updatedItems, total: updatedTotal });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order Created:", order);
    alert("✅ Order Created Successfully!");
  };

  const navigatePage = () => {
    navigate("/orders");
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900/60 backdrop-blur-sm z-50">
      <div
        className={`relative w-full sm:w-3/4 lg:w-1/2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 transition-all duration-500 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            ➕ Create New Order
          </h1>
          <RxCross1
            onClick={navigatePage}
            className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-red-500 transition"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                Customer Name
              </label>
              <input
                type="text"
                value={order.customer}
                onChange={(e) => setOrder({ ...order, customer: e.target.value })}
                className="mt-1 w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Sara Ahmed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                Payment Method
              </label>
              <select
                value={order.payment}
                onChange={(e) => setOrder({ ...order, payment: e.target.value })}
                className="mt-1 w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option>Cash</option>
                <option>Card</option>
                <option>Digital Wallet</option>
              </select>
            </div>
          </div>

          {/* Add Items */}
          <div className="border p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="font-semibold mb-4 text-gray-800 dark:text-gray-200 text-lg">
              🛒 Order Items
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <input
                type="text"
                placeholder="Item Name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="p-3 border rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                min="1"
                placeholder="Qty"
                value={newItem.qty}
                onChange={(e) => setNewItem({ ...newItem, qty: Number(e.target.value) })}
                className="p-3 border rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                min="0"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                className="p-3 border rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
            >
              ➕ Add Item
            </button>

            {/* Items Table */}
            {order.items.length > 0 && (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-blue-100 dark:bg-gray-700">
                    <tr>
                      <th className="p-3 text-left">Item</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Subtotal</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, i) => (
                      <tr
                        key={i}
                        className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <td className="p-3">{item.name}</td>
                        <td className="p-3 text-center">{item.qty}</td>
                        <td className="p-3 text-right">Rs. {item.price}</td>
                        <td className="p-3 text-right">Rs. {item.qty * item.price}</td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(i)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="p-3 font-semibold text-right">
                        Total:
                      </td>
                      <td className="p-3 text-right font-bold text-green-600">
                        Rs. {order.total}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow hover:opacity-90 transition"
          >
            ✅ Create Order
          </button>
        </form>
      </div>
    </div>
  );
}
