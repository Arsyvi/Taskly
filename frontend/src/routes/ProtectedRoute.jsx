import { Navigate, Outlet } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../hooks/useAuth";
import { ShieldCheck } from "lucide-react";

export default function ProtectedRoute() {
    const {user, loading} = useAuth()

    if(loading) {
        return (
            <div className="loading-state" role="status" aria-label="Memeriksa Autentikasi">
            <ShieldCheck className="icon" size={60} />
            <h1 className="title">Memeriksa sesi kamu</h1>
            <h4 className="subtitle">Memastikan akun kamu aman sebelum melanjutkan</h4>
            <div className="loading-spinner">
                <ClipLoader size={34} color="#0EA5C9" />
            <p>Memeriksa Sesi..</p>
            </div>
            
        </div>
        )
    }
    if(!user) {
        return(
            <Navigate to="/login" replace />
        )
    }

    return <Outlet />
}