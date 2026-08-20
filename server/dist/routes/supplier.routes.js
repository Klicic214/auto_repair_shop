"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_js_1 = require("../db/database.js");
const router = (0, express_1.Router)();
const showSupplier = async (req, res, next) => {
    try {
        const suppliers = await (0, database_js_1.getSuppliers)();
        res.status(200).json({
            success: true,
            suppliers
        });
    }
    catch (err) {
        console.error("Error fetching suppliers", err);
        res.status(500).json({
            success: false,
            message: "Server error fetching suppliers",
        });
    }
};
const removeSupplier = async (req, res, next) => {
    try {
        const { id } = req.params;
        await (0, database_js_1.deleteSupplier)(Number(id));
        res.status(200).json({
            success: true,
            message: "Supplier deleted successfully",
        });
    }
    catch (err) {
        console.error("Error deleting supplier", err);
        res.status(500).json({
            success: false,
            message: "Server error deleting supplier",
        });
    }
};
const regSupplier = async (req, res, next) => {
    try {
        const { company_name, contact_person, phone_number, email, address } = req.body;
        if (!company_name || !phone_number) {
            res.status(400).json({
                success: false,
                message: "Please enter all the required fields"
            });
            return;
        }
        ;
        const contactPersonVal = contact_person && contact_person.trim() !== "" ? contact_person : "";
        const emailVal = email && email.trim() !== "" ? email : "";
        const addressVal = address && address.trim() !== "" ? address : "";
        await (0, database_js_1.createSupplier)(company_name, contactPersonVal, phone_number, emailVal, addressVal);
        res.status(200).json({
            success: true,
            message: "Supplier created successfully!",
        });
    }
    catch (err) {
        console.error("Error registering supplier", err);
        res.status(500).json({
            success: false,
            message: "Server error during supplier registration",
        });
    }
};
router.get("/", showSupplier);
router.post("/", regSupplier);
router.delete("/:id", removeSupplier);
exports.default = router;
