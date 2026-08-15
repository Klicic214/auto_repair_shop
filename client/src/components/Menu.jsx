import { Link } from 'react-router-dom';

export default function Menu() {
  return (
    <nav style={styles.sidebar}>
      <div style={styles.brand}>
        <strong>Auto Repair Shop</strong>
      </div>
      <div style={styles.links}>
        <Link to="/customers" style={styles.link}>Customers</Link>
        <Link to="/work-orders" style={styles.link}>Work Orders</Link>
        <Link to="/inventory" style={styles.link}>Inventory</Link>
      </div>
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