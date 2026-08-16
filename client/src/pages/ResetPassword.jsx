import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config/api';

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await fetch(`${API_URL}/users/reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, newPassword }),
            });
            const data = await response.json();
        
            if (data.success) {
                setMessage("Password updated successfully!");
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } else {
                setMessage(data.message || "Failed to update password.");
            }
        } catch (err) {
            console.error(err);
            setMessage("Error connecting to server.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Reset Password</h2>
                <form onSubmit={handleReset}>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email: </label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input}/>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password: </label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input}/>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>New Password: </label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={styles.input}/>
                    </div>

                    <button type="submit" style={styles.button}>Update Password</button>
                </form>
                
                {message && <p style={{ marginTop: "10px", textAlign: "center", color: message.includes("success") ? "#4ade80" : "#f87171" }}>{message}</p>}

                <div style={styles.linkContainer}>
                    <Link to="/login" style={styles.link}>Back</Link>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        padding: "20px"
    },
    card: {
        background: "#1e293b",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: "400px",
        color: "#f8fafc"
    },
    title: {
        marginBottom: "24px",
        textAlign: "center",
        fontWeight: "600"
    },
    formGroup: {
        marginBottom: "16px"
    },
    formGroupLast: {
        marginBottom: "20px"
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontSize: "14px",
        color: "#94a3b8"
    },
    input: {
        width: "100%",
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid #334155",
        background: "#0f172a",
        color: "#f8fafc",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box"
    },
    button: {
        width: "100%",
        padding: "12px",
        background: "#3b82f6",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        fontWeight: "600",
        fontSize: "14px",
        cursor: "pointer"
    },
    message: {
        marginTop: "16px",
        textAlign: "center",
        fontSize: "14px"
    },
    linkContainer: {
        marginTop: "20px",
        textAlign: "center"
    },
    link: {
        color: "#60a5fa",
        textDecoration: "none",
        fontSize: "14px"
    }
};