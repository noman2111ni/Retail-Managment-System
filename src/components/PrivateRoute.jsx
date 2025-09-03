// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute({ children }) {
  const { accessToken } = useSelector((state) => state.auth);

  // Agar login hai → show dashboard (children), warna → redirect login
  return accessToken ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
