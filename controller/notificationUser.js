// routes/notificationUser.js
import NotificationUser from "../models/notificationUser.js";


// Route to save a NotificationUser
const Notification = async (req, res) => {
  try {
    const { user, socket } = req.body;

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
  
      // Find the user in the database based on the username
      const user = await NotificationUser.findOne({ user: username });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error getting user by username:", error);
      res.status(500).send("Internal Server Error");
    }
  };


  const deleteSocketUser = async (req, res) => {
    try {
      const { username } = req.params;
  
      // Delete the user from the database based on the username
      const deletedUser = await NotificationUser.findOneAndDelete({ user: username });
  
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
      console.error("Error deleting user by username:", error);
      res.status(500).send("Internal Server Error");
    }
  };

export {Notification,getUserByUsername,deleteSocketUser};
