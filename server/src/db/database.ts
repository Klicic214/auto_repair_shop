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

export const resetMechanic = async (email: string, newPassword: string): Promise<ResultSetHeader> => {
    const [result] = await pool.query<ResultSetHeader>(
        "UPDATE mechanic SET password = ? WHERE email = ?", 
        [newPassword, email]
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

export async function deleteCustomer(id: number) {
    const [result] = await pool.query("DELETE FROM customer WHERE id = ?", [id]);
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