import "../styles/Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} HandyFinder</p>
      <p>Book trusted professionals near you</p>
    </footer>
  );
}
