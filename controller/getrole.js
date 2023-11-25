import Role from "../models/role.js";

const getRole = async (req, res) => {

  
  try {
    const employees = await Role.find(req.query);
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in fetching roles" });
  }
};

export { getRole };