import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config/api';

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleRegSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); 

        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },

                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                    specialization: specialization,
                    email: email,
                    password: password,

                }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/customers');
            } else {
                setErrorMessage(data.message || "Registration failed");
            }
        } catch (err) {
            setErrorMessage("Cannot connect to backend server.");

        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Auto Repair Shop Register</h2>

                <form onSubmit={handleRegSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>First Name</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" required style={styles.input}/>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Last Name</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter your last name" required style={styles.input}/>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Phone</label>
                        <input type="text" value={phone}onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone" required style={styles.input}/>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required style={styles.input}/>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Specialization</label>
                        <input  type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Enter your specialization" style={styles.input}/>
                    </div>

                    <div style={styles.formGroupLast}>
                        <label style={styles.label}>Password</label>
                        <input  type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required style={styles.input}/>
                    </div>

                    <button type="submit" style={styles.button}>Register</button>
                </form>

                {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}

                <div style={styles.footerLinks}>
                    <p style={styles.footerText}>
                        Already have an account? <Link to="/login" style={styles.link}>Log In</Link>
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
        minHeight: "85vh",
        padding: "20px"
    },
    card: {
        background: "#1e293b",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: "450px",
        color: "#f8fafc"
    },
    title: {
        marginBottom: "24px",
        textAlign: "center",
        fontWeight: "600"
    },
    formGroup: {
        marginBottom: "14px"
    },
    formGroupLast: {
        marginBottom: "20px"
    },
    label: {
        display: "block",
        marginBottom: "6px",
        fontSize: "13px",
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