import Employe from "../models/users.js"

const updateEmploye =  async (req, res) => {
    const { name, employeeId, email, phone, role, officeBranch, profileImage } = req.body;
  
    try {
      // Check if the user with the given _id exists
      const existingUser = await Employe.findById(req.params.id);
  
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Update user fields
      existingUser.name = name || existingUser.name;
      existingUser.employeeId = employeeId || existingUser.employeeId;
      existingUser.email = email || existingUser.email;
      existingUser.phone = phone || existingUser.phone;
      existingUser.role = role || existingUser.role;
      existingUser.officeBranch = officeBranch || existingUser.officeBranch;
      existingUser.profileImage = profileImage || existingUser.profileImage;
  
      // Save the updated user to the database
      await existingUser.save();
  
      res.status(200).json({ message: "User updated successfully", user: existingUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error in updating user" });
    }
  }

  export {updateEmploye}