import logo from "../assets/logo.webp";
import { NavLink } from "react-router-dom";
import { LogOut, CircleUser, LayoutDashboard, CheckSquare } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

function Navbar() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Logout gagal di server, sesi lokal sudah dihapus",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <nav className="navbar" aria-label="Main navigation">
        <div className="nav-1">
          <NavLink to="/dashboard" className="logo-brand-link">
            <div className="logo-nav">
              <img src={logo} alt="Taskly Logo" />
            </div>
            <h2 className="title">Taskly</h2>
          </NavLink>
          <ul className="nav-links-desktop">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="lbl-nav">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tasks"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="lbl-nav">Tasks</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="nav-2">
          <div className="profil" title={user?.name ?? "User"}>
            <CircleUser color="#2563eb" size={24} />
            <span className="username">{user?.name ?? "User"}</span>
          </div>
          <button
            onClick={handleClick}
            disabled={loading}
            className="btn-logout"
            aria-label="Log out"
          >
            {loading ? (
              <span className="loading-logout">
                <ClipLoader
                  size={16}
                  color="#ef4444"
                  aria-label="Logging out"
                />
               <span className="logout-label">Logging out</span>
              </span>
            ) : (
              <span>
                <LogOut size={18} />
                <span className="logout-label">Logout</span>
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Modern Bottom Navigation for Mobile */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? "active" : ""}`
          }
        >
          <CheckSquare size={20} />
          <span>Tasks</span>
        </NavLink>
      </nav>
    </>
  );
}

export default Navbar;
