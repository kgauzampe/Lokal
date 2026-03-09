import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import "./Auth.scss";

export default function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // login | register
  const [role, setRole] = useState("client"); // client | provider
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = form;

    try {
      // REGISTER
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role, // Step 3: store role metadata
            },
          },
        });

        if (error) throw error;

        const user = data.user;

        // Step 4: update profile table
        if (user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              full_name: name,
              role: role,
            })
            .eq("id", user.id);

          if (profileError) throw profileError;
        }

        setErrorMessage("");
        setSuccessMessage("Registration successful! Please check your email.");
        setMode("login");

      } else {
        // LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          setSuccessMessage("");
          return;
        }

        const user = data.user;

        // Step 5: get role from profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        setErrorMessage("");
        setSuccessMessage("Welcome back!");

        // redirect based on role
        if (profile.role === "provider") {
          navigate("/provider-dashboard");
        } else {
          navigate("/client-dashboard");
        }
      }

    } catch (err) {
      setErrorMessage(err.message);
      setSuccessMessage("");
    }
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

          {errorMessage && <p className="auth-error">{errorMessage}</p>}
          {successMessage && <p className="auth-success">{successMessage}</p>}
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

