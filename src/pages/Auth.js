import { useState } from "react";
import "./Auth.scss";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | register
  const [role, setRole] = useState("client"); // client | provider

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      role
    };

    if (mode === "login") {
      console.log("LOGIN:", payload);
    } else {
      console.log("REGISTER:", payload);
    }

    // Later → send to backend
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{mode === "login" ? "Sign In" : "Create Account"}</h2>

        {/* Role Selector */}
        <div className="role-switch">
          <button
            className={role === "client" ? "active" : ""}
            onClick={() => setRole("client")}
          >
            Client
          </button>
          <button
            className={role === "provider" ? "active" : ""}
            onClick={() => setRole("provider")}
          >
            Service Provider
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {mode === "login" ? "Sign In" : "Register"}
          </button>
        </form>

        <p className="switch-text">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setMode("register")}>Register</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setMode("login")}>Sign In</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
