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
    // origin: process.env.VERCEL_URL,
    origin: "http://localhost:5173/" ,
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
import Message from "./models/message.js";
import Notification from "./models/notificationMessageModel.js";
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

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  // console.log("socketID removed user:",user.username,socketId)
};

async function saveMessage(sender, receiver, text) {
  const existingNotification = await Notification.findOne({ receiverid: receiver });

  if (existingNotification) {
    // If the notification for the receiver exists, push a new message
    existingNotification.messages.push({
      message: text,
    });

    await existingNotification.save();
  } else {
    // If the notification for the receiver doesn't exist, create a new notification
    const newNotification = new Notification({
      receiverid: receiver,
      messages: [
        {
          message: text,
        },
      ],
    });

    await newNotification.save();
  }
}

import NotificationUser from "./models/notificationUser.js";
io.on("connection", (socket) => {
  socket.on("newUser", (user) => {
    console.log("user connected with", user, socket.id);
  });


  socket.on("sendText", async ({data} ) => {
    //console.log("data", data);

    const receiverData = await NotificationUser.find({});
    const receiverName = [...new Set(receiverData.map(item => item.user))];

    const { senderName, text } = data ;
    // if (!senderName || !text) {
    //   return res.status(400).json({ message: "Missing required fields", status: 400 });
    // }
    
    // console.log("103====>",senderName);
    // console.log("76===>",receiverName);
    if (Array.isArray(receiverName)) {
      for (const receiver of receiverName) {
        await saveMessage(senderName, receiver, text);
      }
    } else {
      await saveMessage(senderName, receiverName, text);
    }


    // const existingMessage = await Message.findOne({ userid: senderName, senderid: senderName });
    // if (existingMessage) {
    //   await Message.updateOne(
    //     { userid: senderName, senderid: senderName, "messages.receiverid": receiverName },
    //     { $push: { "messages.$.texts": { message: text } } }
    //   );
    // } else {
    //   const newMessage = new Message({
    //     userid: senderName,
    //     senderid: senderName,
    //     messages: [{ receiverid: receiverName, texts: [{ message: text }] }],
    //   });
    
    //   console.log("newMessage ===> ", newMessage);
    //   await newMessage.save();
    // }
    //console.log("object", senderName, text);
    // const receivers = getUser(receiverName);
   
    
    const receivers = await getUserByUsername({
      body: {
        username: receiverName
      },
    });
    console.log("receivers===>",receivers)
    if (receivers.length) {
      //console.log("receivers and message", receivers[0], text);
      receivers.forEach((receiver) => {
        //console.log("receivertext",receiver.socket)
        io.to(receiver.socket).emit("getText", {
          senderName,
          text,
        });
      });
    } else {
      
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


server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
