import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = () => {
  const token = Cookies.get("UserID"); // Check if token exists

  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
