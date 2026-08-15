import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Menu from './components/Menu';
import Register from './pages/Register';
import Reset from './pages/ResetPassword';
import RegCustomers from './pages/RegCustomers';
import Customers from './pages/Customers';

function App() {
  const WorkOrders = () => <div className="container mt-5"><h2>Work Orders & Repairs</h2></div>;
  const Inventory = () => <div className="container mt-5"><h2>Parts Inventory</h2></div>;

  return (
    <Router>
      
      <div className="app-layout">
        <Menu />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset" element={<Reset />}/>
            <Route path="/register" element={<Register />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/regCustomer" element={<RegCustomers />} />
            <Route path="/work-orders" element={<WorkOrders />} />
            <Route path="/inventory" element={<Inventory />} />
            
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;