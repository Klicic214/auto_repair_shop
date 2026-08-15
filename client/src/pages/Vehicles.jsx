import { useEffect, useState } from "react";
import { API_URL } from "../config/api";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${API_URL}/vehicles`);
      const data = await response.json();
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      const response = await fetch(`${API_URL}/vehicles/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        setVehicles((prev) => prev.filter((v) => v.id !== id));
      } else {
        alert(data.message || "Failed to delete vehicle");
      }
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      alert("Error connecting to server.");
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const term = searchTerm.toLowerCase();
    return (
      vehicle.model?.toLowerCase().includes(term) ||
      vehicle.license_plate?.toLowerCase().includes(term)
    );
  });

  return (
    <div style={styles.container}>
      <h2>Vehicle Inventory</h2>

      <input type="text" laceholder="Search by make, model, or license plate..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchInput}/>

      {loading ? (
        <p>Loading vehicles...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th>License Plate</th>
              <th>Make</th>
              <th>Model</th>
              <th>Year</th>
              <th>Customer ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((v) => (
              <tr key={v.id} style={styles.tableRow}>
                <td>{v.license_plate}</td>
                <td>{v.make}</td>
                <td>{v.model}</td>
                <td>{v.manufacturing_year}</td>
                <td>{v.customer_id}</td>
                <td>
                  <button onClick={() => handleDelete(v.id)}style={styles.deleteBtn}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredVehicles.length === 0 && (
              <tr>
                <td colSpan={6} style={styles.emptyCell}>
                  No vehicles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    fontSize: "16px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeaderRow: {
    textAlign: "left",
    borderBottom: "2px solid #ccc",
  },
  tableRow: {
    borderBottom: "1px solid #eee",
  },
  deleteBtn: {
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  emptyCell: {
    padding: "20px",
    textAlign: "center",
  },
};