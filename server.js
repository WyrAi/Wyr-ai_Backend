// Import the required modules using ES6 import syntax
import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import router from "./routes/auth.js";
import morgan from "morgan";
const app = express();
const port = process.env.PORT || 5000;


//import socket connection.
import { socket } from "./Methods/socketMethods.js";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: process.env.VERCEL_URL,
    origin: "http://localhost:5173/" ,
    methods: ["GET", "POST"],
  },
});
socket(io);

// Middlewares
// app.use(express.static(publicDir));
app.set("view engine", "hbs");
app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", router);


const uri = process.env.ATLAS_URI; 
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("connection established successfully");
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
