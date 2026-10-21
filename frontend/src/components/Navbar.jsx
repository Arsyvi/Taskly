import logo from '../assets/logo.webp'
import { NavLink } from 'react-router-dom'
import { LogOut,CircleUser } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';

function Navbar() {
    const {user, logout} = useAuth();
    const [loading, setLoading] = useState(false)

    async function handleClick() {
        setLoading(true) 
        try {
            await logout()
        }
        catch(error) {
            toast.error(error.response?.data?.message || "Logout gagal di server, sesi lokal sudah dihapus")
        }
        finally {
            setLoading(false)
        }
    }

    return(
            <nav className="navbar">
                <div className="nav-1">
                    <div className="logo-nav">
                        <img src={logo} alt="Taskly" />
                    </div>
                    <h2 className="title">Taskly</h2>
                    <ul>
                        <li>
                            <NavLink to="/dashboard">
                                <span className="lbl-nav">Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/task">
                                <span className="lbl-nav">Tasks</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="nav-2">
                    <div className="profil">
                        <CircleUser color='#2563eb' size={26} />
                        <span className="username"> {user?.name ?? "User" } </span>
                    </div>
                    <button onClick={handleClick} disabled={loading} className="btn-logout">
                       {loading ? <span className='loading-logout'> <ClipLoader size={16} color='#ef4444' aria-label='Logging out' /> Logging Out </span> : <span> <LogOut size={20} /> Log out </span> }
                    </button>
                </div>
            </nav>
    )
}

export default Navbar;