import { Navigate, useParams } from "react-router-dom";
import ClientDashboard from "../ClientDashboard/ClientDashboard";
import SalesmanDashboard from "../SalesmanDashboard/SalesmanDashboard";

export default function RoleBasedHome() {
  const { slug } = useParams();
  const user_type = localStorage.getItem("user_type");

  if (user_type === "A") {
    return <Navigate to={`/${slug}/device-list`} replace />;
  }

  if (user_type === "C") {
    return <ClientDashboard />;
  }

  if (user_type === "S") {
    return <SalesmanDashboard />;
  }

  return <Navigate to="/" replace />;
}
