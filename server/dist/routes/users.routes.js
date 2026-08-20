"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_js_1 = require("../db/database.js");
const router = (0, express_1.Router)();
const loginMechanic = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
            return;
        }
        const queryRes = await (0, database_js_1.authMechanic)(email);
        if (queryRes.length == 0) {
            res.status(400).json({
                success: false,
                message: "Email is not registered"
            });
            return;
        }
        const user = queryRes[0];
        if (password != user.password) {
            res.status(400).json({
                success: false,
                message: "Wrong password",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Login succesfull",
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            },
        });
    }
    catch (err) {
        console.error("Logging error", err);
        res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
};
const regMechanic = async (req, res, next) => {
    try {
        const { first_name, last_name, phone, specialization, email, password } = req.body;
        if (!first_name || !last_name || !phone || !email || !password) {
            res.status(400).json({
                success: false,
                message: "Please fill in all required fields.",
            });
            return;
        }
        const specializationValue = specialization && specialization.trim() !== "" ? specialization : "";
        await (0, database_js_1.createMechanics)(first_name, last_name, specializationValue, phone, email, password);
        res.status(200).json({
            success: true,
            message: "Mechanic registered successfully!",
        });
    }
    catch (err) {
        console.error("Registration error", err);
        if (err.code === "ER_DUP_ENTRY") {
            res.status(400).json({
                success: false,
                message: "An account with this email already exists.",
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Server error during registration.",
        });
    }
};
const resMechanic = async (req, res, next) => {
    try {
        const { email, password, newPassword } = req.body;
        if (!email || !password || !newPassword) {
            res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
            return;
        }
        const queryRes = await (0, database_js_1.authMechanic)(email);
        if (queryRes.length == 0) {
            res.status(400).json({
                success: false,
                message: "Email is not registered"
            });
            return;
        }
        const result = await (0, database_js_1.resetMechanic)(email, password, newPassword);
        if (result.affectedRows === 0) {
            res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Password reset"
        });
    }
    catch (err) {
        console.error("Passwor change error", err);
        res.status(500).json({
            success: false,
            message: "Server error during password reset",
        });
    }
};
router.post("/login", loginMechanic);
router.post("/register", regMechanic);
router.post("/reset", resMechanic);
exports.default = router;
