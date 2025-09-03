import React, { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiMapPin, FiPhone, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBranch, fetchBranches } from '../../../store/slices/branchSlice';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from 'lucide-react';
const BranchesPage = () => {
  const dispatch = useDispatch();
  const { data: branches = [], } = useSelector(state => state.branches);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {

    dispatch(fetchBranches());

  }, [dispatch]);

  //deletebranhces

  const onDelete = (id) => {
    dispatch(deleteBranch(id))
      .unwrap()
      .then(() => toast.success("Branch deleted successfully"))
      .catch(() => toast.error("Failed to delete branch"));
  };

  // update branch


  // Filter branches safely
  const filteredBranches = branches.filter(branch => {
    const name = branch?.name?.toLowerCase() || '';
    const address = branch?.address?.toLowerCase() || '';
    const manager = branch?.manager?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return name.includes(term) || address.includes(term) || manager.includes(term);
  });

  // Pagination settings
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBranches = filteredBranches.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Stats
  const totalCities = [...new Set(branches.map(branch => branch.city))].length;
  const totalCountries = [...new Set(branches.map(branch => branch.country))].length;
  const totalManagers = [...new Set(branches.map(branch => branch.manager))].length;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Branches Management
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm md:text-base">
            Manage all your company branches in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Branches */}
              <div className="dark:bg-gray-800 rounded-lg shadow p-6  hover:shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    <FiMapPin className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{branches.length}</h2>
                    <p className="text-gray-600 dark:text-gray-400">Total Branches</p>
                  </div>
                </div>
              </div>

              {/* Cities */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center  hover:shadow-md">
                <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                  <FiMapPin className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{totalCities}</h2>
                  <p className="text-gray-600 dark:text-gray-400">Total Cities</p>
                </div>
              </div>

              {/* Managers */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center  hover:shadow-md">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                  <FiPhone className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{totalManagers}</h2>
                  <p className="text-gray-600 dark:text-gray-400">Total Managers</p>
                </div>
              </div>

              {/* Countries */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center  hover:shadow-md">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18M9 3v2m6-2v2m-7 4h8m-4 4h4m-8 0h2m-2 4h6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{totalCountries}</h2>
                  <p className="text-gray-600 dark:text-gray-400">Total Countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4 flex flex-col md:flex-row items-center justify-between">
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 dark:text-gray-500"

              />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-900 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Branches Table */}
        <div className=" dark:bg-gray-800  shadow overflow-hidden">
          <div className="overflow-hidden  border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              {/* Header */}
              <thead className="bg-gray-100 dark:bg-gray-800 ">
                <tr>
                  <th className=" px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Branch Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {currentBranches.map((branch) => (
                  <tr
                    key={branch.id}
                    className="hover:bg-gray-50 capitalize dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate(`/branches/${branch.id}`)}
                  >
                    {/* Branch Name + Icon */}
                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center shadow-sm">
                        <FiMapPin className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {branch.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <FiPhone className="mr-1 h-3 w-3" /> {branch.phone || "-"}
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {branch.location || "-"}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {branch.phone || "-"}
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300'>
                      {(branch.email).slice(0, 12) || "-"}
                    </td>
                    {/* Actions */}
                    <td className="py-4 whitespace-nowrap text-center text-sm font-medium -space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          {/* Edit */}
                          <DropdownMenuItem
                            asChild
                          >
                            <Link
                              to={`/branches/update-branch/${branch.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-lg"
                            >
                              <FiEdit2 className="mr-1 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>

                          {/* Delete */}
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(branch.id);
                            }}
                            className="inline-flex items-center px-2 py-1.5 text-xs font-medium rounded-lg text-red-600"
                          >
                            <FiTrash2 className="mr-1 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4   py-4 flex items-center justify-end border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex items-center justify-end space-x-1">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FiChevronLeft />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition ${currentPage === page
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>

        )}
      </div>
      <Outlet />
    </div>
  );
};

export default BranchesPage;
