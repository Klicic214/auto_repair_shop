import { useState, useEffect } from "react";
import { API_URL } from "../config/api";
import { Link } from "react-router-dom";

export default function Parts() {
  const [parts, setParts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [oemCode, setOemCode] = useState("");
  const [partName, setPartName] = useState("");
  const [category, setCategory] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [reorderThreshold, setReorderThreshold] = useState("5");
  const [supplierId, setSupplierId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchParts = async () => {
    try {
      const response = await fetch(`${API_URL}/parts`);
      const data = await response.json();
      if (data.success) {
        setParts(data.parts || []);
      } else {
        setMessage(data.message || "Failed to fetch parts");
      }
    } catch (err) {
      setMessage("Cannot connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${API_URL}/suppliers`);
      const data = await response.json();
      if (data.success) {
        setSuppliers(data.suppliers || []);
      }
    } catch (err) {
      console.error("Failed to fetch suppliers", err);
    }
  };

  useEffect(() => {
    fetchParts();
    fetchSuppliers();
  }, []);

  
  const handleUsePart = async (id) => {
    const qty = window.prompt("How many units are being used on this work order?");
    if (!qty) return;

    const quantity = Number(qty);
    if (!quantity || quantity <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/parts/${id}/use`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = await response.json();

      if (data.success) {
        fetchParts();
      } else {
        alert(data.message || "Failed to update stock.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this part?")) return;

    try {
      const response = await fetch(`${API_URL}/parts/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setParts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.message || "Failed to delete part");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2>Parts Inventory</h2>
        <div style={styles.suppliersPart}>
        <Link to="/suppliers" style={styles.link}>Suppliers</Link>
         </div>
         <div style={styles.suppliersPart}>
        <Link to="/regParts" style={styles.link}>+ Add a part</Link>

      </div>
      </div>

     

      {message && <p style={styles.error}>{message}</p>}

     
      {loading ? (
        <p style={styles.message}>Loading parts...</p>
      ) : parts.length === 0 ? (
        <p style={styles.message}>No parts found in the database.</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>OEM Code</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Supplier</th>
                <th style={styles.th}>Cost</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p) => {
                const isLow = p.stock_quantity <= p.reorder_threshold;
                return (
                  <tr key={p.id} style={styles.tableRow}>
                    <td style={styles.td}>{p.oem_code}</td>
                    <td style={styles.td}>{p.part_name}</td>
                    <td style={styles.td}>{p.category || "-"}</td>
                    <td style={styles.td}>{p.supplier_name}</td>
                    <td style={styles.td}>€{Number(p.unit_cost).toFixed(2)}</td>
                    <td style={styles.td}>€{Number(p.selling_price).toFixed(2)}</td>
                    <td style={{ ...styles.td, color: isLow ? "#f87171" : "#4ade80", fontWeight: "bold" }}>
                      {p.stock_quantity} {isLow && "Low"}
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => handleUsePart(p.id)} style={styles.useButton}>Use Part</button>
                      <button onClick={() => handleDelete(p.id)} style={styles.deleteButton}>Delete</button>
                    </td>
                  </tr>
                );
              })}
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
      color: "#fff" },

    headerRow: { 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "20px" 
    },
    error: { 
        color: "#f87171", 
        marginBottom: "16px" 
    },
    message: { 
        marginTop: "12px" 
    },
    formCard: { 
        background: "#1e293b", 
        padding: "20px", 
        borderRadius: "8px", 
        marginBottom: "24px" 
    },
    formTitle: { 
        fontSize: "18px", 
        marginBottom: "16px", 
        color: "#f8fafc" 
    },
    formGrid: { 
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "14px", 
        marginBottom: "16px" 
    },
    formGroup: { 
        display: "flex", 
        flexDirection: "column" 
    },
    label: { 
        fontSize: "13px", 
        fontWeight: "600", 
        marginBottom: "6px", 
        color: "#94a3b8" 
    },
    input: { 
        width: "100%", 
        padding: "10px", 
        background: "#0f172a", 
        border: "1px solid #334155", 
        borderRadius: "4px", 
        color: "#fff", 
        fontSize: "14px", 
        boxSizing: "border-box" 
    },
    addButton: { 
        padding: "10px 16px", 
        background: "#2563eb", 
        color: "#fff", 
        border: "none", 
        borderRadius: "4px", 
        cursor: "pointer", 
        fontWeight: "bold" 
    },
    tableContainer: { 
        background: "#1e293b", 
        borderRadius: "8px", 
        overflowX: "auto", 
        padding: "16px" },
    table: { 
        width: "100%", 
        borderCollapse: 
        "collapse" 
    },
    tableHeaderRow: { 
        borderBottom: "1px solid #334155", 
        textAlign: "left" 
    },
    th: { 
        padding: "12px 8px", 
        color: "#94a3b8", 
        fontWeight: "600" 
    },
    tableRow: { 
        borderBottom: "1px solid #334155" 
    },
    td: {
         padding: "12px 8px" 
        },
    useButton: { 
        backgroundColor: "#16a34a", 
        color: "#fff", 
        border: "none", 
        padding: "6px 12px", 
        borderRadius: "4px", 
        cursor: "pointer", 
        marginRight: "8px" 
    },
    deleteButton: { 
        backgroundColor: "#dc2626", 
        color: "#fff", 
        border: "none", 
        padding: "6px 12px", 
        borderRadius: "4px", 
        cursor: "pointer" 
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
