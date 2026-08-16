import { Request, Response, NextFunction, Router } from "express";
import { createVehicle, getVehicles, getVehiclesById, deleteVehicle } from "../db/database.js";


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
const getVehicleID = async(   
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

router.get("/", showVehicle);
router.get("/customer/:customerId", getVehicleID);
router.post("/", regVehicle);
router.delete("/:id", removeVehicle);

export default router;