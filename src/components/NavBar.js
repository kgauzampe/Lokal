import { Link } from "react-router-dom";
import "../styles/NavBar.scss";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        🔧 Lokal
      </div>

      <ul className="navbar__links">
        <li><Link to="/">Home</Link></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
}
