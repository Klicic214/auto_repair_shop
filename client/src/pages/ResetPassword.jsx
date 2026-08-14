import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config/api';

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate(); // Added back here!

    const handleReset = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await fetch(`${API_URL}/users/reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
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
    <div style={{ padding: "20px" }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <div>
          <label>Email: </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>New Password: </label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>Update Password</button>
      </form>
      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
      <div style={{ marginTop: "15px" }}>
        <Link to="/login">Back</Link>
      </div>
    </div>
  );
}