import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
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
  );
}

export default App;
