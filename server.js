// Import the required modules using ES6 import syntax
import express from "express";
import mongoose from "mongoose";
// import { dirname } from "path";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import router from "./routes/auth.js";
import morgan from "morgan";
// import hbs from "hbs";

const app = express();
const port = process.env.PORT || 5000;
// const __dirname = dirname(__filename);
// const publicDir = path.join(__dirname, "public");

// Middlewares
// app.use(express.static(publicDir));
app.set("view engine", "hbs");
app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", router);

const uri = process.env.ATLAS_URI; // Connection string for MongoDB
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("connection established successfully");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
