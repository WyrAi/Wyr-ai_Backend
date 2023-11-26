import User from "../models/users.js";
import Relationship from "../models/relationshipModel.js";

export const companyRelationShip = async (req, res) => {
  try {
    const { role, reciverEmail, senderCompanyId } = req.body;

    const userCheck = await User.findOne({ email: reciverEmail })
      .populate("role", "name")
      .populate("companyId", "_id ");

    if (!userCheck)
      return res.status(400).json({ message: "User not exist", status: 400 });

    if (role != userCheck.role.name)
      return res
        .status(400)
        .json({ message: `This is not a ${role}`, status: 400 });

    await Relationship({
      SenderRelationId: senderCompanyId,
      ReciverRelationId: userCheck.companyId._id,
    }).save();

    return res.status(200).json({ message: "Request send", status: 200 });
  } catch (error) {
    console.log(error);
  }
};
