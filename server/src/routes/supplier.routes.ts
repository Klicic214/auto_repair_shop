import { Request, Response, NextFunction, Router } from "express";
import { getSuppliers, createSupplier, deleteSupplier } from "../db/database.js";

const router = Router();

const showSupplier = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const suppliers = await getSuppliers();
        res.status(200).json({
            success: true,
            suppliers
        })
    } catch (err) {
        console.error("Error fetching suppliers", err)
        res.status(500).json({
            success: false,
            message: "Server error fetching suppliers",
        })
    }
};

const removeSupplier = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        await deleteSupplier(Number(id));

        res.status(200).json({
            success: true,
            message: "Supplier deleted successfully",
        });
    } catch (err) {
        console.error("Error deleting supplier", err);
        res.status(500).json({
            success: false,
            message: "Server error deleting supplier",
        });
    }
};

const regSupplier = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { company_name, contact_person, phone_number, email, address } = req.body as {
            company_name: string,
            contact_person: string,
            phone_number: string,
            email: string,
            address: string,
        };

        if (!company_name || !phone_number) {
            res.status(400).json({
                success: false,
                message: "Please enter all the required fields"
            })
            return;
        };

        const contactPersonVal = contact_person && contact_person.trim() !== "" ? contact_person : "";
        const emailVal = email && email.trim() !== "" ? email : "";
        const addressVal = address && address.trim() !== "" ? address : "";

        await createSupplier(company_name, contactPersonVal, phone_number, emailVal, addressVal);
        res.status(200).json({
            success: true,
            message: "Supplier created successfully!",
        });
    } catch (err: any) {
        console.error("Error registering supplier", err);

        res.status(500).json({
            success: false,
            message: "Server error during supplier registration",
        });
    }
}

router.get("/", showSupplier);
router.post("/", regSupplier);
router.delete("/:id", removeSupplier);

export default router;