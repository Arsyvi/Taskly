import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { ClipLoader } from "react-spinners";
import logo from "../assets/logo.webp";
import { User, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowConfirmationPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== passwordConfirmation) {
      toast.error("Konfirmasi Password mu tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      toast.success("Login Berhasil");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const errors = error.response?.data?.message?.erros;
      const message =
        errors?.email?.[0] ||
        errors?.password?.[0] ||
        error.response?.data?.message ||
        error.message ||
        "Registrasi Gagal. Coba lagi";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="box-register">
      <div className="logo">
        <img src={logo} alt="Logo Taskly" />
      </div>

      <div className="header">
        <h1 className="title">Buat akun mu</h1>
      <p className="subtitle">Mulai mengatur tugas mu</p>
      </div>
      
      <form className="form-register" onSubmit={handleSubmit}>
        <div className="box-name">
          <label htmlFor="name" className="lbl-name">
            Name
          </label>
          <div className="input-name">
            <input
              type="text"
              id="nama"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="User Example"
              required
            />
            <User size={24} />
          </div>
        </div>

        <div className="box-email">
          <label htmlFor="email" className="lbl-email">
            Email
          </label>
          <div className="input-email">
            <input
              type="text"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="user@example.com"
              required
            />
            <Mail size={24} />
          </div>
        </div>

        <div className="box-password">
          <label htmlFor="password" className="lbl-password">
            Password
          </label>
          <div className="input-password">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              min={8}
              placeholder="••••••"
              required
            />
            <button
              type="button"
              className="btn-mata"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
            </button>
          </div>
        </div>

        <div className="box-cpassword">
          <label htmlFor="cpassword" className="lbl-cpassword">
            Confirm Password
          </label>
          <div className="input-cpassword">
            <input
              type={showPasswordConfirmation ? "text" : "password"}
              id="cpassword"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              min={8}
              placeholder="••••••"
              required
            />
            <button
              type="button"
              className="btn-mata"
              onClick={() =>
                setShowConfirmationPassword(!showPasswordConfirmation)
              }
            >
              {showPasswordConfirmation ? <Eye size={24} /> : <EyeOff size={24} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-register">
          {loading ? (
            <ClipLoader
              size={16}
              color="#ffffff"
              aria-label="Memproses Register.."
            />
          ) : (
            <span >Create Account <ArrowRight /></span>
          )}
        </button>
      </form>

      <p className="footer-register">
        Sudah punya akun? <Link className="to-login" to="/login">Login</Link>
      </p>
    </div>
  );
}
