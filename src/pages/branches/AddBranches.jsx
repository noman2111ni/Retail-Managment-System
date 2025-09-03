import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    setSlideIn(true);
  }, []);

  const handleChange = (e) => {
    setBranchData({ ...branchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addBranch(branchData)).then((res) => {
      if (!res.error) {
        navigate("/pos/product-form");
      }
    });
  };

  return (
    <div className="relative">
      <div className="fixed inset-0 flex justify-center items-center bg-black/30 dark:bg-black/50 backdrop-blur-sm z-40">
        <form
          onSubmit={handleSubmit}
          className={`w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-transform duration-500 ${slideIn ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* Close Button */}
          <RxCross1
            onClick={() => navigate("/pos/product-form")}
            className="absolute top-5 right-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-red-500 transition-colors"
          />

          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Add Branch
          </h2>


          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={branchData.name}
              onChange={handleChange}
              placeholder="Branch Name"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="text"
              name="location"
              value={branchData.location}
              onChange={handleChange}
              placeholder="Branch Address"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="number"
              name="phone"
              value={branchData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="email"
              name="email"
              value={branchData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            {error && <p className="text-red-500 dark:text-red-400">{error}</p>}

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-400 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Branch"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBranchForm;
