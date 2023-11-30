import User from "../models/users.js";

//Qc Assignment Role Persons get api
export const QcAssignmentRolePeoples = async (req, res) => {
  try {
    const { id } = req.params;
    const Response = await User.find(
      { companyId: id },
      {
        _id: 1,
        role: 1,
        name: 1,
        email: 1,
        companyId: 1,
        employeeID: 1,
      }
    ).populate("role", "name SelectAccess.qaAssignment");

    let Data = Response.filter(
      (value) => value.employeeID && value.role.SelectAccess.qaAssignment.length
    );

    if (Data.length > 0) {
      return res.status(200).json({ message: "Data all send", Data });
    }

    return res.status(400).json({ message: "employee not found" });
  } catch (error) {
    console.log(error);
  }
};

//Po get form user and check the byer is avilable in po
export const PoGetFromUser = async (req, res) => {
  try {
    const { id, buyerId } = req.params;

    if (id) {
      const Response = await User.find(
        { _id: id },
        {
          poList: 1,
        }
      ).populate({
        path: "poList",
        select: "buyer products.styleId products.styleName products.images",
        match: { buyer: buyerId },
        populate: {
          path: "buyer",
          select: "name",
        },
      });

      return res.status(200).json({ message: "Data all send", Response });
    }
  } catch (error) {
    console.log(error);
  }
};
