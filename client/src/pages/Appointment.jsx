import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [reportIssue, setReportIssue] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_URL}/appointments`); 
      const data = await response.json();
      if (response.ok) {
        setAppointments(data.data || []);
      } else {
        setMessage(data.message || "Failed to fetch appointments");
      }
    } catch (err) {
      setMessage("Cannot connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${API_URL}/vehicles`); 
      const data = await response.json();
      if (response.ok) {
        setVehicles(data.vehicles || []);
      }
    } catch (err) {
      console.error("Failed to fetch vehicles", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchVehicles();
  }, []);

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setMessage("");
  

    if (!scheduledDate || !vehicleId) {
      setMessage("Please provide a scheduled date and select a vehicle.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduled_date: scheduledDate,
          report_issue: reportIssue,
          vehicle_id: Number(vehicleId),
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("Appointment scheduled successfully!");
        setScheduledDate("");
        setReportIssue("");
        setVehicleId("");
        fetchAppointments();
      } else {
        setMessage(data.message || "Failed to create appointment.");
      }
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();

      if (response.ok) {
        fetchAppointments();
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        setAppointments((prev) => prev.filter((app) => app.id !== id));
      } else {
        alert(data.message || "Failed to delete appointment");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2>Service Appointments</h2>
      </div>

      {message && <p style={styles.error}>{message}</p>}

      <form onSubmit={handleCreateAppointment} style={styles.formCard}>
        <h3 style={styles.formTitle}>Schedule New Appointment</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Scheduled Date</label>
          <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Vehicle</label>
          <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} style={styles.input}>
            <option value="">Select a vehicle...</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}> {v.make} {v.model} ({v.license_plate}) </option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Reported Issue</label>
          <textarea value={reportIssue} onChange={(e) => setReportIssue(e.target.value)} placeholder="Describe the issue..." style={styles.textarea} />
        </div>
        <button type="submit" style={styles.addButton}>
          Schedule Appointment
        </button>
      </form>

      {loading ? (
        <p style={styles.message}>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p style={styles.message}>No appointments found in the database.</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Vehicle</th>
                <th style={styles.th}>Issue</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    {new Date(app.scheduled_date).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    {app.make} {app.model} <span style={styles.plate}>({app.license_plate})</span>
                  </td>
                  <td style={styles.td}>{app.report_issue || "None"}</td>
                  <td style={styles.td}>
                    <select value={app.status} onChange={(e) => handleStatusChange(app.id, e.target.value)} style={styles.statusSelect}>
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => handleDelete(app.id)} style={styles.deleteButton}>
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
    color: "#f87171",
    marginBottom: "16px",
  },
  success: {
    color: "#4ade80",
    marginBottom: "16px",
  },
  message: {
    marginTop: "12px",
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
  formGroup: {
    marginBottom: "14px",
  },
  label: {
    display: "block",
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
  textarea: {
    width: "100%",
    padding: "10px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "14px",
    height: "70px",
    resize: "vertical",
    boxSizing: "border-box",
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
  plate: {
    color: "#94a3b8",
    fontSize: "12px",
  },
  statusSelect: {
    padding: "6px",
    background: "#0f172a",
    border: "1px solid #334155",
    color: "#fff",
    borderRadius: "4px",
    fontSize: "13px",
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