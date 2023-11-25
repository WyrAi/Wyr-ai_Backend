import Employee from "../models/users.js";

const deleteEmploye =async (req, res) => {
    const { userIds } = req.body;
  
    try {
      // Delete multiple users by their IDs
      const result = await Employee.deleteMany({ _id: { $in: userIds } });
  
      res.json({ success: true, message: `${result.deletedCount} users deleted successfully` });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  export {deleteEmploye}