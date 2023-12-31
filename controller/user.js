import Users from "../models/users.js";
import Branch from "../models/branch.js";
import {
  imageUploadToBase64,
  imageuploadImageDelete,
} from "../Methods/uploadImages.js";
import { mailTransport, resetpasswordTemplet } from "../utils/mails.js";
import { ResetTokenGernate } from "../Methods/authMethods.js";
import { hashPassword } from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";
import Companydetails from "../models/companydetails.js";
import User from "../models/users.js";
import Role from "../models/role.js";

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

    if (
      !name ||
      !employeeID ||
      !email ||
      !phone ||
      !role ||
      !officeBranch ||
      !companyId ||
      !role
      // !profileImage
    ) {
      return res
        .status(422)
        .json({ status: false, error: "All fields are required" });
    }

    const Emailcheck = await Users.findOne({ email: email.toLowerCase() });
    if (Emailcheck)
      return res
        .status(409)
        .json({ message: " email allready exist", status: false });
    const NewUser = new Users({
      name,
      employeeID,
      email: email.toLowerCase(),
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

    if (profileImage) {
      const ProfilImage = await imageUploadToBase64(profileImage);
      await Users.findByIdAndUpdate(
        { _id: NewUser._id },
        {
          profileImage: ProfilImage[0],
        }
      );
    }

    // NewUser.profileImage = ProfilImage[0];

    //Email send for password Create
    const detail = { _id: NewUser._id, email: NewUser.email };
    const token = await ResetTokenGernate(detail);
    const link = `${process.env.CLIENT_URL}/resetPassword/${token}/`;
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

//api working on frontend veiwAllUsers
const GetAllEmployeesWithAllBranch = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!_id) return res.status(400).json({ message: "No Company Found" });

    let AllEmployee = await User.find(
      { companyId: _id },
      { password: 0, cpassword: 0, verified: 0 }
    ).populate("role", "name");

    AllEmployee = AllEmployee.filter((user) => user.employeeID);

    if (AllEmployee) return res.status(200).json(AllEmployee);
    else return res.status(404).json({ message: "No Employee Found" });
  } catch (error) {
    console.log(error);
  }
};

//api get the employees by particular branch
const BranchEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "No Branch Found" });

    const AllEmployee = await User.find(
      { officeBranch: id },
      { password: 0, cpassword: 0, verified: 0 }
    ).populate("role", "name");

    if (AllEmployee) return res.status(200).json(AllEmployee);
    else return res.status(404).json({ message: "No Employee Found" });
  } catch (error) {
    console.log(error);
  }
};

const getEmployeesFromBuVen = async (req, res) => {
  try {
    const { buyer_id, vender_id } = req.params;

    if (!buyer_id || !vender_id)
      return res.status(400).json({ message: "No Company Found" });

    const buyerEmployee = await User.find(
      {
        $or: [{ companyId: buyer_id }, { companyId: vender_id }],
      },
      { password: 0, cpassword: 0, verified: 0 }
    )
      .populate("role", "name")
      .populate("officeBranch", "country city pincode ");
    let allData = [];
    if (buyerEmployee) {
      allData = buyerEmployee.filter((value) => value.employeeID);
    }

    return res.status(200).json(allData);
  } catch (error) {
    console.log(error);
  }
};

// password Gernate Api
const UserPasswordSave = async (req, res) => {
  try {
    const { Password, confirmPassword, token } = req.body;
    if (!Password || !confirmPassword || !token) {
      return res
        .status(400)
        .json({ error: "All fields are required", status: 400 });
    }
    const tokenValue = jwt.verify(token, process.env.RESET_SECERT);

    if (!tokenValue)
      return res.status(400).json({ error: "Password link is expired" });
    const { _id } = tokenValue;

    if (Password !== confirmPassword)
      return res.status(400).json({ error: "Password not match" });

    const hashpassword = await hashPassword(Password);
    const confirmHashPassword = await hashPassword(confirmPassword);

    await Users.findByIdAndUpdate(
      { _id: _id },
      {
        password: hashpassword,
        cpassword: confirmHashPassword,
      }
    );

    return res.status(200).json({ message: "Password create" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const registerEmployeeDelete = async (req, res) => {
  try {
    const { checkedItems } = req.body;
    // const UserInformation = await Users.deleteMany({ _id: { $in: id } });
    let Users = await User.find({ _id: { $in: checkedItems } });
    await User.deleteMany({ _id: { $in: checkedItems } });

    for (let i = 0; i < Users.length; i++) {
      await Branch.updateOne(
        { _id: Users[i].officeBranch },
        {
          $pull: {
            employee: Users[i]._id,
          },
        }
      );
    }

    res.status(200).json("Successfully delete ");

    for (let j = 0; j < Users.length; j++) {
      if (Users[j].profileImage) {
        await imageuploadImageDelete(Users[j].profileImage);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const UserPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const UserInformation = await Users.findOne({ email });
    console.log(UserInformation, new Date());
    if (UserInformation) {
      const detail = { _id: UserInformation._id, email: UserInformation.email };
      const token = await ResetTokenGernate(detail);
      console.log(token, new Date());
      const link = `${process.env.CLIENT_URL}/resetPassword/${token}/`;
      mailTransport().sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Password Create",
        html: resetpasswordTemplet(link),
      });
      console.log("email send");
      return res.status(200).json({ message: "Reset password link send" });
    }
    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.log(error);
  }
};

const getAllPurmishReciver = async (req, res) => {
  try {
    const targetEmail = req.body.email;

    const usersWithEmail = await User.find({ email: targetEmail })
      .select("companyId")
      .exec();
    //console.log("231=====>",usersWithEmail)
    const companyId = usersWithEmail[0]?.companyId;
    //console.log("234====>",companyId);
    const usersWithCompanyId = await User.find({ companyId: companyId })
      .populate({
        path: "role",
        model: "Role",
      })
      .lean()
      .exec();

    const usersWithAddEditCompanyPermission = usersWithCompanyId.filter(
      (user) => {
        const role = user.role;

        if (role && role.SelectAccess.relationshipManagement) {
          const relationshipManagementStrings =
            role.SelectAccess.relationshipManagement.map((value) =>
              value.toString()
            );
          return relationshipManagementStrings.includes("Add/Edit Company");
        }

        return false;
      }
    );
    console.log("258====>", usersWithAddEditCompanyPermission);
    const emailsWithAddEditCompanyPermission =
      usersWithAddEditCompanyPermission.map((user) => user.email);

    res.json({ success: true, emails: emailsWithAddEditCompanyPermission });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export {
  registerEmployee,
  GetAllEmployeesWithAllBranch,
  getEmployeesFromBuVen,
  UserPasswordSave,
  registerEmployeeDelete,
  BranchEmployee,
  UserPasswordReset,
  getAllPurmishReciver,
};
