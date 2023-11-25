import Branch from "../models/branch.js";

const editBranch =  async (req, res) => {
    const { branchName, location, country, city, pincode } = req.body.data; 
  
    try {
      // Check if the user with the given _id exists
      const existingBranch = await Branch.findById(req.params.id);
  
      if (!existingBranch) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Update user fields
      existingBranch.branchName = branchName || existingBranch.name;
      existingBranch.location = location || existingBranch.location;
      existingBranch.country = country || existingBranch.country;
      existingBranch.city = city || existingBranch.city;
      existingBranch.pincode = pincode || existingBranch.pincode;
      // Save the updated user to the database
      await existingBranch.save();
  
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error in updating user" });
    }
  }

  export {editBranch}