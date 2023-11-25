import Users from "../models/users.js";
import Branch from "../models/branch.js";
import { imageUploadToBase64 } from "../Methods/uploadImages.js";
import { mailTransport, resetpasswordTemplet } from "../utils/mails.js";

//Employee created Api
const registerEmployee = async (req, res) => {
  try {
    const {
      name,
      employeeId,
      email,
      phone,
      role,
      officeBranch,
      companyId,
      profileImage,
    } = req.body;

    if (
      !name ||
      !employeeId ||
      !email ||
      !phone ||
      !role ||
      !officeBranch ||
      !companyId ||
      !role ||
      !profileImage
    ) {
      return res
        .status(422)
        .json({ status: false, error: "All fields are required" });
    }
    const NewUser = new Users({
      name,
      employeeId,
      email,
      phone,
      role,
      officeBranch,
      companyId,
      role,
    });

    await NewUser.save();

    await Branch.findByIdAndUpdate(
      { _id: officeBranch },
      {
        $push: {
          employee: NewUser._id,
        },
      }
    );

    res.status(201).json({ message: "New Employee create", status: true });
    const ProfilImage = await imageUploadToBase64(profileImage);

    // NewUser.profileImage = ProfilImage[0];
    await Users.findByIdAndUpdate(
      { _id: NewUser._id },
      {
        profileImage: ProfilImage[0],
      }
    );

    //Email send for password Create
    const detail = { _id: NewUser._id, email: NewUser.email };
    const token = await ResetTokenGernate(detail);
    const link = `${process.env.CLIENT_URL}/${token}/${NewUser.email}`;
    mailTransport().sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Create",
      html: resetpasswordTemplet(link),
    });
  } catch (error) {
    console.log(error);
  }
};

const GetAllEmployeesWithAllBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const AllEmployee = await Users.find(
      { CompanyID: id },
      { name: 1, employeeID: 1, email: 1, profileImage: 1, assignRole: 1 }
    ).populate({
      path: "assignRole",
      select: "name",
    });

    return res.status(200).json(AllEmployee);
  } catch (error) {
    console.log(error);
  }
};

const getEmployeesFromBuVen = async (req, res) => {
  try {
    const { buyer_id, vender_id } = req.params;

    const buyerEmployee = await Users.find({
      $or: [{ _id: buyer_id }, { _id: vender_id }],
    });

    console.log(buyerEmployee);

    return res.status(200).json(buyerEmployee);
  } catch (error) {
    console.log(error);
  }
};

// password Gernate Api
const UserPasswordSave = async (req, res) => {
  try {
    const { id } = req.user;
    const { password, cpassword } = req.body;

    if (password !== cpassword)
      return res.status(400).json({ error: "Password not match" });

    if (!id) {
      return res.status(400).json({ error: "User not found" });
    }

    await Users.findByIdAndUpdate(
      { _id: id },
      {
        password: password,
        cpassword: cpassword,
      }
    );

    return res.status(200).json({ message: "Password create" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
export {
  registerEmployee,
  GetAllEmployeesWithAllBranch,
  getEmployeesFromBuVen,
};
