import { Trash2, Edit2, ArrowUpDown, MoreHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletenewProduct, fetchnewProducts } from "../../../../store/newproductSlice";
import { Link, Outlet } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaSalesforce } from "react-icons/fa";

const ProductsTable = () => {
  const dispatch = useDispatch();
  const { data: newproducts, loading, error } = useSelector(
    (state) => state.newProducts
  );

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchnewProducts());
  }, [dispatch]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
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

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page on search/sort
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortField, sortOrder]);

  return (
    <div className="p-4 sm:p-6 dark:bg-gray-900 min-h-screen font-nunito">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64 flex justify-center items-center gap-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Products..."
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
          />
        </div>
        <div className="flex gap-3 items-center w-full sm:w-auto">
          <Link to="/product-form">
            <button className="py-2 px-5 rounded text-sm font-semibold text-white bg-amber-400 hover:bg-amber-600 transition shadow-md">
              + Add
            </button>
          </Link>

          <Link to={`/saleFrom/${ProductsTable.id}`}>
            <button className="flex py-2 px-5 rounded text-sm font-semibold text-white bg-amber-400 hover:bg-amber-600 transition shadow-md">
              <FaSalesforce className="h-4 w-4 mr-2" /> <span>Sale</span>
            </button>
          </Link>
          {selectedProducts.length > 0 && (
            <button
              className="py-2 px-4 rounded text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition shadow-md"
              onClick={() => {
                if (
                  window.confirm(`Delete ${selectedProducts.length} products?`)
                ) {
                  selectedProducts.forEach((id) =>
                    dispatch(deletenewProduct(id))
                  );
                  setSelectedProducts([]);
                }
              }}
            >
              Delete Selected ({selectedProducts.length})
            </button>
          )}
        </div>
      </div>

      <hr className="mb-6 border-gray-300 dark:border-gray-700" />

      {loading && <p className="mt-4 text-gray-500">Loading products...</p>}
      {error && <p className="mt-4 text-red-500">Error: {error}</p>}

      <div className="overflow-x-auto shadow rounded">
        <table className="min-w-full border-collapse bg-white dark:bg-gray-800">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    selectedProducts.length === filteredProducts.length &&
                    filteredProducts.length > 0
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              {[
                { key: "image", label: "Image" },
                { key: "name", label: "Name" },
                { key: "category", label: "Category" },
                { key: "price", label: "Unit Price" },
                { key: "quantity", label: "Quantity" },
                { key: "total", label: "Total Price" },
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
                  className={`px-4 py-3 text-left font-semibold ${
                    col.key !== "actions" && col.key !== "image"
                      ? "cursor-pointer"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.key !== "actions" && col.key !== "image" && (
                      <ArrowUpDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedProducts.map((product) => (
              <tr
                key={product.id}
                className={`transition ${
                  selectedProducts.includes(product.id)
                    ? "bg-amber-100 dark:bg-amber-900"
                    : product.quantity <= 4
                    ? "bg-red-100 dark:bg-red-900" // ✅ Low stock row highlight
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleSelect(product.id)}
                  />
                </td>
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
                <td className="px-4 py-3">{product.category || "General"}</td>
                <td className="px-4 py-3">Rs. {product.price}</td>

                {/* ✅ Quantity with Low Stock Badge */}
                <td className="px-4 py-3 text-center">
                  {product.quantity <= 4 ? (
                    <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">
                      Low ({product.quantity})
                    </span>
                  ) : (
                    product.quantity
                  )}
                </td>

                <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">
                  Rs. {product.price * product.quantity || product.price}
                </td>
                <td className="px-4 py-3">{product.branch?.name || "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full
      ${
        product.is_active
          ? "bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300"
          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
      }`}
                  >
                    {product.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <Link to={`/updateproduct/${product.id}`}>
                        <DropdownMenuItem>
                          <Edit2 className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                      </Link>

                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => {
                          if (window.confirm("Delete this product?")) {
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
                  colSpan={12}
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center gap-2 mt-4">
        <buttons
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          <IoIosArrowBack />
        </buttons>

        <span className="px-3 py-1 text-gray-700 dark:text-gray-200">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          <IoIosArrowForward />
        </button>
      </div>

      <Outlet />
    </div>
  );
};

export default ProductsTable;
