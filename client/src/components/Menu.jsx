import { useLocation, Link } from "react-router-dom";

export default function Menu() {
  const location = useLocation();

  const hideOnPaths = ["/", "/login", "/register", "/reset"];

  if (hideOnPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <nav style={styles.sidebar}>
      <h2>Auto Repair Shop</h2>
      <Link to="/customers" style={styles.link}>Customers</Link>
      <Link to="/vehicles" style={styles.link}>Vehicles</Link>
      <Link to="/appointments" style={styles.link}>Appointments</Link>
      <Link to="/parts" style={styles.link}>Inventory</Link>
      <Link to="/suppliers" style={styles.link}>Suppliers</Link>


      <Link style={styles.link} to="/"> Log out</Link>
    </nav>
  );
}

const styles = {
  sidebar: {
    width: '240px',
    minHeight: '100vh',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    boxSizing: 'border-box',
    borderRight: '1px solid #334155',
  },
  brand: {
    fontSize: '1.1rem',
    paddingBottom: '16px',
    borderBottom: '1px solid #334155',
    paddingRight: '20px',
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  link: {
    color: '#FFFFFF',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '8px 12px',
    borderRadius: '4px',
    display: 'block',
  },
};