import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/NavBar.scss";

export default function NavBar() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img src="/img/logo.png" alt="Lokal logo" />
      </div>

      {session && <Link to="/">Services</Link>}
      {session && <Link to="/dashboard">Dashboard</Link>}
      {!session && <Link to="/auth">Login</Link>}
    </nav>
  );
}
