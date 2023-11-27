import User from "../models/users.js";
import Relationship from "../models/relationshipModel.js";
import Companydetails from "../models/companydetails.js";
import { HashMethod } from "../Methods/HashMethods.js";

//RelationShip Api
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

    const hashInput = [
      senderCompanyId.toString(),
      userCheck.companyId._id.toString(),
    ];

    const hash = HashMethod(hashInput);

    // const hash = hashInput[0] + hashInput[1];

    const relationshipCheck = await Relationship.find({ HashKey: hash });

    if (relationshipCheck.length > 0)
      return res
        .status(409)
        .json({ message: "relation allready exist ", status: 409 });

    const newRelation = await Relationship({
      SenderRelationId: senderCompanyId,
      ReceiverRelationId: userCheck.companyId._id,
      HashKey: hash,
    }).save();

    res.status(200).json({ message: "Request send", status: 200 });

    await Companydetails.findByIdAndUpdate(
      {
        _id: userCheck.companyId._id,
      },
      {
        $push: {
          companyRelations: {
            companyId: senderCompanyId,
            relationId: newRelation._id,
          },
        },
      }
    );

    await Companydetails.findByIdAndUpdate(
      {
        _id: senderCompanyId,
      },
      {
        $push: {
          companyRelations: {
            companyId: userCheck.companyId._id,
            relationId: newRelation._id,
          },
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//Display RelationShips by Companyies
export const displayRelations = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ message: "Id is required", status: 400 });

    const AllData = await Companydetails.find(
      {
        _id: id,
      },
      { companyRelations: 1 }
    ).populate("companyRelations.relationId");

    if (AllData.length > 0)
      return res
        .status(200)
        .json({ message: "Data", status: 200, data: AllData });
  } catch (error) {
    console.log(error);
  }
};

//Get all user by own role
export const getAllCompanyByRole = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ message: "Id is required", status: 400 });

    const AllRelations = await Companydetails.find(
      { _id: id },
      {
        companyRelations: 1,
      }
    ).populate(
      "companyRelations.companyId",
      "_id name addres country city pincode companyRole"
    );

    let AllFields;

    if (AllRelations.length > 0) {
      AllFields = {
        Buyer: AllRelations[0].companyRelations.filter(
          (data) => data.companyId.companyRole == "Buyer"
        ),
        Factory: AllRelations[0].companyRelations.filter(
          (data) => data.companyId.companyRole == "Factory"
        ),
        "QC Agency": AllRelations[0].companyRelations.filter(
          (data) => data.companyId.companyRole == "QC Agency"
        ),
        "Buying Agency": AllRelations[0].companyRelations.filter(
          (data) => data.companyId.companyRole == "Buying Agency"
        ),
      };
    } else {
      return res.status(400).json({ message: "No Data", status: 400 });
    }

    return res.status(200).json({ message: "Data", status: 200, AllFields });
  } catch (error) {
    console.log(error);
  }
};
