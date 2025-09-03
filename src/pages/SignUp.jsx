import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Cashier",
    branch: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("https://retailm.pythonanywhere.com/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          branch: formData.branch,
          phone: formData.phone,
        }),
      });

      if (response.ok) {
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "Signup failed!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-100 to-green-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-green-700">
          Create Account ✨
        </h2>
        <p className="text-gray-500 text-center">
          Sign up to get started with your dashboard
        </p>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 text-gray-500 border border-gray-300 p-2 rounded-lg w-full"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 text-gray-500 border border-gray-300 p-2 rounded-lg w-full"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 border text-gray-500 border-gray-300 p-2 rounded-lg w-full"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="mt-1 border text-gray-500 border-gray-300 p-2 rounded-lg w-full"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 border text-gray-500 border-gray-300 p-2 rounded-lg w-full"
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Cashier">Cashier</option>
          </select>
        </div>

        {/* Branch */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Branch
          </label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="mt-1 text-gray-500 border border-gray-300 p-2 rounded-lg w-full"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 text-gray-500 border border-gray-300 p-2 rounded-lg w-full"
          />
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition duration-300"
        >
          Sign Up
        </button>

        {/* Already have account */}
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
