import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/customers`);
      const data = await response.json();
      if (response.ok) {
        setCustomers(data.customers || []);
      } else {
        setErrorMessage(data.message || "Failed to fetch customers");
      }
    } catch (err) {
      setErrorMessage("Cannot connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(data.message || "Failed to delete customer");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2>Customer Management</h2>
        <button
          onClick={() => navigate("/regCustomer")}
          style={styles.addButton}
        >
          + Add New Customer
        </button>
      </div>

      {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      {loading ? (
        <p style={styles.message}>Loading customers...</p>
      ) : customers.length === 0 ? (
        <p style={styles.message}>No customers found in the database.</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Customer ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} style={styles.tableRow}>
                <td style={styles.td}>{c.id}</td>
                  <td style={styles.td}>
                    {c.first_name} {c.last_name}
                  </td>
                  <td style={styles.td}>{c.phone}</td>
                  <td style={styles.td}>{c.email}</td>
                  <td style={styles.td}>{c.address || "-"}</td>
                  <td style={styles.td}>
                    <button onClick={() => navigate(`/regVehicle?customerId=${c.id}`)} style={styles.vehicleButton}>
                        + Vehicle
                        </button>
                    <button onClick={() => handleDelete(c.id)} style={styles.deleteButton}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    color: "#fff",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },
  addButton: {
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: "16px",
  },
  message: {
    marginTop: "12px",
  },
  tableContainer: {
    background: "#1e293b",
    borderRadius: "8px",
    overflowX: "auto",
    padding: "16px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeaderRow: {
    borderBottom: "1px solid #334155",
    textAlign: "left",
  },
  th: {
    padding: "12px 8px",
    color: "#94a3b8",
    fontWeight: "600",
  },
  tableRow: {
    borderBottom: "1px solid #334155",
  },
  td: {
    padding: "12px 8px",
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};