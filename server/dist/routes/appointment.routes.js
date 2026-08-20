"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_js_1 = require("../db/database.js");
const router = (0, express_1.Router)();
const regAppointment = async (req, res, next) => {
    try {
        const { scheduled_date, report_issue, vehicle_id } = req.body;
        if (!scheduled_date || !vehicle_id) {
            res.status(400).json({
                success: false,
                message: "Scheduled date and vehicle ID are required.",
            });
            return;
        }
        const reportIssueValue = report_issue && report_issue.trim() !== "" ? report_issue : "";
        const result = await (0, database_js_1.createAppointment)(scheduled_date, reportIssueValue, vehicle_id);
        res.status(200).json({
            success: true,
            message: "Appointment created successfully!",
            id: result.insertId,
        });
    }
    catch (err) {
        console.error("Error creating appointment", err);
        res.status(500).json({
            success: false,
            message: "Server error during appointment creation",
        });
    }
};
const getAllAppointments = async (req, res, next) => {
    try {
        const appointments = await (0, database_js_1.getAppointments)();
        res.status(200).json({
            success: true,
            data: appointments,
        });
    }
    catch (err) {
        console.error("Error fetching appointments", err);
        res.status(500).json({
            success: false,
            message: "Server error during appointment retrieval",
        });
    }
};
const patchAppointmentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            res.status(400).json({
                success: false,
                message: "Status is required.",
            });
            return;
        }
        await (0, database_js_1.updateAppointmentStatus)(Number(id), status);
        res.status(200).json({
            success: true,
            message: "Appointment status updated successfully!",
        });
    }
    catch (err) {
        console.error("Error updating appointment status", err);
        res.status(500).json({
            success: false,
            message: "Server error during status update",
        });
    }
};
const removeAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await (0, database_js_1.deleteAppointment)(Number(id));
        if (result.affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: "Appointment not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Appointment deleted successfully!",
        });
    }
    catch (err) {
        console.error("Error deleting appointment", err);
        res.status(500).json({
            success: false,
            message: "Server error during appointment deletion",
        });
    }
};
router.get("/", getAllAppointments);
router.post("/", regAppointment);
router.put("/:id/status", patchAppointmentStatus);
router.delete("/:id", removeAppointment);
exports.default = router;
