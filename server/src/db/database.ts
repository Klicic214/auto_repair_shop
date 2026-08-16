import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, 
  port: Number(process.env.DB_PORT) || 3306
});

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

export const deleteVehicle = async (id: number): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM vehicle WHERE id = ?",
    [id]
  );
  return result;
};

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