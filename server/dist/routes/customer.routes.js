"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_js_1 = require("../db/database.js");
const router = (0, express_1.Router)();
const showCustomer = async (req, res, next) => {
    try {
        const customers = await (0, database_js_1.getCustomers)();
        res.status(200).json({
            success: true,
            customers
        });
    }
    catch (err) {
        console.error("Error fetching customer", err);
        res.status(500).json({
            success: false,
            message: "Server error fetching customers",
        });
    }
};
const removeCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        await (0, database_js_1.deleteCustomer)(Number(id));
        res.status(200).json({
            success: true,
            message: "Customer deleted successfully",
        });
    }
    catch (err) {
        console.error("Error deleting customer", err);
        res.status(500).json({
            success: false,
            message: "Server error deleting customer",
        });
    }
};
const regCustomers = async (req, res, next) => {
    try {
        const { first_name, last_name, phone, email, address } = req.body;
        if (!first_name || !last_name || !phone || !email) {
            res.status(400).json({
                success: false,
                message: "Please enter all the requied fields"
            });
            return;
        }
        ;
        const addressVal = address && address.trim() !== "" ? address : "";
        await (0, database_js_1.createCustomer)(first_name, last_name, phone, email, addressVal);
        res.status(200).json({
            success: true,
            message: "Customer created successfully!",
        });
    }
    catch (err) {
        console.error("Error registering customer", err);
        if (err.code === "ER_DUP_ENTRY") {
            res.status(400).json({
                success: false,
                message: "A customer with this email already exists.",
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Server error during customer registration",
        });
    }
};
const getCustomerID = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await (0, database_js_1.getCustomerById)(Number(id));
        if (!customer) {
            res.status(404).json({
                success: false,
                message: "Customer not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            customer
        });
    }
    catch (err) {
        console.error("Error fetching customer", err);
        res.status(500).json({
            success: false,
            message: "Server error fetching customer",
        });
    }
};
const editCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, phone, email, address } = req.body;
        if (!first_name || !last_name || !phone || !email) {
            res.status(400).json({
                success: false,
                message: "Please fill in all required fields.",
            });
            return;
        }
        const result = await (0, database_js_1.updateCustomer)(Number(id), first_name, last_name, phone, email, address || "");
        if (result.affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Customer updated successfully!",
        });
    }
    catch (err) {
        console.error("Error updating customer", err);
        res.status(500).json({
            success: false,
            message: "Server error updating customer",
        });
    }
};
router.get("/", showCustomer);
router.post("/", regCustomers);
router.get("/:id", getCustomerID);
router.put("/:id", editCustomer);
router.delete("/:id", removeCustomer);
exports.default = router;
