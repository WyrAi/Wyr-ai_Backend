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

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://wyr-ai.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers = [];
const offlineMessages = {};
const socketToUserId = {};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

async function saveMessage(sender, receiver, text) {
  const existingNotification = await Notification.findOne({
    receiverid: receiver,
  });

  if (existingNotification) {
    existingNotification.messages.push({
      message: text,
    });

    await existingNotification.save();
  } else {
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

io.on("connection", (socket) => {
  socket.on("newUser", async (user) => {
    try {
      const notification = new NotificationUser({
        user: user,
        socket: socket.id,
      });
      await notification.save();
      socket.emit("sockeid", socket.id);
      console.log("socketId", socket.id);

      console.log("User connected with", user, "and socket ID", socket.id);
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });

  socket.on("RelationshipsText", async ({ data }) => {
    const { senderName, text } = data;
    const usersWithEmail = await User.find({ email: senderName })
      .select("companyId")
      .exec();
    const companyId = usersWithEmail[0]?.companyId;
    const usersWithCompanyId = await User.find({ companyId: companyId })
      .populate({
        path: "role",
        model: "Role",
      })
      .lean()
      .exec();

    const usersWithAddEditCompanyPermission = usersWithCompanyId.filter(
      (user) => {
        const role = user.role;

        if (role && role.SelectAccess.relationshipManagement) {
          const relationshipManagementStrings =
            role.SelectAccess.relationshipManagement.map((value) =>
              value.toString()
            );
          return relationshipManagementStrings.includes("Add/Edit Company");
        }

        return false;
      }
    );

    const emailsWithAddEditCompanyPermission =
      usersWithAddEditCompanyPermission.map((user) => user.email);
    if (Array.isArray(emailsWithAddEditCompanyPermission)) {
      for (const receiver of emailsWithAddEditCompanyPermission) {
        await saveMessage(senderName, receiver, text);
      }
    } else {
      await saveMessage(senderName, emailsWithAddEditCompanyPermission, text);
    }

    const receivers = await getUserByUsername({
      body: {
        username: emailsWithAddEditCompanyPermission,
      },
    });

    io.emit("getText", {
      senderName,
      text,
    });
  });

  socket.on("purchesText", async (data) => {
    const { senderName, text, employeeIds } = data || [];
    if (!employeeIds || !Array.isArray(employeeIds)) {
      return res
        .status(400)
        .json({ error: "Invalid input. 'employeeIds' should be an array." });
    }
    const emails = await User.find({ _id: { $in: employeeIds } }).select(
      "email"
    );
    const reciveremail = emails.map((employee) => employee.email);
    if (Array.isArray(reciveremail)) {
      for (const receiver of reciveremail) {
        await saveMessage(senderName, receiver, text);
      }
    } else {
      await saveMessage(senderName, emailsWithAddEditCompanyPermission, text);
    }

    const receivers = await getUserByUsername({
      body: {
        username: reciveremail,
      },
    });

    if (receivers.length) {
      receivers.forEach((receiver) => {
        io.to(receiver.socket).emit("getText", {
          senderName,
          text,
        });
      });
    }
  });

  socket.on("RoleText", async (data) => {
    const { senderName, text } = data;
    const targetEmail = senderName;
    const usersWithEmail = await User.find({ email: targetEmail })
      .select("companyId")
      .exec();
    const companyId = usersWithEmail[0]?.companyId;
    const usersWithCompanyId = await User.find({ companyId: companyId })
      .populate({
        path: "role",
        model: "Role",
      })
      .lean()
      .exec();

    const usersWithAddEditCompanyPermission = usersWithCompanyId.filter(
      (user) => {
        const role = user.role;

        if (role && role.SelectAccess.userManagement) {
          const relationshipManagementStrings =
            role.SelectAccess.userManagement.map((value) => value.toString());
          return relationshipManagementStrings.includes("Create/Edit User");
        }
        return false;
      }
    );

    const emailsWithAddEditCompanyPermission =
      usersWithAddEditCompanyPermission.map((user) => user.email);
    if (Array.isArray(emailsWithAddEditCompanyPermission)) {
      for (const receiver of emailsWithAddEditCompanyPermission) {
        await saveMessage(senderName, receiver, text);
      }
    } else {
      await saveMessage(senderName, emailsWithAddEditCompanyPermission, text);
    }

    const receivers = await getUserByUsername({
      body: {
        username: emailsWithAddEditCompanyPermission,
      },
    });

    if (receivers.length) {
      receivers.forEach((receiver) => {
        io.emit("getText", {
          senderName,
          text,
        });
      });
    }
  });

  socket.on("PackingText", async ({ data }) => {
    const { senderName, text } = data;
    const targetEmail = senderName;
    const usersWithEmail = await User.find({ email: targetEmail })
      .select("companyId")
      .exec();
    const companyId = usersWithEmail[0]?.companyId;
    const usersWithCompanyId = await User.find({ companyId: companyId })
      .populate({
        path: "role",
        model: "Role",
      })
      .lean()
      .exec();

    const usersWithAddEditCompanyPermission = usersWithCompanyId.filter(
      (user) => {
        const role = user.role;

        if (role && role.SelectAccess.packingList) {
          const relationshipManagementStrings =
            role.SelectAccess.packingList.map((value) => value.toString());
          return relationshipManagementStrings.includes("Approve");
        }

        return false;
      }
    );

    const emailsWithAddEditCompanyPermission =
      usersWithAddEditCompanyPermission.map((user) => user.email);
    if (Array.isArray(emailsWithAddEditCompanyPermission)) {
      for (const receiver of emailsWithAddEditCompanyPermission) {
        await saveMessage(senderName, receiver, text);
      }
    } else {
      await saveMessage(senderName, emailsWithAddEditCompanyPermission, text);
    }

    const receivers = await getUserByUsername({
      body: {
        username: emailsWithAddEditCompanyPermission,
      },
    });

    if (receivers.length) {
      receivers.forEach((receiver) => {
        io.to(receiver.socket).emit("getText", {
          senderName,
          text,
        });
      });
    }
  });

  socket.on("CompanybranchText", async ({ data }) => {
    const { senderName, text } = data;
    const targetEmail = senderName;
    const usersWithEmail = await User.find({ email: targetEmail })
      .select("companyId")
      .exec();
    const companyId = usersWithEmail[0]?.companyId;
    const usersWithCompanyId = await User.find({ companyId: companyId })
      .populate({
        path: "role",
        model: "Role",
      })
      .lean()
      .exec();

    const usersWithAddEditCompanyPermission = usersWithCompanyId.filter(
      (user) => {
        const role = user.role;

        if (role && role.SelectAccess.userManagement) {
          const relationshipManagementStrings =
            role.SelectAccess.userManagement.map((value) => value.toString());
          return relationshipManagementStrings.includes("Add/Edit Branch");
        }

        return false;
      }
    );

    const emailsWithAddEditCompanyPermission =
      usersWithAddEditCompanyPermission.map((user) => user.email);
    if (Array.isArray(emailsWithAddEditCompanyPermission)) {
      for (const receiver of emailsWithAddEditCompanyPermission) {
        await saveMessage(senderName, receiver, text);
      }
    } else {
      await saveMessage(senderName, emailsWithAddEditCompanyPermission, text);
    }

    const receivers = await getUserByUsername({
      body: {
        username: emailsWithAddEditCompanyPermission,
      },
    });

    if (receivers.length) {
      receivers.forEach((receiver) => {
        io.to(receiver.socket).emit("getText", {
          senderName,
          text,
        });
      });
    }
  });

  socket.on("remove", async (socket) => {
    const receivers = await deleteSocketUser({
      params: {
        socket: socket,
      },
    });
    console.log("user with disconnected with", socket);
  });
});

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
