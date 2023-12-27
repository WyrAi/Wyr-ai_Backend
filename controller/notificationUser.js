// routes/notificationUser.js
import NotificationUser from "../models/notificationUser.js";
import Notification from "../models/notificationMessageModel.js";
import User from "../models/users.js";

const Notification1 = async (req, res) => {
  try {
    const { user, socket } = req.body;
    console.log("req.body", req.body);

    const newNotificationUser = new NotificationUser({
      user,
      socket,
    });

    const savedNotificationUser = await newNotificationUser.save();

    res.status(201).json(savedNotificationUser);
  } catch (error) {
    console.error("Error saving NotificationUser:", error);
    res.status(500).send("Internal Server Error");
  }
};

// const getUserByUsername = async (req, res) => {
//     try {
//       const { username } = req.params || req.body;
//       if (res) {
//         const user = await NotificationUser.find({ user: username });

//         if (!user) {
//           return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json(user);
//       } else {
//         const user = await NotificationUser.find({ user: username });
//         return user;       }
//     } catch (error) {
//       console.error("Error getting user by username:", error);

//       if (res) {
//         res.status(500).send("Internal Server Error");
//       } else {
//         throw error;
//       }
//     }
//   };

const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.body;
    //console.log("51======>",username);

    if (!username || !Array.isArray(username)) {
      return res.status(400).json({ message: "Invalid input", status: 400 });
    }

    const users = await NotificationUser.find({ user: { $in: username } });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found", status: 404 });
    }
    return users;
  } catch (error) {
    console.error("Error getting users by usernames:", error);
    if (res) {
      res.status(500).send("Internal Server Error");
    } else {
      throw error;
    }
  }
};

const getusername = async (req, res) => {
  try {
    const receiverData = await NotificationUser.find({});
    const uniqueUsers = [...new Set(receiverData.map((item) => item.user))];

    console.log(uniqueUsers);
    res.status(200).send(uniqueUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteSocketUser = async (req, res) => {
  try {
    const { socket } = req.params;

    console.log("req.paras", socket);

    if (res) {
      const deletedUser = await NotificationUser.findOneAndDelete({
        socket: socket,
      });

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res
        .status(200)
        .json({ message: "User deleted successfully", deletedUser });
    } else {
      const deletedUser = await NotificationUser.findOneAndDelete({
        socket: socket,
      });
      return deletedUser;
    }
  } catch (error) {
    console.error("Error deleting user by username:", error);

    if (res) {
      res.status(500).send("Internal Server Error");
    } else {
      throw error;
    }
  }
};

// const getNotification = async (req, res) => {
//   try {
//     const email = req.params.email;
//     console.log("Email:", email);
//     const notifications = await Notification.aggregate([
//       {
//         $match: { receiverid: email }
//       },
//       {
//         $unwind: "$messages"
//       },
//       {
//         $project: {
//           _id:0,
//           messageId: "$messages._id",
//           message: "$messages.message",
//           seen: "$messages.seen"
//         }
//       }
//     ])

//   console.log("Aggregated Notifications:", notifications);
//     res.status(200).json({status:200,msg:"notification data",data:notifications});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const getNotification = async (req, res) => {
  try {
    const email = req.params.email;
    console.log("Email:", email);

    const notifications = await Notification.find({ receiverid: email })
      .select({
        "messages._id": 1,
        "messages.message": 1,
        "messages.seen": 1,
        _id: 0,
      })
      .lean()
      .exec();
      if(notifications){
        const flattenedNotifications = notifications.reduce(
          (result, notification) => {
            if (notification.messages && notification.messages.length > 0) {
              result.push(
                ...notification.messages.map((message) => ({
                  messageId: message._id,
                  message: message.message,
                  seen: message.seen,
                }))
              );
            }
            return result;
          },
          []
        );
        console.log("Flattened Notifications:", flattenedNotifications);
        res.status(200).json({
          status: 200,
          msg: "notification data",
          data: flattenedNotifications,
        });
      }
      else{
        res.status(200).json({
          status: 200,
          msg: "notification data",
          data: "",
        });
      }

  } catch (error) {
    console.log(error);
  }
};

const updateSeenStatus = async (req, res) => {
  try {
    const { receiverid } = req.body;
    console.log("receiverid", req.body);
    const receiver = await Notification.findOne({ receiverid: receiverid });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    receiver.messages.forEach((message) => {
      message.seen = true;
    });
    await receiver.save();

    res.json({ message: "Notification status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getemailsofempolyes = async (req, res) => {
  try {
    const { employeeIds } = req.body;
    if (!employeeIds || !Array.isArray(employeeIds)) {
      return res
        .status(400)
        .json({ error: "Invalid input. 'employeeIds' should be an array." });
    }
    const emails = await User.find({ _id: { $in: employeeIds } }).select(
      "email"
    );
    const emailArray = emails.map((employee) => employee.email);
    res.json({ emails: emailArray });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  Notification1,
  getUserByUsername,
  deleteSocketUser,
  getusername,
  getNotification,
  updateSeenStatus,
  getemailsofempolyes,
};
