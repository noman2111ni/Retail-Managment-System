import React, { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranches } from "../../../../store/slices/branchSlice";
import { addnewProduct } from "../../../../store/newproductSlice";

const ProductForm = ({ product = null }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux: branches & products
  const branches = useSelector((state) => state.branches.data || []);
  const { loading, error } = useSelector((state) => state.newProducts);

  // Form state
  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    price: product?.price || "",
    barcode: product?.barcode || "",
    quantity: product?.quantity || "",
    branch_id: product?.branch?.id || "", // backend expects branch_id
    is_active: product?.is_active ?? true,
    description: product?.description || "",
    category: product?.category || "",
    brand: product?.brand || "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(product?.image || null);

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) data.append(key, formData[key]);
      }

      await dispatch(addnewProduct(data)).unwrap();
      alert("Product saved successfully!");
      navigate("/pos");
    } catch (err) {
      alert("Failed to save product: " + err);
    }
  };

  const crosshandle = () => navigate("/pos");

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
  <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-xl relative overflow-y-auto overflow-x-hidden max-h-[90vh] p-8 scrollbar-none">
        <RxCross1
          onClick={crosshandle}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 cursor-pointer transition"
        />
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Name & SKU */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-amber-400 outline-none transition shadow-sm"
              required
            />
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="SKU"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-amber-400 outline-none transition shadow-sm"
              required
            />
          </div>

          {/* Price & Barcode */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-amber-400 outline-none transition shadow-sm"
              required
            />
            <input
              type="text"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="Barcode"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-amber-400 outline-none transition shadow-sm"
            />
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-amber-400 outline-none transition shadow-sm"
            />
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Brand"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-amber-400 outline-none transition shadow-sm"
            />
          </div>

          {/* Quantity */}
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-amber-400 outline-none transition shadow-sm"
          />

          {/* Branch Select */}
          <div className="flex gap-2 items-center">
            <select
              name="branch_id"
              value={formData.branch_id}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-amber-400 outline-none transition shadow-sm"
              required
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} ({branch.location})
                </option>
              ))}
            </select>
            <Link to="/pos/add-branch">
              <button type="button" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition shadow">
                +
              </button>
            </Link>
          </div>

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-amber-400 outline-none transition shadow-sm resize-none"
            rows={3}
          />

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-md shadow-md"
              />
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-amber-400 outline-none transition shadow-sm"
            />
          </div>

          {/* Active Checkbox */}
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="accent-amber-500"
            />
            Active
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition shadow-md disabled:opacity-50"
          >
            {loading ? "Saving..." : product ? "Update" : "Add"} Product
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
