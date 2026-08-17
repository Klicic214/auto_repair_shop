import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../config/api";

export default function UpdCustomer() {
    const [searchParams] = useSearchParams();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const editId = searchParams.get("editId");
    const navigate = useNavigate();
useEffect(() => {
    if (!editId) {
        navigate("/customers");
        return;
    }

    const fetchCustomer = async () => {
        try {
            const response = await fetch(`${API_URL}/customers/${editId}`);
            const data = await response.json();
            if (data.success) {
                const c = data.customer;
                setFirstName(c.first_name);
                setLastName(c.last_name);
                setPhone(c.phone);
                setEmail(c.email);
                setAddress(c.address || "");
            } else {
                setMessage("Failed to load customer data.");
            }
        } catch (err) {
            setMessage("Cannot connect to server.");
        }
    };

    fetchCustomer();
}, [editId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(`${API_URL}/customers/${editId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                    email: email,
                    address: address
                }),
            });

            const data = await response.json();

            if (data.success) {
                navigate("/customers");
            } else {
                setMessage(data.message || "Failed to update customer.");
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
                <h2 style={styles.title}>Edit Customer</h2>

                {message && <p style={styles.error}>{message}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>First Name</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={styles.input} />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Last Name</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={styles.input} />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Phone</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required style={styles.input} />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Address (optional)</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={styles.input} />
                    </div>

                    <div style={styles.buttonGroup}>
                        <button type="submit" disabled={loading} style={styles.submitBtn}>
                        Save Changes
                        </button>
                        <button type="button" onClick={() => navigate("/customers")} style={styles.cancelBtn}>
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