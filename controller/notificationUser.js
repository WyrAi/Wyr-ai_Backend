// routes/notificationUser.js
import NotificationUser from "../models/notificationUser.js";


// Route to save a NotificationUser
const Notification = async (req, res) => {
  try {
    const { user, socket } = req.body;
    console.log("req.body",req.body)

    // Create a new NotificationUser document
    const newNotificationUser = new NotificationUser({
      user,
      socket,
    });

    // Save the document to the database
    const savedNotificationUser = await newNotificationUser.save();

    res.status(201).json(savedNotificationUser);
  } catch (error) {
    console.error("Error saving NotificationUser:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getUserByUsername = async (req, res) => {
    try {
      const { username } = req.params;
  
      // Check if it's an API call
      if (res) {
        // API call
        // Find the user in the database based on the username
        const user = await NotificationUser.find({ user: username });
  
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
  
        res.status(200).json(user);
      } else {
        // Regular function call
        const user = await NotificationUser.find({ user: username });
        return user; // Return the user or null if not found
      }
    } catch (error) {
      console.error("Error getting user by username:", error);
  
      // Check if it's an API call
      if (res) {
        // API call
        res.status(500).send("Internal Server Error");
      } else {
        // Regular function call
        throw error; // Rethrow the error for the calling code to handle
      }
    }
  };
  

  const deleteSocketUser = async (req, res) => {
    try {
      const { socket } = req.params;

      console.log("req.paras",socket);
  
      // Check if it's an API call
      if (res) {
        // API call
        // Delete the user from the database based on the username
        const deletedUser = await NotificationUser.findOneAndDelete({ socket: socket });
  
        if (!deletedUser) {
          return res.status(404).json({ message: "User not found" });
        }
  
        res.status(200).json({ message: "User deleted successfully", deletedUser });
      } else {
        // Regular function call
        const deletedUser = await NotificationUser.findOneAndDelete({ socket: socket });
        return deletedUser; // Return the deleted user or null if not found
      }
    } catch (error) {
      console.error("Error deleting user by username:", error);
  
      // Check if it's an API call
      if (res) {
        // API call
        res.status(500).send("Internal Server Error");
      } else {
        // Regular function call
        throw error; // Rethrow the error for the calling code to handle
      }
    }
  };
  

export {Notification,getUserByUsername,deleteSocketUser};
