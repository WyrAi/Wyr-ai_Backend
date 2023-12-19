import User from "../models/users.js";
import Relationship from "../models/relationshipModel.js";
import Companydetails from "../models/companydetails.js";
import { HashMethod } from "../Methods/HashMethods.js";

//RelationShip Api
export const companyRelationShip = async (req, res) => {
  try {
    const { role, reciverEmail, senderCompanyId } = req.body || [];
    console.log("10========>",reciverEmail);
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

// export const companyRelationShip = async (req, res) => {
//   try {
//     const { role, reciverEmail, senderCompanyId } = req.body || [];
    
//     // Ensure reciverEmail is an array
//     if (!Array.isArray(reciverEmail)) {
//       return res.status(400).json({ message: "ReciverEmail should be an array", status: 400 });
//     }

//     for (const email of reciverEmail) {
//       const userCheck = await User.findOne({ email })
//         .populate("role", "name")
//         .populate("companyId", "_id ");

//       if (!userCheck) {
//         console.log(`User not exist for email: ${email}`);
//         // Handle this case as needed, for example, continue to the next iteration
//         continue;
//       }

//       if (role !== userCheck.role.name) {
//         return res.status(400).json({ message: `This is not a ${role} for email: ${email}`, status: 400 });
//       }

//       const hashInput = [
//         senderCompanyId.toString(),
//         userCheck.companyId._id.toString(),
//       ];

//       const hash = HashMethod(hashInput);

//       const relationshipCheck = await Relationship.find({ HashKey: hash });

//       if (relationshipCheck.length > 0) {
//         console.log(`Relation already exists for email: ${email}`);
//         // Handle this case as needed, for example, continue to the next iteration
//         continue;
//       }

//       const newRelation = await Relationship({
//         SenderRelationId: senderCompanyId,
//         ReceiverRelationId: userCheck.companyId._id,
//         HashKey: hash,
//       }).save();

//       await Companydetails.findByIdAndUpdate(
//         { _id: userCheck.companyId._id },
//         {
//           $push: {
//             companyRelations: {
//               companyId: senderCompanyId,
//               relationId: newRelation._id,
//             },
//           },
//         }
//       );

//       await Companydetails.findByIdAndUpdate(
//         { _id: senderCompanyId },
//         {
//           $push: {
//             companyRelations: {
//               companyId: userCheck.companyId._id,
//               relationId: newRelation._id,
//             },
//           },
//         }
//       );
//     }

//     res.status(200).json({ message: "Requests sent successfully", status: 200 });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error", status: 500 });
//   }
// };


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
    )
      .populate("companyRelations.relationId")
      .populate(
        "companyRelations.companyId",
        "name address country city pincode companyimage"
      );

    if (AllData.length > 0)
      return res.status(200).json({ message: "Data", status: 200, AllData });
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
    )
      .populate(
        "companyRelations.companyId",
        "_id name addres country city pincode companyRole"
      )
      .populate("companyRelations.relationId");

    let AllFields = {};

    if (AllRelations.length > 0) {
      const roles = ["Buyer", "Factory", "QC Agency", "Buying Agency"];

      roles.forEach((role) => {
        AllFields[role] = AllRelations[0].companyRelations.filter(
          (data) =>
            data.companyId.companyRole === role &&
            data.relationId.Status === "Registered"
        );
      });
    } else {
      return res.status(400).json({ message: "No Data", status: 400 });
    }

    return res.status(200).json({ message: "Data", status: 200, AllFields });
  } catch (error) {
    console.log(error);
  }
};

//Rejected Relationship Api
export const RejectedRelationShip = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      await Relationship.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          Status: "Unverified",
        }
      );
      return res.status(200).json({ message: "Unverified", status: 200 });
    } else {
      return res
        .status(400)
        .json({ message: "Relationship is required", status: 400 });
    }
  } catch (error) {
    console.log(error);
  }
};

//Approved Relationship Api
export const ApprovedRelationShip = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      await Relationship.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          Status: "Registered",
        }
      );
      return res.status(200).json({ message: "Registered", status: 200 });
    } else {
      return res
        .status(400)
        .json({ message: "Relationship is required", status: 400 });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteRelation = async (req, res) => {
  try {
    const { relationId } = req.params;

    if (relationId) {
      await Relationship.findByIdAndDelete({
        _id: relationId,
      });

      await Companydetails.updateMany(
        {
          "companyRelations.relationId": relationId,
        },
        {
          $pull: {
            companyRelations: {
              relationId: relationId,
            },
          },
        }
      );
      return res.status(200).json({ message: "Deleted", status: 200 });
    }
    return res
      .status(400)
      .json({ message: "Relation is required", status: 400 });
  } catch (error) {
    console.log(error);
  }
};
