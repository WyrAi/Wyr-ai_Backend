import {
  getUserByUsername,
  deleteSocketUser,
} from "../controller/notificationUser.js";

import User from "../models/users.js";
import Notification from "../models/notificationMessageModel.js";
import Role from "../models/role.js";
import NotificationUser from "../models/notificationUser.js";

const socket = (io) => {
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

        console.log("User connected with====>56", user, "and socket ID", socket.id);
      } catch (error) {
        console.error("Error saving notification:", error);
      }
    });

    socket.on("RelationshipsText", async ({ data }) => {
        console.log('relationshiptext methods called====>63');
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

    // socket.on("purchesText", async ({data} ) => {
    //     const { senderName, text,reciveremail } = data ||[] ;
    //     const targetEmail = senderName;
    //     const usersWithEmail = await User.find({ email: targetEmail }).select('companyId').exec();
    //     const companyId = usersWithEmail[0]?.companyId;
    //     const usersWithCompanyId = await User.find({ companyId: companyId })
    //       .populate({
    //         path: 'role',
    //         model: 'Role',
    //       })
    //       .lean()
    //       .exec();

    //     const usersWithAddEditCompanyPermission = usersWithCompanyId.filter(user => {
    //       const role = user.role;

    //       if (role && role.SelectAccess.purchaseOrder) {
    //         const relationshipManagementStrings = role.SelectAccess.purchaseOrder.map(value => value.toString());
    //         return relationshipManagementStrings.includes('Approve');
    //       }

    //       return false;
    //     });

    //   const emailsWithAddEditCompanyPermission = usersWithAddEditCompanyPermission.map(user => user.email);
    //         if (Array.isArray(emailsWithAddEditCompanyPermission)) {
    //       for (const receiver of emailsWithAddEditCompanyPermission) {
    //         await saveMessage(senderName, receiver, text);
    //       }
    //     } else {
    //       await saveMessage(senderName, emailsWithAddEditCompanyPermission, text);
    //     }

    //     const receivers = await getUserByUsername({
    //       body: {
    //         username: emailsWithAddEditCompanyPermission
    //       },
    //     });

    //     if (receivers.length) {
    //       receivers.forEach((receiver) => {
    //         io.to(receiver.socket).emit("getText", {
    //           senderName,
    //           text,
    //         });
    //       });
    //     }
    //   });

    socket.on("purchesText", async (data) => {
        console.log('purchesText methods called====>165');
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
        console.log('RoleText methods called !=====>201');
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
        console.log('PackingText methods called !=====>256');
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
};

export { socket };