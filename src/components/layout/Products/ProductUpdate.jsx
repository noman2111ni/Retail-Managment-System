// src/pages/products/ProductUpdate.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchnewProducts, updatenewProduct } from "../../../../store/newproductSlice";
import { fetchBranches } from "../../../../store/slices/branchSlice";
import { RxCross1 } from "react-icons/rx";

const ProductUpdate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: products } = useSelector((state) => state.newProducts);
    const { data: branches } = useSelector((state) => state.branches);

    const product = products.find((p) => p.id === parseInt(id));

    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category: "",
        price: "",
        quantity: "",
        barcode: "",
        branch: "",
        is_active: true,
    });

    // Fetch products & branches if not already loaded
    useEffect(() => {
        if (!products.length) dispatch(fetchnewProducts());
        if (!branches.length) dispatch(fetchBranches());
    }, [dispatch, products.length, branches.length]);

    // Prefill form when product is available
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                sku: product.sku,
                category: product.category || "",
                price: product.price,
                quantity: product.quantity,
                barcode: product.barcode || "",
                branch: product.branch?.id || "",
                is_active: product.is_active,
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updatenewProduct({ id, data: formData }));
        navigate("/pos"); // redirect back to products list
    };

    const handleCross = () => navigate("/pos");

    if (!product) return <p className="p-4">Loading product...</p>;

    return (
        <div className="dark:bg-gray-900 min-h-screen font-nunito flex items-start justify-center pt-6">
            <form
                onSubmit={handleSubmit}
                className="max-w-xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4 relative"
            >
                <RxCross1
                    onClick={handleCross}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                />
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent text-center">
                    Update Product
                </h1>

                <div className="flex gap-4">
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded border dark:border-gray-700 focus:ring-2 focus:ring-amber-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">SKU</label>
                        <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded border dark:border-gray-700 focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded border dark:border-gray-700 focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded border dark:border-gray-700 focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded border dark:border-gray-700 focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Barcode</label>
                        <input
                            type="text"
                            name="barcode"
                            value={formData.barcode}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded border dark:border-gray-700 focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                    </div>
                </div>

                {/* Branch Dropdown */}
                <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Branch</label>
                    <select
                        name="branch"
                        value={formData.branch || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                    >
                        <option value="" disabled className="text-gray-500 dark:text-gray-400">
                            Select a branch
                        </option>
                        {branches.map((b) => (
                            <option
                                key={b.id}
                                value={b.id}
                                className="text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                            >
                                {b.name}
                            </option>
                        ))}
                    </select>
                </div>


                {/* Active Checkbox */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="text-yellow-400"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Active</span>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-amber-400 hover:bg-amber-600 text-white font-semibold rounded shadow-md transition"
                >
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default ProductUpdate;
