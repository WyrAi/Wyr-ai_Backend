import Companydetails from "../models/companydetails.js";
import { imageUploadToBase64 } from "../Methods/uploadImages.js";
import User from "../models/users.js";

//Using for company created
const companydetails = async (req, res) => {
  try {
    const { companyImage, details, fileUpload } = req.body;
    const { name, address, country, city, pincode } = details;
    const { _id } = req.user;
    if (
      !_id ||
      !name ||
      !address ||
      !country ||
      !city ||
      !pincode ||
      !companyImage
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", status: 400 });
    }

    const companyCheck = await Companydetails.find({ name: name });

    if (companyCheck.length > 0)
      return res
        .status(409)
        .json({ message: "Company allready exist", status: 409 });

    if (fileUpload.length < 0) {
      return res
        .status(400)
        .json({ message: "All fields are required", status: 400 });
    }

    const AddCompany = await new Companydetails({
      name,
      address,
      country,
      city,
      pincode,
    }).save();

    await User.findByIdAndUpdate(_id, { companyId: AddCompany._id });

    res.status(201).json({
      message: " company created",
      status: 201,
    });

    const documentimage = await imageUploadToBase64(fileUpload);
    const companyimage = await imageUploadToBase64(companyImage);

    await Companydetails.findByIdAndUpdate(
      { _id: AddCompany._id },
      {
        companyimage,
        documentimage,
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const GetRolesByCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const AllRoles = await Companydetails.find(
      { _id: id },
      { _id: 1, customRoles: 1 }
    ).populate("customRoles", "_id name SelectAccess ");

    if (AllRoles) return res.status(200).json(AllRoles[0].customRoles);
    return res
      .status(404)
      .json({ message: "Branches not found", status: false });
  } catch (error) {
    console.log(error);
  }
};

export { companydetails, GetRolesByCompany };
