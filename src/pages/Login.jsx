import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://retailm.pythonanywhere.com/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      console.log("Login status:", response.status);
      const data = await response.json();
      console.log("Login response data:", data);

      if (!response.ok) {
        alert(data.detail || "Login failed!");
        return;
      }

      const { access, refresh } = data;

      if (access && refresh) {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("user", JSON.stringify({ username }));

        console.log("✅ Logged-in user:", username);
        navigate("/"); // redirect to dashboard
      } else {
        alert("Login failed!");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-yellow-100 to-yellow-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-yellow-700">
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
            className="mt-1 text-gray-600 border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-yellow-400 outline-none"
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
            className="mt-1 border text-gray-600 border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-yellow-400 outline-none"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
