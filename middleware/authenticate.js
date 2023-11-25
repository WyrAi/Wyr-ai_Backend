import jwt from "jsonwebtoken";
import User from "../models/users.js";

const Authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

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
    );

    if (!rootUser) {
      return res.status(401).json({ error: "Invalid token" });
    }
  
    req.user = rootUser._id;

    next();
  } catch (error) {
    console.log(error);
  }
};

export default Authenticate;
