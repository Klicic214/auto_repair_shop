import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../config/api";

export default function UpdVehicle() {
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("editId");
    const [licensePlate, setLicensePlate] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [manufacturingYear, setManufacturingYear] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!editId) {
            navigate("/vehicles");
            return;
        }
        fetch(`${API_URL}/vehicles/${editId}`)
            .then(r => r.json())
            .then(data => {
                if (data.ok) {
                    const v = data.vehicle;
                    setLicensePlate(v.license_plate);
                    setMake(v.make);
                    setModel(v.model);
                    setManufacturingYear(v.manufacturing_year);
                } else {
                    setMessage("Failed to load vehicle data.");
                }
            })
            .catch(() => setMessage("Cannot connect to server."));
    }, [editId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(`${API_URL}/vehicles/${editId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    license_plate: licensePlate,
                    make,
                    model,
                    manufacturing_year: Number(manufacturingYear),
                }),
            });

            const data = await response.json();

            if (data.sucess) {
                navigate("/vehicles");
            } else {
                setMessage(data.message || "Failed to update vehicle.");
            }
        } catch (err) {
            setMessage("Cannot connect to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Edit Vehicle</h2>

                {message && <p style={styles.error}>{message}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>License Plate</label>
                        <input type="text" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} required style={styles.input} />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Make</label>
                        <input type="text" value={make} onChange={(e) => setMake(e.target.value)} required style={styles.input} />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Model</label>
                        <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required style={styles.input} />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Manufacturing Year</label>
                        <input type="number" value={manufacturingYear} onChange={(e) => setManufacturingYear(e.target.value)} required style={styles.input} />
                    </div>

                    <div style={styles.buttonGroup}>
                        <button type="submit" disabled={loading} style={styles.submitBtn}>
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                        <button type="button" onClick={() => navigate("/vehicles")} style={styles.cancelBtn}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: "24px",
        display: "flex",
        justifyContent: "center",
        color: "#fff",
    },
    card: {
        background: "#1e293b",
        padding: "24px",
        borderRadius: "8px",
        width: "100%",
        maxWidth: "500px",
    },
    title: {
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    label: {
        fontSize: "14px",
        color: "#94a3b8",
    },
    input: {
        padding: "10px",
        borderRadius: "4px",
        border: "1px solid #334155",
        backgroundColor: "#0f172a",
        color: "#fff",
        fontSize: "15px",
    },
    buttonGroup: {
        display: "flex",
        gap: "12px",
        marginTop: "12px",
    },
    submitBtn: {
        flex: 1,
        padding: "10px",
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    cancelBtn: {
        padding: "10px 16px",
        backgroundColor: "#475569",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    error: {
        color: "#ef4444",
        marginBottom: "16px",
    },
};