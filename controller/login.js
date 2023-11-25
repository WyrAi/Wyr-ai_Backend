import { TokenGernate } from "../Methods/authMethods.js";
import { comparePassword } from "../middleware/authMiddleware.js";
import User from "../models/users.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
     if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill the fields", status: 400 });
    }

    const userLogin = await User.findOne(
      { email: email },
      { _id: 1, email: 1, password: 1 }
    );
    if (!userLogin) {
      return res.status(400).json({ message: "User not found", status: 400 });
    }

    if (!userLogin.password)
      return res
        .status(404)
        .json({ message: "Please update your information", status: 400 });

    const passwordMatch = await comparePassword(password, userLogin.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid Password", status: 400 });
    }

    const token = await TokenGernate(userLogin._id);
    return res.status(200).json({
      message: "User Login successfully",
      token,
      status: 200,
    });
  } catch (err) {
    console.log(err);
  }
};

export { login };
