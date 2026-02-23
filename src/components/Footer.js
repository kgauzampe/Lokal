import "../styles/Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Lokal</p>
      <p>Powered By Mpumelelo Tech Solutions</p>
    </footer>
  );
}
