"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupplier = exports.createSupplier = exports.getSuppliers = exports.usePart = exports.deletePart = exports.createPart = exports.getParts = exports.deleteAppointment = exports.updateAppointmentStatus = exports.createAppointment = exports.getAppointments = exports.updateVehicle = exports.deleteVehicle = exports.getVehicleById = exports.getVehiclesById = exports.getVehicles = exports.createVehicle = exports.updateCustomer = exports.createCustomer = exports.getCustomerById = exports.getCustomers = exports.resetMechanic = exports.authMechanic = exports.createMechanics = void 0;
exports.deleteCustomer = deleteCustomer;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//Settings
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306
});
const createMechanics = async (firstName, lastName, specialization, phone, email, password) => {
    const [result] = await pool.query("INSERT INTO mechanic (first_name, last_name, specialization, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)", [firstName, lastName, specialization, phone, email, password]);
    return result;
};
exports.createMechanics = createMechanics;
const authMechanic = async (email) => {
    const [rows] = await pool.query("SELECT * FROM mechanic WHERE email = ?", [email]);
    return rows;
};
exports.authMechanic = authMechanic;
const resetMechanic = async (email, password, newPassword) => {
    const [result] = await pool.query("UPDATE mechanic SET password = ? WHERE email = ? AND password = ?", [newPassword, email, password]);
    return result;
};
exports.resetMechanic = resetMechanic;
const getCustomers = async () => {
    const [rows] = await pool.query("SELECT * FROM customer");
    return rows;
};
exports.getCustomers = getCustomers;
const getCustomerById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM customer WHERE id = ?", [id]);
    return rows[0] || null;
};
exports.getCustomerById = getCustomerById;
async function deleteCustomer(id) {
    const [result] = await pool.query("DELETE FROM customer WHERE id = ?", [id]);
    return result;
}
const createCustomer = async (firstName, lastName, phone, email, address) => {
    const [result] = await pool.query("INSERT INTO customer (first_name, last_name, phone, email, address) VALUES (?,?,?,?,?)", [firstName, lastName, phone, email, address]);
    return result;
};
exports.createCustomer = createCustomer;
const updateCustomer = async (id, firstName, lastName, phone, email, address) => {
    const [result] = await pool.query("UPDATE customer SET first_name=?, last_name=?, phone=?, email=?, address=? WHERE id=?", [firstName, lastName, phone, email, address, id]);
    return result;
};
exports.updateCustomer = updateCustomer;
const createVehicle = async (licensePlate, make, model, manuFac, customerID) => {
    const [result] = await pool.query("INSERT INTO vehicle (license_plate, make, model, manufacturing_year, customer_id) VALUES(?,?,?,?,?)", [licensePlate, make, model, manuFac, customerID]);
    return result;
};
exports.createVehicle = createVehicle;
const getVehicles = async () => {
    const [rows] = await pool.query("SELECT * FROM vehicle");
    return rows;
};
exports.getVehicles = getVehicles;
const getVehiclesById = async (customerID) => {
    const [rows] = await pool.query("SELECT * FROM vehicle WHERE customer_id =?", [customerID]);
    return rows;
};
exports.getVehiclesById = getVehiclesById;
const getVehicleById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM vehicle WHERE id = ?", [id]);
    return rows[0] || null;
};
exports.getVehicleById = getVehicleById;
const deleteVehicle = async (id) => {
    const [result] = await pool.query("DELETE FROM vehicle WHERE id = ?", [id]);
    return result;
};
exports.deleteVehicle = deleteVehicle;
const updateVehicle = async (id, licensePlate, make, model, manufacturingYear) => {
    const [result] = await pool.query("UPDATE vehicle SET license_plate=?, make=?, model=?, manufacturing_year=? WHERE id=?", [licensePlate, make, model, manufacturingYear, id]);
    return result;
};
exports.updateVehicle = updateVehicle;
const getAppointments = async () => {
    const [rows] = await pool.query("SELECT a.*, v.make, v.model, v.license_plate FROM appointment a JOIN vehicle v ON a.vehicle_id = v.id");
    return rows;
};
exports.getAppointments = getAppointments;
const createAppointment = async (scheduledDate, reportIssue, vehicleID) => {
    const [result] = await pool.query("INSERT INTO appointment (scheduled_date, report_issue, status, vehicle_id) VALUES (?, ?, 'Scheduled', ?)", [scheduledDate, reportIssue, vehicleID]);
    return result;
};
exports.createAppointment = createAppointment;
const updateAppointmentStatus = async (id, status) => {
    const [result] = await pool.query("UPDATE appointment SET status = ? WHERE id = ?", [status, id]);
    return result;
};
exports.updateAppointmentStatus = updateAppointmentStatus;
const deleteAppointment = async (id) => {
    const [result] = await pool.query("DELETE FROM appointment WHERE id = ?", [id]);
    return result;
};
exports.deleteAppointment = deleteAppointment;
const getParts = async () => {
    const [rows] = await pool.query("SELECT p.*, s.company_name AS supplier_name FROM part p JOIN supplier s ON p.supplier_id = s.id");
    return rows;
};
exports.getParts = getParts;
const createPart = async (oemCode, partName, category, unitCost, sellingPrice, stockQuantity, reorderThreshold, supplierId) => {
    const [result] = await pool.query("INSERT INTO part (oem_code, part_name, category, unit_cost, selling_price, stock_quantity, reorder_threshold, supplier_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [oemCode, partName, category, unitCost, sellingPrice, stockQuantity, reorderThreshold, supplierId]);
    return result;
};
exports.createPart = createPart;
const deletePart = async (id) => {
    const [result] = await pool.query("DELETE FROM part WHERE id = ?", [id]);
    return result;
};
exports.deletePart = deletePart;
const usePart = async (id, quantity) => {
    const [result] = await pool.query("UPDATE part SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?", [quantity, id, quantity]);
    return result;
};
exports.usePart = usePart;
const getSuppliers = async () => {
    const [rows] = await pool.query("SELECT * FROM supplier");
    return rows;
};
exports.getSuppliers = getSuppliers;
const createSupplier = async (companyName, contactPerson, phoneNumber, email, address) => {
    const [result] = await pool.query("INSERT INTO supplier (company_name, contact_person, phone_number, email, address) VALUES (?, ?, ?, ?, ?)", [companyName, contactPerson, phoneNumber, email, address]);
    return result;
};
exports.createSupplier = createSupplier;
const deleteSupplier = async (id) => {
    const [result] = await pool.query("DELETE FROM supplier WHERE id = ?", [id]);
    return result;
};
exports.deleteSupplier = deleteSupplier;
