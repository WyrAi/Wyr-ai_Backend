import express from "express";
import {
  registerEmployee,
  GetAllEmployeesWithAllBranch,
  getEmployeesFromBuVen,
  UserPasswordSave,
  BranchEmployee,
} from "../controller/user.js";
import { roles } from "../controller/role.js";
import { branch, getAllBranchesByCompany } from "../controller/branch.js";
import { message } from "../controller/whatsapp.js";
import {
  purchaseOrders,
  getPurchaseOrder,
} from "../controller/purchaseOrder.js";
import { Packinglist } from "../controller/packing.js";
import {
  companydetails,
  GetRolesByCompany,
} from "../controller/companydeails.js";
import { getEmployees } from "../controller/getemploye.js";
import { deleteEmploye } from "../controller/deleteEmploye.js";
import { getbranch } from "../controller/getbranch.js";
import { getRole } from "../controller/getrole.js";
import { updateEmploye } from "../controller/updateemploye.js";
import { payment } from "../controller/payment.js";
import {
  register,
  verifyEmail,
  OTPGernate,
  UserInformation,
  // UserInformation,
  GetAllUsers,
} from "../controller/registration.js";
import { login } from "../controller/login.js";
import TokenVerify from "../middleware/authMiddleware.js";
import Authenticate from "../middleware/authenticate.js";
import { companyRelationShip } from "../controller/relationShipController.js";
const router = express.Router();

// Signup Page Routes

router.route("/register").post(register);
router.route("/Otp/:email").post(OTPGernate);
router.route("/verify-email").post(verifyEmail);

//-----------------------------//

//Company Page Routes
router.route("/companydetails").post(Authenticate, companydetails);

//---------------------------//

//UserInformation Api
router.route("/UserInformation").get(Authenticate, UserInformation);
router.route("/getAllSuperAdmin").get(GetAllUsers);
router.route("/userPassword").post(UserPasswordSave);
router.route("/getAllEmployess/:_id").get(GetAllEmployeesWithAllBranch);
router.route("/getAllEmployessWithBranch/:id").get(BranchEmployee);
//-------------------------//

//Branch Api
router.route("/branch").post(Authenticate, branch);
router.route("/getAllBranches/:id").get(Authenticate, getAllBranchesByCompany);

//------------------------------//

//Role APi
router.route("/roles").post(Authenticate, roles);

//------------------------------//

//Relationship Api
router.route("/companyRelationShip").post(companyRelationShip);

//----------------------------//

router.route("/registerEmployee").post(TokenVerify, registerEmployee);

// upload.fields([
//   { name: "image", maxCount: 1 },
//   { name: "documents", maxCount: 8 },
// ]),
router.route("/message").post(message);
router.route("/purchaseOrder").post(purchaseOrders);
router.route("/packinglist").post(Packinglist);
router.route("/deleteEmploye").delete(deleteEmploye);
router.route("/getrole").get(getRole);
router.route("/updateEmploye/:id").put(updateEmploye);
router.route("/login").post(login);
router.route("/getpurchaseOrder/:fields").get(getPurchaseOrder);
router.route("/getAllCompanyRoles/:id").get(GetRolesByCompany);
router
  .route("/getAllEmployess/:buyer_id/:vender_id")
  .get(getEmployeesFromBuVen);

export default router;
