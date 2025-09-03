import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 🔹 Step 1: Token API call
      const response = await fetch("https://retailm.pythonanywhere.com/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail || "Login failed!");
        return;
      }

      const data = await response.json();
      const { access, refresh } = data;

      if (access && refresh) {
        // Save tokens
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);

        let currentUser = null;

        // 🔹 Step 2a: Try to fetch current user from /me/
        const meRes = await fetch("https://retailm.pythonanywhere.com/api/users/me/", {
          method: "GET",
          headers: { Authorization: `Bearer ${access}` },
        });

        if (meRes.ok) {
          currentUser = await meRes.json();
        } else {
          // 🔹 Step 2b: If /me/ not available, fallback to /users/
          const userRes = await fetch("https://retailm.pythonanywhere.com/api/users/", {
            method: "GET",
            headers: { Authorization: `Bearer ${access}` },
          });

          if (userRes.ok) {
            const users = await userRes.json();
            currentUser = users.find((u) => u.username === username) || null;
          }
        }

        if (currentUser) {
          localStorage.setItem("user", JSON.stringify(currentUser));
          console.log("Logged-in User:", currentUser);
          navigate("/"); // dashboard
        } else {
          alert("Failed to identify current user");
        }
      } else {
        alert("Login failed!");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700">
          Welcome Back 👋
        </h2>
        <p className="text-gray-500 text-center">
          Login to continue to your dashboard
        </p>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
            className="mt-1 text-gray-500 border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            className="mt-1 border text-gray-500 border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-300"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <span className="h-px bg-gray-300 flex-1"></span>
          <span className="text-gray-400 text-sm">OR</span>
          <span className="h-px bg-gray-300 flex-1"></span>
        </div>

        {/* Signup Button */}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
        >
          Create an Account
        </button>
      </form>
    </div>
  );
};

export default Login;
