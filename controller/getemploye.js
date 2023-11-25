
import Employee from "../models/users.js";

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find(req.query);
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in fetching employees" });
  }
};

export { getEmployees };
