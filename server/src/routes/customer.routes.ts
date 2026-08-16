import { Request, Response, NextFunction, Router } from "express";
import { getCustomers,createCustomer, deleteCustomer, getCustomerById, updateCustomer} from "../db/database.js";


const router = Router();

const showCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction,
) =>{
    try {
        const customers = await getCustomers();
        res.status(200).json({
            success:true,
            customers
        })
    } catch (err){
        console.error("Error fetching customer", err)
        res.status(500).json({
            success: false,
            message: "Server error fetching customers",
        })
    }
};


const removeCustomer = async (
    req: Request, 
    res: Response

) => {
    try {
        const { id } = req.params;
        await deleteCustomer(Number(id));
        
        res.status(200).json({
            success: true,
            message: "Customer deleted successfully",
        });
    } catch (err) {
        console.error("Error deleting customer", err);
        res.status(500).json({
            success: false,
            message: "Server error deleting customer",
        });
    }
};



const regCustomers = async (
    req: Request,
    res: Response,
    next: NextFunction

) => {
    try{
        const{first_name, last_name, phone, email,address}= req.body as {
            first_name: string,
            last_name: string,
            phone: string,
            email: string,
            address: string,
        };

        if(!first_name || !last_name || !phone || !email) {
            res.status(400).json({
                success: false,
                message: "Please enter all the requied fields"
            })
            return;
        };

        const addressVal  = address && address.trim() !== "" ? address : "";

        await createCustomer(first_name, last_name,phone,email,addressVal);
        res.status(200).json({
            success: true,
            message: "Customer created successfully!",
        });
    }catch (err: any) {
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

}

const getCustomerID = async (
    req: Request,
    res: Response,
) => {
    try {
        const { id } = req.params;
        const customer = await getCustomerById(Number(id));

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
    } catch (err) {
        console.error("Error fetching customer", err);
        res.status(500).json({
            success: false,
            message: "Server error fetching customer",
        });
    }
};

const editCustomer = async (
    req: Request,
    res: Response,
) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, phone, email, address } = req.body as {
            first_name: string;
            last_name: string;
            phone: string;
            email: string;
            address: string;
        };

        if (!first_name || !last_name || !phone || !email) {
            res.status(400).json({
                success: false,
                message: "Please fill in all required fields.",
            });
            return;
        }

        const result = await updateCustomer(
            Number(id),
            first_name,
            last_name,
            phone,
            email,
            address || ""
        );

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
    } catch (err) {
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

    export default router;