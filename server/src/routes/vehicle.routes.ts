import { Request, Response, NextFunction, Router } from "express";
import { createVehicle, getVehicles, getVehiclesById, deleteVehicle, updateVehicle, getVehicleById } from "../db/database.js";


const router = Router();

const regVehicle = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {license_plate, make, model, manufacturing_year, customer_id} = req.body as {
            license_plate: string,
            make: string,
            model: string,
            manufacturing_year: number,
            customer_id: number
        };

         if(!license_plate || !make || !model || !manufacturing_year || !customer_id) {
            res.status(400).json({
                success: false,
                message: "Please enter all the requied fields"
            })
            return;
        };

        const resultQuery = await createVehicle(license_plate, make, model, manufacturing_year, customer_id)

        res.status(200).json({
            success: true,
            message:"Vehicle registered successfully!",
            id: resultQuery.insertId
        })
        
    } catch (err) {
        console.error("Error registering vehicle", err)
        res.status(500).json({
            success: false,
            message: "Server error during vehicle registration",
        });
        
    }
}

const showVehicle = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const vehicles = await getVehicles();
        res.status(200).json({
            success: true,
            vehicles
        })

    }catch(err){
        console.error("Error fetching vehicles",err)
        res.status(500).json({
            success: false,
            message: "Server error fetching vehicles",
        })
    }
}
const getVehicleByCustomerId = async(   
    req: Request,
    res: Response,
    next: NextFunction
    
)=> {
    try{
        const customer_id = Number (req.params.customerId)

        if(!customer_id ||isNaN(customer_id)){
            res.status(400).json({
                success: false,
                message: "Please enter all the requied fields"
            })
            return;

        };

        const vehicle = await getVehiclesById(customer_id)
          res.status(200).json({
                success: true,
                vehicle
            });

    }catch(err){
        console.error("Error fetching vehicle", err)
        res.status(500).json({
            success: false,
            message: "Server error fetching vehicle"

        })

    }
}

const removeVehicle =async(
    req: Request,
    res: Response,
    next: NextFunction
    
)=> {
    try{
        const id = Number(req.params.id)

        await deleteVehicle(id);
          res.status(200).json({
                success: true,
                message: "Vehicle deleted succesfully"
            });

    }catch(err){
        console.error("Error deleting vehicle", err);
        res.status(500).json({
            success: false,
            message: "Server error deleting vehicles"

        })
    }
}

const getVehicleByItsID = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const vehicle = await getVehicleById(Number(id));

        if (!vehicle) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            vehicle
        });
    } catch (err) {
        console.error("Error fetching vehicle", err);
        res.status(500).json({
            success: false,
            message: "Server error fetching vehicle",
        });
    }
};

const editVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { license_plate, make, model, manufacturing_year } = req.body as {
            license_plate: string;
            make: string;
            model: string;
            manufacturing_year: number;
        };

        if (!license_plate || !make || !model || !manufacturing_year) {
            res.status(400).json({
                success: false,
                message: "Please fill in all required fields.",
            });
            return;
        }

        const result = await updateVehicle(
            Number(id),
            license_plate,
            make,
            model,
            Number(manufacturing_year)
        );

        if (result.affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully!",
        });
    } catch (err) {
        console.error("Error updating vehicle", err);
        res.status(500).json({
            success: false,
            message: "Server error updating vehicle",
        });
    }
};

router.get("/", showVehicle);
router.get("/customer/:customerId", getVehicleByCustomerId
);
router.post("/", regVehicle);
router.delete("/:id", removeVehicle);
router.get("/:id", getVehicleByItsID);
router.put("/:id", editVehicle);

export default router;