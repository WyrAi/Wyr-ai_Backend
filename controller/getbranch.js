import Branch from "../models/branch.js";

const getbranch = async (req, res) => {
  try {
    const branch = await Branch.find(req.query);
    res.status(200).json(branch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in fetching branch " });
  }
};

export { getbranch };