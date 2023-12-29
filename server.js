// // Import the required modules using ES6 import syntax
// import express from "express";
// import mongoose from "mongoose";
// import http from "http";
// import { Server } from "socket.io";
// import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config({ path: "./.env" });
// import router from "./routes/auth.js";
// import morgan from "morgan";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// const app = express();
// const port = process.env.PORT || 5000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// //import socket connection.
// import { socket } from "./Methods/socketMethods.js";
// console.log(process.env.VERCEL_URL);
// const server = http.createServer(app);
// // const io = new Server(server, {
// //   cors: {
// //     // origin: process.env.VERCEL_URL,
// //     origin: true,
// //     methods: ["GET", "POST"],
// //   },
// // });

// socket(io);
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173", "https://wyr-ai.vercel.app"], 
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });
// const publicpath = path.join(__dirname, "./Public/logs");
// app.use(express.static(publicpath));

// // Middlewares
// // app.use(express.static(publicDir));
// app.set("view engine", "hbs");
// app.use(morgan("dev"));
// app.use(express.json({ limit: "100mb" }));
// app.use(express.urlencoded({ extended: true }));
// // app.use(cors());
// app.use(cors({ origin: true, credentials: true }));
// import Notification from "./models/notificationMessageModel.js";
// import User from "./models/users.js";
// import Role from "./models/role.js";
// app.use("/api", router);

// const uri = process.env.ATLAS_URI;
// mongoose.connect(uri);

// const connection = mongoose.connection;
// connection.once("open", () => {
//   console.log("connection established successfully");
// });

// server.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });




// Import the required modules using ES6 import syntax socket implement on server.js
import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import router from "./routes/auth.js";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { getUserByUsername, deleteSocketUser } from "./controller/notificationUser.js";
import User from "./models/users.js";
import Notification from "./models/notificationMessageModel.js";
import Role from "./models/role.js";
import NotificationUser from "./models/notificationUser.js";

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     // origin: process.env.VERCEL_URL,
//     origin: true,
//     methods: ["GET", "POST"],
//   },
// });

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://wyr-ai.vercel.app"],
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});
socket(io);

const publicpath = path.join(__dirname, "./Public/logs");
app.use(express.static(publicpath));

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

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

