// Import the required modules using ES6 import syntax
import express from "express";
import mongoose from "mongoose";

// Import the required modules for socket io
import http from "http";
import { Server } from "socket.io";

// import { dirname } from "path";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import router from "./routes/auth.js";
import morgan from "morgan";
import { getUserByUsername,deleteSocketUser } from "./controller/notificationUser.js";
// import hbs from "hbs";

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);

//Socket io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
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

//function for notificatoin using socket io
let onlineUsers = [];
const offlineMessages = {};

const addNewUser = (username, socketId) => {
  !onlineUsers.some(
    (user) => user.username === username && user.socketId === socketId
  ) && onlineUsers.push({ username, socketId });
  console.log("user", onlineUsers);
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  // console.log("socketID removed user:",user.username,socketId)
};

const getUser = (username) => {
  console.log("username in get user", username);
  return onlineUsers.filter((user) => user.username === username);
};

const sendOfflineMessages = (socket, user) => {
  const userOfflineMessages = offlineMessages[user];

  console.log("userOfflineMessage", userOfflineMessages);
  console.log("userOfflineMessage.length", userOfflineMessages.length);

  if (userOfflineMessages && userOfflineMessages.length > 0) {
    userOfflineMessages.forEach((message) => {
      console.log("messagfe", message);
      // socket.emit("sendText", message);
    });
    socket.emit("receive",message);

    delete offlineMessages[user];
  }
};

io.on("connection", (socket) => {
  socket.on("newUser", (user) => {
    console.log("user connected with", user, socket.id);
    addNewUser(user, socket.id);
    sendOfflineMessages(socket, user);
  });


  socket.on("sendText", async ({ data }) => {
    console.log("data", data);

    const { senderName, receiverName, text } = data;

    console.log("object", senderName, receiverName, text);
    // const receivers = getUser(receiverName);
    const receivers = await getUserByUsername({
      params: {
        username: receiverName,
      },
    });
    console.log("receivers",receivers)
    if (receivers.length) {
      console.log("receivers and message", receivers[0], text);
      receivers.forEach((receiver) => {
        console.log("receivertext",receiver.socket)
        io.to(receiver.socket).emit("getText", {
          senderName,
          text,
        });
      });
    } else {
      if (!offlineMessages[receiverName]) {
        offlineMessages[receiverName] = [];
      }
      offlineMessages[receiverName].push({ receiverName, text });
      console.log("offlineMessages", offlineMessages);
    }
  });

  socket.on("remove", async(socket) => {
    console.log("socket in disconnect",socket)
    const receivers = await deleteSocketUser({
      params: {
        socket: socket,
      },
    });

    console.log("user with disconnected with", socket);
  });
});
//===============================

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
