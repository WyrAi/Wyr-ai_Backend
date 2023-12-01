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
