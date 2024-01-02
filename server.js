// Import the required modules using ES6 import syntax
import express from "express";
import mongoose from "mongoose";

import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import router from "./routes/auth.js";
import morgan from "morgan";
import path from "path";
import http from "http";
import { Server } from "socket.io";
// import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicpath = path.join(__dirname, "./Public/logs");
app.use(express.static(publicpath));

// Middlewares
app.set("view engine", "hbs");
app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use("/api", router);


//socket connection.
import { socket } from "./Methods/socketMethods.js";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: process.env.VERCEL_URL,
    origin: "http://localhost:5173/" | "https://wyr-ai.vercel.app",
    methods: ["GET", "POST"],
  },
});
socket(io);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("connection established successfully");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
