import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

//Settings
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, 
  port: Number(process.env.DB_PORT) || 3306
});

//Mechanics/users

export interface Mechanic extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  specialization: string;
  phone: string;
  email: string;
  password: string;
}

export const createMechanics = async (
    firstName: string,
    lastName: string,
    specialization: string,
    phone: string,
    email: string,
    password: string,
): Promise<ResultSetHeader> => {
    const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO mechanic (first_name, last_name, specialization, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)",
    [firstName, lastName, specialization, phone, email, password]
  );

  return result;
};


export const authMechanic = async (email: string): Promise<Mechanic[]> =>{
    const[rows] = await pool.query<Mechanic[]>(
        "SELECT * FROM mechanic WHERE email = ?", [email]
    );

    return rows;
};

export const resetMechanic = async (email: string, password: string, newPassword: string): Promise<ResultSetHeader> => {
    const [result] = await pool.query<ResultSetHeader>(
        "UPDATE mechanic SET password = ? WHERE email = ? AND password = ?", 
        [newPassword, email,password]
    );

    return result;
};

//Customers

export interface Customers extends RowDataPacket{
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    address: string;
}

export const getCustomers= async (): Promise<Customers[]> => {
    const[rows] = await pool.query<Customers[]>("SELECT * FROM customer");
    return rows;
}

export const getCustomerById = async (id: number): Promise<Customers | null> => {
    const [rows] = await pool.query<Customers[]>(
        "SELECT * FROM customer WHERE id = ?", [id]
    );
    return rows[0] || null;
};
export async function deleteCustomer(id: number): Promise<ResultSetHeader> {
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM customer WHERE id = ?", [id]);
    return result;
}

export const createCustomer= async(
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    address: string,
) : Promise<ResultSetHeader> => {
    const[result] = await pool.query<ResultSetHeader>(
        "INSERT INTO customer (first_name, last_name, phone, email, address) VALUES (?,?,?,?,?)", 
        [firstName, lastName, phone, email, address]
    ); 
    return result;
}

export const updateCustomer = async (
  id: number,
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  address: string
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE customer SET first_name=?, last_name=?, phone=?, email=?, address=? WHERE id=?",
    [firstName, lastName, phone, email, address, id]
  );
  return result;
};


//Vehicles
export interface Vehicle extends RowDataPacket {
  id?: number;
  license_plate: string;
  make: string;
  model: string;
  manufacturing_year: number;
  customer_id: number;
}


export const createVehicle = async(
    licensePlate: string,
    make: string,
    model: string,
    manuFac: number,
    customerID: number
): Promise<ResultSetHeader> =>{
    const[result] = await pool.query<ResultSetHeader>(
        "INSERT INTO vehicle (license_plate, make, model, manufacturing_year, customer_id) VALUES(?,?,?,?,?)",
        [licensePlate, make,model,manuFac,customerID]

    );
    return result
} 

export const getVehicles = async() : Promise<Vehicle[]> =>{
  const[rows] = await pool.query<Vehicle[]>(
    "SELECT * FROM vehicle"
  );
 return rows; 
}

export const getVehiclesById = async(customerID: number): Promise<Vehicle[]> =>{
    const[rows] = await pool.query<Vehicle[]>(
        "SELECT * FROM vehicle WHERE customer_id =?", [customerID]
    );
    return rows; 
}
export const getVehicleById = async (id: number): Promise<Vehicle | null> => {
    const [rows] = await pool.query<Vehicle[]>(
        "SELECT * FROM vehicle WHERE id = ?", [id]
    );
    return rows[0] || null;
};

export const deleteVehicle = async (id: number): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM vehicle WHERE id = ?",
    [id]
  );
  return result;
};

export const updateVehicle = async (
  id: number,
  licensePlate: string,
  make: string,
  model: string,
  manufacturingYear: number
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE vehicle SET license_plate=?, make=?, model=?, manufacturing_year=? WHERE id=?",
    [licensePlate, make, model, manufacturingYear, id]
  );
  return result;
};

//Appointments

export interface Appointment extends RowDataPacket {
  id: number;
  scheduled_date: string;
  report_issue: string | null;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  vehicle_id: number;
}

export const getAppointments = async (): Promise<Appointment[]> => {
  const [rows] = await pool.query<Appointment[]>(
    "SELECT a.*, v.make, v.model, v.license_plate FROM appointment a JOIN vehicle v ON a.vehicle_id = v.id"
  );
  return rows;
};

export const createAppointment = async (
  scheduledDate: string,
  reportIssue: string,
  vehicleID: number
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO appointment (scheduled_date, report_issue, status, vehicle_id) VALUES (?, ?, 'Scheduled', ?)",
    [scheduledDate, reportIssue, vehicleID]
  );
  return result;
};

export const updateAppointmentStatus = async (
  id: number,
  status: string
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE appointment SET status = ? WHERE id = ?",
    [status, id]
  );
  return result;
};

export const deleteAppointment = async (id: number): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM appointment WHERE id = ?",
    [id]
  );
  return result;
};


//Pats

export interface Part extends RowDataPacket {
  id: number;
  oem_code: string;
  part_name: string;
  category: string | null;
  unit_cost: number;
  selling_price: number;
  stock_quantity: number;
  reorder_threshold: number;
  supplier_id: number;
}

export const getParts = async (): Promise<Part[]> => {
  const [rows] = await pool.query<Part[]>(
    "SELECT p.*, s.company_name AS supplier_name FROM part p JOIN supplier s ON p.supplier_id = s.id"
  );
  return rows;
};

export const createPart = async (
  oemCode: string,
  partName: string,
  category: string,
  unitCost: number,
  sellingPrice: number,
  stockQuantity: number,
  reorderThreshold: number,
  supplierId: number
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO part (oem_code, part_name, category, unit_cost, selling_price, stock_quantity, reorder_threshold, supplier_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [oemCode, partName, category, unitCost, sellingPrice, stockQuantity, reorderThreshold, supplierId]
  );
  return result;
};

export const deletePart = async (id: number): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM part WHERE id = ?",
    [id]
  );
  return result;
};

export const usePart = async (
  id: number,
  quantity: number
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE part SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?",
    [quantity, id, quantity]
  );
  return result;
};

//Suppliers

export interface Supplier extends RowDataPacket {
  id: number;
  company_name: string;
  contact_person: string | null;
  phone_number: string;
  email: string | null;
  address: string | null;
}


export const getSuppliers = async (): Promise<Supplier[]> => {
  const [rows] = await pool.query<Supplier[]>("SELECT * FROM supplier");
  return rows;
};

export const createSupplier = async (
  companyName: string,
  contactPerson: string,
  phoneNumber: string,
  email: string,
  address: string
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO supplier (company_name, contact_person, phone_number, email, address) VALUES (?, ?, ?, ?, ?)",
    [companyName, contactPerson, phoneNumber, email, address]
  );
  return result;
};

export const deleteSupplier = async (id: number): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM supplier WHERE id = ?",
    [id]
  );
  return result;
};