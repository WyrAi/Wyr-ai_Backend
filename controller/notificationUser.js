// routes/notificationUser.js
import NotificationUser from "../models/notificationUser.js";

const Notification = async (req, res) => {
  try {
    const { user, socket } = req.body;
    console.log("req.body",req.body)

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
    console.log("51======>",username);

    if (!username || !Array.isArray(username)) {
      return res.status(400).json({ message: "Invalid input", status: 400 });
    }

     const users = await NotificationUser.find({ user: { $in: username } });
     console.log("getusers 58====>",users);
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found", status: 404 });
    }
   //res.status(200).send(users);
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
    const uniqueUsers = [...new Set(receiverData.map(item => item.user))];

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

      console.log("req.paras",socket);
  
      if (res) {
        const deletedUser = await NotificationUser.findOneAndDelete({ socket: socket });
  
        if (!deletedUser) {
          return res.status(404).json({ message: "User not found" });
        }
  
        res.status(200).json({ message: "User deleted successfully", deletedUser });
      } else {

        const deletedUser = await NotificationUser.findOneAndDelete({ socket: socket });
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
  

export {Notification,getUserByUsername,deleteSocketUser,getusername};
