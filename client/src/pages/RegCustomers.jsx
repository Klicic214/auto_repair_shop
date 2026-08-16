import { useState } from "react";
import { API_URL } from "../config/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function registerCostumer(){

    const[firstName, setFirstName] = useState("");
    const[lastName, setLastName] = useState("");
    const[phone, setPhone] = useState("");
    const[email, setEmail] = useState("");
    const[address, setAddress] = useState("");
    const[message, setMessage] = useState("");

      const navigate = useNavigate();

    const handleRegCust = async(e) =>{
        e.preventDefault();
        setMessage("");

      

        try{
            const response = await fetch (`${API_URL}/customers`,{

                method: 'POST',
                headers: {
                   'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                    email: email,
                    address: address,
                }),
            })

            const data = await response.json();
            
            if(data.success){
                setMessage("Succesful");
                navigate("/customers")
            }else{
                setMessage(data.message ||"Failed to register")
            }

        }catch(err){
            console.error(err);
            setMessage("Error connecting to server.");
        }
    }


   return (
        <div style={{ padding: '24px', color: '#fff' }}>
            <h2>Register Customer</h2>

            {message && <p style={{ marginTop: '10px' }}>{message}</p>}

            <form onSubmit={handleRegCust} style={styles.form}>
                <div style = {styles.fieldGroup}>
                    <label style={styles.label}>First Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={styles.input}/>
                </div>

                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={styles.input}/>
                </div>

                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Phone</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required style={styles.input}/>
                </div>

                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input}/>
                </div>

                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value )} style={styles.input}/>
                </div>

                <button type="submit" style={styles.button}>Register Customer</button>
                <Link to="/customers" style={styles.backLink}>Back</Link>
            </form>
        </div>
    );
}


const styles = {
    container: {
        padding: '24px',
        color: '#fff',
    },
    message: {
        marginTop: '10px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px',
        marginTop: '16px',
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        display: 'block',
        marginBottom: '4px',
    },
    input: {
        width: '100%',
        padding: '8px',
        boxSizing: 'border-box',
    },
    button: {
        padding: '10px',
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '8px',
    },
};

