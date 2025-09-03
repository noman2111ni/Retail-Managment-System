import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateBranch, fetchBranches } from "../../../store/slices/branchSlice";
import { RxCross1 } from "react-icons/rx";

const UpdateBranch = () => {
  const { id } = useParams(); // branch id from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: branches, loading } = useSelector((state) => state.branches);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    email: ""
  });

  // Fetch branches if not already loaded
  useEffect(() => {
    if (branches.length === 0) {
      dispatch(fetchBranches());
    }
  }, [dispatch, branches]);

  // Prefill form when branch is found
  useEffect(() => {
    const branch = branches.find((b) => String(b.id) === String(id));
    if (branch) {
      setFormData({
        name: branch.name || "",
        phone: branch.phone || "",
        location: branch.location || "",
        email: branch.email || ""
      });
    }
  }, [branches, id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateBranch({ id, branchData: formData }))
      .unwrap()
      .then(() => {
        navigate("/branches"); // redirect after success
      })
      .catch((err) => {
        console.error("Update failed:", err);
      });
  };

  return (
    <div className="relative">
      <div className=" flex justify-center items-center p-3 z-40">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-96 space-y-3  relative border border-gray-200 dark:border-gray-700"
        >
          {/* Close Button */}
          <RxCross1
            onClick={() => navigate("/branches")}
            className="absolute top-5 right-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-red-500 transition-colors"
          />

          {/* Title */}
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent animate-gradient-x ">
            Update Branch
          </h2>


          {/* Branch Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Branch Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter branch name"
              required
              className="mt-1 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone
            </label>
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              className="mt-1 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full  outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter branch location"
              required
              className="mt-1 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full  outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter branch location"
              required
              className="mt-1 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full  outline-none"
            />
          </div>

          {/* Update Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white py-2 rounded-lg font-semibold transition duration-300 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Branch"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBranch;
