import jwt from "jsonwebtoken";
import User from "../models/users.js";

const Authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log(typeof token);
    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied...No token provided..." });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken) return res.status(401).json({ error: "Invalid token" });

    const rootUser = await User.findOne(
      { _id: verifyToken._id },
      { _id: 1, name: 1, email: 1 }
    ).populate("role", "name _id");

    if (!rootUser) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = rootUser._id;
    req.roleName = rootUser.role.name;

    next();
  } catch (error) {
    console.log(error);
  }
};

export default Authenticate;
