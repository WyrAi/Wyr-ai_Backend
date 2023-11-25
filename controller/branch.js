import Branch from "../models/branch.js";
import Companydetails from "../models/companydetails.js";

// Endpoint to create a new role
const branch = async (req, res) => {
  try {
    const { branchName, location, country, city, pincode } =
      req.body.branchInfo;

    const { id } = req.body;

    if (!branchName || !location || !country || !city || !pincode || !id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBranch = new Branch({
      branchName,
      location,
      country,
      city,
      pincode,
      // coordinates: coordinates || undefined, // Use coordinates if provided, otherwise set to undefined
    });

    console.log(newBranch);

    await Companydetails.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          Branches: newBranch._id,
        },
      }
    );

    await newBranch.save();

    res.status(201).json({ message: "New branch is created" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating new Branch", error: error.message });
    console.log(error.message);
  }
};

//get all the branches of a company
const getAllBranchesByCompany = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Company is required" });
    const AllBranches = await Companydetails.find(
      { _id: id },
      { _id: 1, Branches: 1 }
    ).populate("Branches", "_id branchName country city ");

    if (AllBranches) return res.status(200).json(AllBranches[0].Branches);
    return res
      .status(404)
      .json({ message: "Branches not found", status: false });
  } catch (error) {
    console.log(error);
  }
};

const GetAllEmployeesWithBranch = async (req, res) => {
  try {
    const { id } = req.params;
    let response = null;
    if (id) {
      response = await Branch.find({ _id: id }, { employee: 1 }).populate({
        path: "employee",
        select: "name employeeID email profileImage assignRole",
        populate: {
          path: "assignRole",
          select: "name",
        },
      });
    }
    return res.status(200).json(response[0].employee);
  } catch (error) {
    console.log(error);
  }
};

export { branch, GetAllEmployeesWithBranch, getAllBranchesByCompany };
