// Backend code (roles.js)
import Role from "../models/role.js";
import Companydetails from "../models/companydetails.js";

const roles = async (req, res) => {
  try {
    const { role, description, SelectAccess, companyId } = req.body;

    if (!role || !description || !SelectAccess || !companyId)
      return res.status(422).json({
        message: "Please fill all the required fields",
        status: false,
      });

    const RoleCreate = new Role({
      name: role,
      description,
      SelectAccess: {
        purchaseOrder: SelectAccess.purchaseOrder || [],
        packingList: SelectAccess.packingList || [],
        sheduleInspection: SelectAccess.sheduleInspection || [],
        liveInspection: SelectAccess.liveInspection || [],
        inspectionWallet: SelectAccess.inspectionWallet || [],
        userManagement: SelectAccess.userManagement || [],
        relationshipManagement: SelectAccess.relationshipManagement || [],
        reports: SelectAccess.reports || [],
        qaAssignment: SelectAccess.qaAssignment || [],
      },
    });

    await RoleCreate.save();

    await Companydetails.findByIdAndUpdate(
      { _id: companyId },
      {
        $push: {
          customRoles: RoleCreate._id,
        },
      }
    );

    return res.status(200).json({ message: "Role created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export { roles };
