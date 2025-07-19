import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
// import connectDB from "./loader/database/index";
import connectDB from "./loader/database/index.js";
// import authRoutes from "./routes";
import authRoutes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
