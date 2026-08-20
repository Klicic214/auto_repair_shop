import "dotenv/config";
import express, {Request, Response, NextFunction, urlencoded} from "express";
import cors from "cors";
import path from "path";
import userRouting from "./routes/users.routes.js";
import costumerRouting from "./routes/customer.routes.js";
import vehicleRouting from "./routes/vehicle.routes.js";
import appointmentRouting from "./routes/appointment.routes.js";
import partsRouting from "./routes/parts.routes.js"
import supplierRoutimg from "./routes/supplier.routes.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

const reactBuildPath = path.join(__dirname, '../../client/dist');

app.use(cors());
app.use(express.json());
app.use(urlencoded({extended: false}));

console.log("Curent dir: " + __dirname);
app.use(express.static(reactBuildPath));

app.use("/api/users", userRouting);
app.use("/api/customers", costumerRouting); 
app.use("/api/vehicles", vehicleRouting);
app.use("/api/appointments", appointmentRouting);
app.use("/api/parts", partsRouting);
app.use("/api/suppliers", supplierRoutimg)


app.get("/*splat", (req: Request, res: Response) => {
    res.sendFile(path.join(reactBuildPath,"index.html"))
})



app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});




app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});