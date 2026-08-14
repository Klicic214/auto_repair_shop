import { Request, Response, NextFunction, Router } from "express";
import { createMechanics, authMechanic, resetMechanic} from "../db/database.js";

const router = Router();

const loginMechanic = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {email, password} = req.body as {
            email?: string;
            password?: string;
        };

        if (!email || !password){
            res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });

            return;
        }

        const queryRes = await authMechanic(email);
        if(queryRes.length == 0){
            res.status(401).json({
                success: false,
                message: "Email is not registered"
            })

            return;
        }

        const user = queryRes[0];
        if (password != user.password){
            res.status(401).json({
                success: false,
                message: "Wrong password",
            })
        
            return;
        }


        res.status(201).json({
            success: true,
            message: "Login succesfull",
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            },
        }) 
    } catch(err){
        console.error("Logging error", err);
        res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }

}

const regMechanic = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { first_name, last_name, phone, specialization, email, password } = req.body as {
            first_name?: string;
            last_name?: string;
            phone?: string;
            specialization?: string;
            email?: string;
            password?: string;
        };

        if (!first_name || !last_name || !phone || !email || !password) {
            res.status(400).json({
                success: false,
                message: "Please fill in all required fields.",
            });
            return;
        }

        const specializationValue = specialization && specialization.trim() !== "" ? specialization : "";

        createMechanics( first_name, last_name, specializationValue, phone, email,password );

        res.status(201).json({
            success: true,
            message: "Mechanic registered successfully!",
        });
    } catch (err: any) {
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

const resMechanic = async(
    req: Request,
    res: Response,
    next: NextFunction,
) =>{ try {
    const {email, newPassword}= req.body as{
        email?: string;
        newPassword?: string
    };

    if(!email || !newPassword){
        res.status(400).json({
            success: false,
            message: "Please fill in all required fields."
            
        })
        return;
    }
     const queryRes = await authMechanic(email);

     if(queryRes.length == 0){
        res.status(401).json ({
            success: false,
            message: "Email is not registered"
        })
        return;
     }

     await resetMechanic(email,newPassword) 

     res.status(200).json({
        success: true,
        message: "Password reset"
     })
    

}catch(err){
    console.error("Passwor change error", err);
    res.status(500).json({
            success: false,
            message: "Server error during password reset",
        });
} 
}

router.post("/login", loginMechanic);
router.post("/register", regMechanic);
router.post("/reset", resMechanic);

export default router;