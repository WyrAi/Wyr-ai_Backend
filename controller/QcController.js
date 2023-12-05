import Packing from "../models/packinglist.js";
import User from "../models/users.js";

//Branch employees but not get the Assign/Unassign QC role employee
export const GetEmployeesofBranch = async (req, res) => {
  try {
    const { branchId } = req.params; // get the branchId from the request parameters
    if (branchId) {
      const Response = await User.find(
        { officeBranch: branchId },
        {
          role: 1,
          name: 1,
          email: 1,
          employeeID: 1,
        }
      ).populate({
        path: "role",
        select: "name SelectAccess.qaAssignment",
      });

      let Data = Response.filter(
        (item) => item.role.SelectAccess.qaAssignment.length <= 0
      );
      return res.status(200).json({ message: "Data send", Data });
    }
    return res.status(400).json({ message: "Branch Id is required" });
  } catch (error) {
    console.log(error);
  }
};

//send the selective data form plDatabase
export const getPlData = async (req, res) => {
  try {
    const { id } = req.params; // get the Pl id from params;
    // console.log(id);
    if (id != undefined) {
      const Response = await Packing.findOne({ _id: id })
        .populate("buyerId", "name address country city _id")
        .populate("factoryId", "name address country city _id")
        .populate("qcId", "name address country city _id")
        .populate("qcHeadId", "name _id")
        .populate("PurchaseOrder.products.branch", "branchName ");

      if (Response)
        return res.status(200).json({ message: "Data send", Response });
    }
    return res.status(400).json({ message: "Pl Id is required" });
  } catch (error) {
    console.log(error);
  }
};


