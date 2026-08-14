import {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {API_URL} from '../config/api';



export default function Register(){
    const[firstName, setFirstName] = useState("");
    const[lastName, setLastName] = useState("");
    const[phone, setPhone] = useState("");
    const[specialization, setSpecialization] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[errorMessage, setErrorMessage] = useState("");


    const navigate = useNavigate();

    const handleRegSubmit = async(e) => {
        e.preventDefault();
        setErrorMessage(""); 

        try{
            const response = await fetch(`${API_URL}/users/register`,{
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
            } )

            const data = await response.json();

            if(response.ok){
                navigate('/dashboard');
            }else {
                setErrorMessage(data.message || "Registration failed");
            }

        }catch(err){
            setErrorMessage("Cannot connect to backend server.");

        }

    }


    return (
        
        <div>
            <h2>Auto Repair Shop Register</h2>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <form onSubmit={handleRegSubmit}>
                <div>
                    <label>First Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" required />
                </div>

                <div>
                    <label>Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter your last name" required />
                </div>
                <div>
                    <label>Phone</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone" required />
                </div>

                <div>
                    <label>Specialization</label>
                    <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Enter your specialization"/>
                </div>


                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required/>
                </div>
                 <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required/>
                </div>


                <button type="submit">Register</button>
                
            </form>

            
        </div>
    )


}