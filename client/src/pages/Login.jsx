import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config/api';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => { 
        e.preventDefault();
        setMessage(""); 

        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });

            const data = await response.json();

            if (data.success) {
                navigate('/customers');
            } else {
                setMessage(data.message || "Login failed");
            }
        } catch (err) {
            setMessage("Cannot connect to backend server.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Auto Repair Shop Login</h2>

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required style={styles.input}/>
                    </div>

                    <div style={styles.formGroupLast}>
                        <label style={styles.label}>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required style={styles.input}/>
                    </div>

                    <button type='submit' style={styles.button}>Log In</button>
                </form>

                {message && <p style={styles.errorMessage}>{message}</p>}

                <div style={styles.footerLinks}>
                    <p style={styles.footerText}>
                        Forgot your password? <Link to="/reset" style={styles.link}>Reset</Link>
                    </p>
                    <p style={styles.footerText}>
                        Don't have an account? <Link to="/register" style={styles.link}>Register</Link>
                    </p>
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
        minHeight: "80%",
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
    errorMessage: {
        marginTop: "16px",
        textAlign: "center",
        fontSize: "14px",
        color: "#f87171"
    },
    footerLinks: {
        marginTop: "20px",
        textAlign: "center",
        fontSize: "14px"
    },
    footerText: {
        margin: "8px 0",
        color: "#94a3b8"
    },
    link: {
        color: "#60a5fa",
        textDecoration: "none"
    }
};