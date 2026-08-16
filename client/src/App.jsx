import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Menu from './components/Menu';
import Register from './pages/Register';
import Reset from './pages/ResetPassword';
import RegCustomers from './pages/RegCustomers';
import Customers from './pages/Customers';
import Vehicles from './pages/Vehicles';
import RegVehicle from './pages/RegVehicle';
import Appointments from './pages/Appointment';
import Parts from "./pages/Parts";
import RegParts from "./pages/RegParts";
import Suppliers from './pages/Suppliers';;
import UpdateCustomer from './pages/UpdateCustomer';
import UpdateVehicle from './pages/UpdateVehicle';


function App() {

  return (
    <Router>
      
      <div className="app-layout">
        <Menu />
        <main className="main-content">
          <Routes>
            
            <Route path="/register" element={<Register />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/regCustomer" element={<RegCustomers />} />
            <Route path="/updCustomer" element={<UpdateCustomer />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/regVehicle" element={<RegVehicle />} />
            <Route path="/updVehicle" element={<UpdateVehicle />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/parts" element={<Parts />} /> 
            <Route path="/regParts" element={<RegParts />}/>
            <Route path="/suppliers" element={<Suppliers />} /> 

            
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset" element={<Reset />}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;