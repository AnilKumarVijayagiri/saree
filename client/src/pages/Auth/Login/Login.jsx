import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../store/useAuth";
import { api } from "../../../lib/api";
import logo from "../../../assets/Logo.jpg";
import "./Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post('/api/auth/login', credentials);
      await login(data);
      navigate(data.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="login-root">
      <div className="login-container">
        <div className="login-left">
          <img src={logo} alt="Logo" className="login-logo" />

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
            />

            <div className="login-forgot">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button className="login-btn" type="submit">
              Login
            </button>
          </form>

          <div className="login-signup">
            Don’t have an account? <Link to="/register">Sign Up</Link>
          </div>
          <div className="login-policy">
            By logging in, you agree to our <a href="#">Terms of service</a> and{" "}
            <a href="#">Privacy policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
