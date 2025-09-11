// src/components/vendors/AddVendorForm.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addVendor } from "../../../../store/slices/vendorSlice";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

export default function AddVendorForm({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.vendors);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    contact_person: "",
    gst_number: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addVendor(formData)).then((res) => {
      if (!res.error) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          contact_person: "",
          gst_number: "",
          notes: "",
        });
        if (onClose) onClose();
      }
    });
  };

  const handleClose = () => {
    navigate("/vendors");
  };

  return (
    <div className="max-w-lg mx-auto  p-4">
      <form className="relative p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 space-y-5" onSubmit={handleSubmit}>

        {/* Header */}
        <div className="flex justify-between items-center ">
          <div className="flex-grow text-center">
            <h2 className="text-xl text-center font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Add New Vendor
            </h2>
          </div>
          <RxCross1
            onClick={handleClose}
            className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            size={16}
          />
        </div>

        {/* Form Fields */}
        {[
          { label: "Name", name: "name", type: "text", placeholder: "Vendor name", required: true },
          { label: "Email", name: "email", type: "email", placeholder: "vendor@email.com" },
          { label: "Phone", name: "phone", type: "text", placeholder: "+92 300 1234567" },
          { label: "Address", name: "address", type: "text", placeholder: "G.T. Road" },

        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required || false}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none transition focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        ))}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full flex items-center justify-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white font-semibold rounded-lg py-2 hover:opacity-90 transition"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Add Vendor"}
        </Button>
      </form>
    </div>
  );
}
