import { Navigate } from "react-router-dom";
import ZapFlowLoader from "../components/loader";
import { UseAuth } from "./authContext";

export default function ProtectedRoute({ children }) {

    const { isLoading, isLoggedIn } = UseAuth();

    if (isLoading) return <div><ZapFlowLoader/></div>

    return isLoggedIn ? children : <Navigate to={"/signin"} />
}