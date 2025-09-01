import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import sideLogo from "../../../assets/Background.png";
import "./Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name: userName,
      email,
      password,
      role: isAdmin ? "admin" : "user",
    };

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData), 
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Request failed");
      }

      const data = await res.json();
      console.log("✅ Registered:", data);

      alert("Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      console.error("❌ Error:", err.message);
    }
  };

  return (
    <div className="signup-container">
      <img className="backimg" src={sideLogo} alt="background" />
      <div className="signup-card">
        <div className="signup-left">
          <h1 className="signup-title">Register</h1>
          <form className="signup-form" onSubmit={handleSubmit}>
            <label htmlFor="userName">Username</label>
            <input
              className="signup-input"
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              className="signup-input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              className="signup-input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="admin-checkbox">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <label>Register as Admin</label>
            </div>

            <button className="sub-Btn" type="submit">
              Sign Up
            </button>
          </form>

          <p className="signin-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
