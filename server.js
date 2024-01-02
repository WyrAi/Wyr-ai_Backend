// Import the required modules using ES6 import syntax
import express from "express";
import mongoose from "mongoose";

import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import router from "./routes/auth.js";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicpath = path.join(__dirname, "./public/logs");
const publicpath2 = path.join(__dirname, "./public/ReportImages");
app.use("/public/logs", express.static(publicpath));
app.use("/public/ReportImages", express.static(publicpath2));

// Middlewares
app.set("view engine", "hbs");
app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use("/api", router);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("connection established successfully");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
