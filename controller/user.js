import Users from "../models/users.js";
import Branch from "../models/branch.js";
import { imageUploadToBase64 } from "../Methods/uploadImages.js";
import { mailTransport, resetpasswordTemplet } from "../utils/mails.js";
import { ResetTokenGernate } from "../Methods/authMethods.js";

//Employee created Api
const registerEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeID,
      phone,
      role,
      officeBranch,
      companyId,
      profileImage,
    } = req.body;
    console.log(req.body);
    if (
      !name ||
      !employeeID ||
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

    const Emailcheck = await Users.findOne({ email });
    if (Emailcheck)
      return res
        .status(409)
        .json({ message: " email allready exist", status: false });
    const NewUser = new Users({
      name,
      employeeID,
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
    const link = `${process.env.CLIENT_URL}/resetPassword/${token}`;
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
    const { Password, confirmPassword, token } = req.body;
    const { email, _id } = jwt.verify(token, process.env.JWT_SECRET);
    console.log(email, _id);
    if (!Password || !confirmPassword || !token) {
      return res
        .status(400)
        .json({ error: "All fields are required", status: 400 });
    }

    if (Password !== confirmPassword)
      return res.status(400).json({ error: "Password not match" });

    await Users.findByIdAndUpdate(
      { _id: _id },
      {
        password: Password,
        cpassword: confirmPassword,
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
  UserPasswordSave,
};
