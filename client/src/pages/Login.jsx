import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import { Link } from 'react-router-dom';

export default function Login (){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] =useState("");

    const navigate = useNavigate();

    const handleSubmit = async(e) =>{ 
        e.preventDefault();
        setErrorMessage(""); 

        try{
            const response = await fetch(`${API_URL}/users/login`, {

            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                email: email,
                password: password
            }),
        })

            const data = await response.json();

            if(response.ok){
                navigate('/dashboard');
            }else{
                setErrorMessage(data.message || "Login failed");
            }
        }catch(err){
            setErrorMessage("Cannot connect to backend server.");

        }
    }
        


    return(

        <div>
            <h2>Auto Repair Shop Login</h2>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required/>
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required/>
                </div>


                <button type='submit'>Log In</button>
                <Link to="/register">Register</Link>
                <Link to="/reset">Reset</Link>
                
            </form>

            
        </div>
    );
}