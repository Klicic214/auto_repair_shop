import { useState, useEffect } from "react";
import { API_URL } from "../config/api";
import { Link } from "react-router-dom";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${API_URL}/suppliers`);
      const data = await response.json();
      if (data.success) {
        setSuppliers(data.suppliers || []);
      } else {
        setMessage(data.message || "Failed to fetch suppliers");
      }
    } catch (err) {
      setMessage("Cannot connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!companyName || !phoneNumber) {
      setMessage("Company name and phone number are required.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          contact_person: contactPerson,
          phone_number: phoneNumber,
          email: email,
          address: address,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage("Supplier created successfully!");
        setCompanyName("");
        setContactPerson("");
        setPhoneNumber("");
        setEmail("");
        setAddress("");
        fetchSuppliers();
      } else {
        setMessage(data.message || "Failed to add supplier.");
      }
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;

    try {
      const response = await fetch(`${API_URL}/suppliers/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setSuppliers((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(data.message || "Failed to delete supplier");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2>Supplier Management</h2>

    <div style={styles.suppliersPart}>
        <Link to="/parts" style={styles.link}>Back to Parts</Link>
         </div>
      </div>

      {message && <p style={styles.error}>{message}</p>}

      <form onSubmit={handleCreateSupplier} style={styles.formCard}>
        <h3 style={styles.formTitle}>Add New Supplier</h3>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Company Name *</label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={styles.input} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Contact Person</label>
            <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number *</label>
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={styles.input} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input 
              type="email" value={email}  onChange={(e) => setEmail(e.target.value)} style={styles.input} />
          </div>
          <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
            <label style={styles.label}>Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={styles.input} />
          </div>
        </div>
        <button type="submit" style={styles.addButton}>Add Supplier</button>
      </form>

      {loading ? (
        <p style={styles.message}>Loading suppliers...</p>
      ) : suppliers.length === 0 ? (
        <p style={styles.message}>No suppliers found in the database.</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Company Name</th>
                <th style={styles.th}>Contact Person</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} style={styles.tableRow}>
                  <td style={styles.td}>{s.company_name}</td>
                  <td style={styles.td}>{s.contact_person || "-"}</td>
                  <td style={styles.td}>{s.phone_number}</td>
                  <td style={styles.td}>{s.email || "-"}</td>
                  <td style={styles.td}>{s.address || "-"}</td>
                  <td style={styles.td}>
                    <button onClick={() => handleDelete(s.id)} style={styles.deleteButton}>Delete</button>
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
    },
    error: {
        color: "#f87171",
        marginBottom: "16px",
    },
    message: {
        marginTop: "12px",
        color: "#94a3b8",
    },
    formCard: {
        background: "#1e293b",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "24px",
    },
    formTitle: {
        fontSize: "18px",
        marginBottom: "16px",
        color: "#f8fafc",
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "14px",
        marginBottom: "16px",
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        fontSize: "13px",
        fontWeight: "600",
        marginBottom: "6px",
        color: "#94a3b8",
    },
    input: {
        width: "100%",
        padding: "10px",
        background: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "4px",
        color: "#fff",
        fontSize: "14px",
        boxSizing: "border-box",
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

     link: {
        color: "#fff",
        textDecoration: "none"
    },
     suppliersPart: {
        background: "#1e293b",
        marginTop: "10px",
        padding:  "10px",
        borderRadius: "5px",
        textAlign: "center",
        fontSize: "14px"
    }
};