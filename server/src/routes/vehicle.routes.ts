import { Request, Response, NextFunction, Router } from "express";
import { getParts, createPart, deletePart, usePart } from "../db/database.js";

const router = Router();

const showParts = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const parts = await getParts();
        res.status(200).json({
            success: true,
            parts
        })
    } catch (err) {
        console.error("Error fetching parts", err)
        res.status(500).json({
            success: false,
            message: "Server error fetching parts",
        })
    }
};

const regPart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { oem_code, part_name, category, unit_cost, selling_price, stock_quantity, reorder_threshold, supplier_id } = req.body as {
            oem_code: string,
            part_name: string,
            category: string,
            unit_cost: number,
            selling_price: number,
            stock_quantity: number,
            reorder_threshold: number,
            supplier_id: number,
        };

        if (!oem_code || !part_name || !unit_cost || !selling_price || !supplier_id) {
            res.status(400).json({
                success: false,
                message: "Please enter all the required fields"
            })
            return;
        };

        const categoryVal = category && category.trim() !== "" ? category : "";
        const stockVal = stock_quantity ?? 0;
        const thresholdVal = reorder_threshold ?? 5;

        await createPart(oem_code, part_name, categoryVal, unit_cost, selling_price, stockVal, thresholdVal, supplier_id);
        res.status(200).json({
            success: true,
            message: "Part created successfully!",
        });
    } catch (err: any) {
        console.error("Error registering part", err);

        if (err.code === "ER_DUP_ENTRY") {
            res.status(400).json({
                success: false,
                message: "A part with this OEM code already exists.",
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Server error during part registration",
        });
    }
}

const removePart = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        await deletePart(Number(id));

        res.status(200).json({
            success: true,
            message: "Part deleted successfully",
        });
    } catch (err) {
        console.error("Error deleting part", err);
        res.status(500).json({
            success: false,
            message: "Server error deleting part",
        });
    }
};

const usePartQuantity = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body as { quantity?: number };

        if (!quantity || quantity <= 0) {
            res.status(400).json({
                success: false,
                message: "A valid quantity is required.",
            });
            return;
        }

        const result = await usePart(Number(id), quantity);

        if (result.affectedRows === 0) {
            res.status(400).json({
                success: false,
                message: "Not enough stock available.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Part used and stock updated successfully!",
        });
    } catch (err) {
        console.error("Error using part", err);
        res.status(500).json({
            success: false,
            message: "Server error updating stock",
        });
    }
};

router.get("/", showParts);
router.post("/", regPart);
router.delete("/:id", removePart);
router.put("/:id/use", usePartQuantity);

export default router;