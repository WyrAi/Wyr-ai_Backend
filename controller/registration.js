import User from "../models/users.js";
// import { sendError, createRandomBytes } from "../utils/helper.js";
import {
  generateOtp,
  generateEmailTemplet,
  mailTransport,
} from "../utils/mails.js";
import VerificationToken from "../models/verificationToken.js";
import Role from "../models/role.js";
import { hashPassword } from "../middleware/authMiddleware.js";
import { TokenGernate } from "../Methods/authMethods.js";

//Super person create api
const register = async (req, res) => {
  try {
    const { role, name, email, password, cpassword, phoneNumber, verified } =
      req.body;

    if (
      !role ||
      !name ||
      !email ||
      !password ||
      !cpassword ||
      !phoneNumber ||
      !verified
    ) {
      return res
        .status(422)
        .json({ status: 400, error: "please fill the fileds" });
    }

    if (!(password === cpassword)) {
      return res
        .status(422)
        .json({ message: "wrong information", status: 400 });
    }

    const superAdminExist = await User.findOne({ email: email });
    if (superAdminExist)
      return res.status(400).json({
        message: "User Allready exist",
        status: 400,
      });

    const Role_id = await Role.findOne({ name: role });

    let hasPassword = await hashPassword(password);
    let hasConPassword = await hashPassword(cpassword);

    let newUser = await User({
      role: Role_id._id,
      name,
      email,
      password: hasPassword,
      cpassword: hasConPassword,
      phone: phoneNumber,
      verified,
    }).save();

    const token = await TokenGernate(newUser._id);

    return res
      .status(200)
      .json({ message: "User created", status: 200, token });
  } catch (error) {
    console.log(error);
  } 
};

//OTP send on email api function

const OTPGernate = async (req, res) => {
  try {
    const { email } = req.params;

    if (email) {
      const emailCheck = await User.findOne({ email });
      if (emailCheck)
        return res
          .status(409)
          .json({ message: "Email already exists", status: 400 });
      const { otp, expireTime } = generateOtp();
      await VerificationToken({ email, otp, expireTime }).save();
      mailTransport().sendMail(
        {
          from: process.env.EMAIL,
          to: email,
          subject: "verify your email account",
          html: generateEmailTemplet(otp),
        },
        (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            return res
              .status(400)
              .json({ message: "check your email", error, status: 400 });
            // You might want to return an error response to the client here
          } else {
            console.log("Email sent:", info.response);
            return res
              .status(200)
              .json({ message: "OTP send your email", status: 200 });
            // Continue with the response to the client
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

//email verfication api function

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const OTPDetail = await VerificationToken.findOne({ email, otp });
    const currentTime = new Date().getTime();
    if (OTPDetail) {
      let diff = OTPDetail.expireTime - currentTime;
      if (diff < 0) {
        return res.status(400).json({ message: "OTP Expired", status: 400 });
      } else {
        await VerificationToken.deleteMany({ email });
        return res.status(200).json({ message: "OTP Verified", status: 200 });
      }
    } else {
      return res.status(400).json({ message: "Wrong OTP", status: 400 });
    }
  } catch (error) {
    console.log(error);
  }
};

const UserInformation = async (req, res) => {
  try {
    const _id = req.user;
    const UserInfo = await User.findById(_id, {
      role: 1,
      name: 1,
      email: 1,
      phone: 1,
      companyId: 1,
    })
      .populate("companyId", {
        documentimage: 0,
        companyimage: 0,
      })
      .populate("role");

    if (UserInfo) {
      return res.status(200).json({ UserInfo });
    }
    return res.status(404).json({ message: "user not found" });
  } catch (error) {
    console.log(error);
  }
};

//Show all the superAdmin Companies for SuperAdmin

const GetAllUsers = async (req, res) => {
  try {
    const Data = await User.find({}, { role: 1, companyId: 1 })
      .populate("role", {
        name: 1,
      })
      .populate("companyId", {
        _id: 1,
        name: 1,
        address: 1,
        country: 1,
        city: 1,
        pincode: 1,
      });

    if (Data) {
      // console.log(Data);
    }
    return res.status(404).json({ message: "user not found" });
  } catch (error) {
    console.log(error);
  }
};

// //show all the user in PO
// const GetAllUsers = async (req, res) => {
//   try {
//     const Data = await superAdmin
//       .find({}, { _id: 1, name: 1, company: 1, role: 1 })
//       .populate("company", "pincode country city address name");

//     let buyer = [];
//     let buyingAgency = [];
//     let factory = [];
//     let qcAgency = [];

//     if (Data) {
//       for (let i = 0; i < Data.length; i++) {
//         if (Data[i].company) {
//           if (Data[i].role == "Buyer")
//             buyer.push({
//               name: Data[i].company.name,
//               address: Data[i].company.address,
//               city: Data[i].company.city,
//               pincode: Data[i].company.pincode,
//             });
//           else if (Data[i].role == "Buying Agency")
//             buyingAgency.push({
//               name: Data[i].company.name,
//               address: Data[i].company.address,
//               city: Data[i].company.city,
//               pincode: Data[i].company.pincode,
//             });
//           else if (Data[i].role == "Factory")
//             factory.push({
//               name: Data[i].company.name,
//               address: Data[i].company.address,
//               city: Data[i].company.city,
//               pincode: Data[i].company.pincode,
//             });
//           else if (Data[i].role == "Qc Agency")
//             qcAgency.push({
//               name: Data[i].company.name,
//               address: Data[i].company.address,
//               city: Data[i].company.city,
//               pincode: Data[i].company.pincode,
//             });
//         }
//       }
//     }

//     return res.status(200).json({ buyer, buyingAgency, factory, qcAgency });
//   } catch (error) {
//     console.log(error);
//   }
// };

export { register, verifyEmail, OTPGernate, UserInformation, GetAllUsers };
