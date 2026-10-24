import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.webp";
import { User, LockKeyhole, Eye, ArrowRight, EyeOff } from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function Login() {
  const [akun, setAkun] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await login({ akun, password });
      toast.success("Login Berhasil!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Gagal. Periksa koneksi anda",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page-wrapper">
      <main className="box-login">
        <div className="logo">
          <img src={logo} alt="Taskly Logo" />
        </div>
        <div className="header">
          <h1 className="title">Taskly</h1>
          <h2 className="subtitle">Welcome Back</h2>
          <p>Login untuk kelola tugas mu</p>
        </div>

        <hr />

        <form onSubmit={handleSubmit} className="form-login">
          <div className="box-akun">
            <label htmlFor="akun">Akun atau Email</label>
            <div className="input-akun">
              <User size={22} />
              <input
                type="text"
                name="akun"
                id="akun"
                value={akun}
                onChange={(event) => setAkun(event.target.value)}
                autoComplete="username"
                placeholder="nama atau email"
                required
              />
            </div>
          </div>

          <div className="box-password">
            <label className="lbl-pw" htmlFor="password">
              Password
              <Link className="forgot-password" to="/">
                Forgot Password?
              </Link>
            </label>

            <div className="input-password">
              <LockKeyhole size={22} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="Masukan Password kamu"
                required
              />
              <button
                type="button"
                className="btn-mata"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
              </button>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <ClipLoader
                  size={16}
                  color="#ffffff"
                  aria-label="Memproses Login.."
                />
              ) : (
                <span>
                  Login <ArrowRight size={18} />
                </span>
              )}
            </button>
          </div>
        </form>

        <p className="footer-login">
          Belum Punya Akun?{" "}
          <Link className="to-register" to="/register">
            Register
          </Link>
        </p>
      </main>
    </div>
  );
}
