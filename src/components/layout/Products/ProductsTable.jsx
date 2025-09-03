import { Trash2, Edit, ArrowUpDown, Edit2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletenewProduct, fetchnewProducts } from "../../../../store/newproductSlice";
import { Link, Outlet } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { FcSalesPerformance } from "react-icons/fc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const ProductsTable = () => {
  const dispatch = useDispatch();
  const { data: newproducts, loading, error } = useSelector(
    (state) => state.newProducts
  );

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

  useEffect(() => {
    dispatch(fetchnewProducts());
  }, [dispatch]);

  // handle sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  // Filter + Sort
  const filteredProducts = [...newproducts]
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="p-4 sm:p-6 dark:bg-gray-900 min-h-screen font-nunito">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <Link to="product-form" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto py-2 px-5 rounded text-sm font-semibold text-white bg-amber-400 hover:bg-amber-600 transition shadow-md">
            + Add Product
          </button>
        </Link>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Products..."
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
          />
        </div>
      </div>

      <hr className="mb-6 border-gray-300 dark:border-gray-700" />

      {/* Loading/Error */}
      {loading && <p className="mt-4 text-gray-500">Loading products...</p>}
      {error && (
        <p className="mt-4 text-red-500">Error loading products: {error}</p>
      )}

      {/* Table */}
      <div className="overflow-x-auto shadow rounded ">
        <table className="min-w-full border-collapse bg-white dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm">
              {[
                { key: "image", label: "Image" },
                { key: "name", label: "Name" },
                { key: "sku", label: "SKU" },
                { key: "category", label: "Category" },
                { key: "price", label: "Price" },
                { key: "quantity", label: "Quantity" },
                { key: "branch", label: "Branch" },
                { key: "is_active", label: "Status" },
                { key: "actions", label: "Actions" },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() =>
                    col.key !== "actions" && col.key !== "image"
                      ? handleSort(col.key)
                      : null
                  }
                  className={`px-4 py-3 text-left font-semibold ${col.key !== "actions" && col.key !== "image"
                    ? "cursor-pointer"
                    : ""
                    }`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.key !== "actions" &&
                      col.key !== "image" && <ArrowUpDown size={14} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-4 py-3">
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md border"
                  />
                </td>
                <td className="px-4 py-3 font-medium capitalize">
                  {product.name}
                </td>
                <td className="px-4 py-3">{product.sku}</td>
                <td className="px-4 py-3">{product.category || "General"}</td>
                <td className="px-4 py-3">Rs. {product.price}</td>
                <td className="px-4 py-3 text-center">{product.quantity}</td>
                <td className="px-4 py-3">{product.branch?.name || "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${product.is_active
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 flex items-center justify-center gap-3 mt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-40">
                      {/* Edit */}
                      <Link to={`/updateproduct/${product.id}`}>
                        <DropdownMenuItem>
                          <Edit2 className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                      </Link>

                      {/* Sale */}
                      <Link to={`/saleFrom/${product.id}`}>
                        <DropdownMenuItem
                          onClick={() => {
                            // yahan aap modal open karwa sakte ho ya new page pe le ja sakte ho
                            // Example: navigate(`/sales/new?product=${product.id}`)
                            console.log("Sale started for product:", product.id);
                          }}
                        >
                          <FcSalesPerformance className="h-4 w-4 mr-2" /> sale
                        </DropdownMenuItem> 
                      </Link>

                      {/* Delete */}
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this product?")) {
                            dispatch(deletenewProduct(product.id));
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                </td>
              </tr>
            ))}

            {!loading && filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Dummy */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <button className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-sm">
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-200">
          Page 1 of 1
        </span>
        <button className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-sm">
          Next
        </button>
      </div>
      <Outlet />
    </div>
  );
};

export default ProductsTable;
