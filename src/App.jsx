import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Protected */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
