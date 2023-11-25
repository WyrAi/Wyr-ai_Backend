import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const TokenVerify = async (req, res, next) => {
  try {
    const token = req.header("authtok");
    if (!token) return res.status(400).json({ msg: "Invalid Authentication" });

    const decoded = Jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded)
      return res.status(400).json({ msg: "Invalid Authentication" });

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.log(error);
  }
};

export default TokenVerify;
