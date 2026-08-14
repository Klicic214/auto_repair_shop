import "dotenv/config";
import express, {Request, Response, NextFunction, urlencoded} from "express";
import cors from "cors";
import path from "path";
import userRouting from "./routes/users.routes.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());
app.use(urlencoded({extended: false}));

console.log("Curent dir: " + __dirname);

app.use(express.static(path.join(__dirname, "frontend-build")));
app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname,"index.html"))
})

app.use("/users", userRouting);
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