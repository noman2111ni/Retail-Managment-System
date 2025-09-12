import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBranch } from "../../../store/slices/branchSlice";

const AddBranchForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.branches);

  const [branchData, setBranchData] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    setBranchData({ ...branchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addBranch(branchData)).then((res) => {
      if (!res.error) {
        navigate("/product-form");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 p-2 sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl relative 
                   p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700 
                   rounded-lg  overflow-y-auto"
      >
        {/* Close Button */}
        <RxCross1
          onClick={() => navigate("/product-form")}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-red-500 transition-colors"
        />

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 
                       bg-gradient-to-r from-yellow-400 to-amber-500 
                       bg-clip-text text-transparent">
          Add Branch
        </h2>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={branchData.name}
            onChange={handleChange}
            placeholder="Branch Name"
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md 
                       bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                       focus:ring-2 focus:ring-amber-400 outline-none text-sm sm:text-base"
            required
          />
          <input
            type="text"
            name="location"
            value={branchData.location}
            onChange={handleChange}
            placeholder="Branch Address"
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md 
                       bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                       focus:ring-2 focus:ring-amber-400 outline-none text-sm sm:text-base"
            required
          />
          <input
            type="number"
            name="phone"
            value={branchData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md 
                       bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                       focus:ring-2 focus:ring-amber-400 outline-none text-sm sm:text-base"
            required
          />
          <input
            type="email"
            name="email"
            value={branchData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md 
                       bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                       focus:ring-2 focus:ring-amber-400 outline-none text-sm sm:text-base"
            required
          />

          {error && <p className="text-red-500 dark:text-red-400">{error}</p>}

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 
                         hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold 
                         transition-colors disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Branch"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBranchForm;
