// src/components/vendors/VendorTable.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteVendor, fetchVendors } from "../../store/slices/vendorSlice";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function VendorTable({ onAddClick }) {
  const dispatch = useDispatch();
  const { vendors } = useSelector((state) => state.vendors);
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 6;

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      dispatch(deleteVendor(id));
    }
  };

  // Pagination Logic
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = vendors.slice(indexOfFirstVendor, indexOfLastVendor);
  const totalPages = Math.ceil(vendors.length / vendorsPerPage);

  return (
    <div className="p-4 md:p-6  dark:bg-gray-900 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          Vendors
        </h2>

        <div className="flex flex-wrap gap-3">
          <Link to="/vendors-add">
            <Button
              onClick={onAddClick}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium shadow hover:from-yellow-500 hover:to-yellow-700 transition rounded"
            >
              + Add Vendor
            </Button>
          </Link>

          <Link
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium shadow hover:from-yellow-500 hover:to-yellow-700 transition rounded px-3 py-1"
            to={`/vendor-purchases/${vendors.length > 0 ? vendors[0].id : ""}`}
          >
            <Loader2 size={16} /> <span>Purchases</span>
          </Link>
        </div>
      </div>

      {/* Vendors Table */}
      {vendors.length > 0 ? (
        <div className="overflow-x-auto">
          <Table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
            <TableHeader className="bg-gray-100 dark:bg-gray-800">
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentVendors.map((vendor, index) => (
                <TableRow
                  key={vendor.id}
                  className="hover:bg-yellow-50 dark:hover:bg-gray-700 transition"
                >
                  <TableCell className="text-gray-800 dark:text-gray-200">
                    {indexOfFirstVendor + index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-gray-800 dark:text-gray-100">
                    {vendor.name}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {vendor.email || "-"}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {vendor.phone || "-"}
                  </TableCell>
                  <TableCell className="flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Pencil size={16} /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(vendor.id)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                        >
                          <Trash2 size={16} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No vendors found
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>

          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
              className={
                currentPage === i + 1 ? "bg-yellow-500 text-white" : ""
              }
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
