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
  purchaseOrderGet,
  PuracheseOrderDraft,
  // getPurchaseOrder,
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
  // GetAllUsers,
} from "../controller/registration.js";
import { login } from "../controller/login.js";
import TokenVerify from "../middleware/authMiddleware.js";
import Authenticate from "../middleware/authenticate.js";
import {
  companyRelationShip,
  displayRelations,
  getAllCompanyByRole,
  ApprovedRelationShip,
  RejectedRelationShip,
} from "../controller/relationShipController.js";

import {
  QcAssignmentRolePeoples,
  PoGetFromUser,
  UserBranchesGet,
  PLCreate,
  PlDisplay
} from "../controller/packingListController.js";

import { GetEmployeesofBranch } from "../controller/QcController.js";
// import User from "../models/users.js";
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
// router.route("/getAllSuperAdmin").get(GetAllUsers);
router.route("/userPassword").post(UserPasswordSave);
router.route("/getAllEmployess/:_id").get(GetAllEmployeesWithAllBranch);
router.route("/getAllEmployessWithBranch/:id").get(BranchEmployee);
//-------------------------//

//Branch Api
router.route("/branch").post(Authenticate, branch);
router.route("/getAllBranches/:id/").get(Authenticate, getAllBranchesByCompany);

//------------------------------//

//Role APi
router.route("/roles").post(Authenticate, roles);

//------------------------------//

//Relationship Api
router.route("/companyRelationShip").post(companyRelationShip);
router.route("/companyRelationShip/:id").get(displayRelations);
router.route("/rejectedRelationship/:id").put(RejectedRelationShip);
router.route("/approvedRelationship/:id").put(ApprovedRelationShip);

//----------------------------//

//Purcahse Order Api
router.route("/getAllCompanyByRole/:id").get(getAllCompanyByRole);
router
  .route("/getAllEmployess/:buyer_id/:vender_id")
  .get(getEmployeesFromBuVen);
router.route("/purchaseOrder").post(purchaseOrders);
router.route("/purchaseOrder/:id").get(purchaseOrderGet);
router.route("/PuracheseOrderDraft/:id").post(PuracheseOrderDraft);

//--------------------------------//

//Packing List
router.route("/qcAssignmentRolePeoples/:id").get(QcAssignmentRolePeoples);
router.route("/PoGetFromUser/:id/:buyerId").get(PoGetFromUser);
router.route("/UserBranchesGet/:id").get(UserBranchesGet);
router.route("/PLCreate/:id").post(PLCreate);
router.route("/PlDisplay/:id").post(PlDisplay);
//------------------------------//
// ------------------------------//

//Qc
router.route("/GetEmployeesofBranch/:branchId").get(GetEmployeesofBranch);

//--------------------------------//

router.route("/registerEmployee").post(TokenVerify, registerEmployee);

// upload.fields([
//   { name: "image", maxCount: 1 },
//   { name: "documents", maxCount: 8 },
// ]),
router.route("/message").post(message);
router.route("/packinglist").post(Packinglist);
router.route("/deleteEmploye").delete(deleteEmploye);
router.route("/getrole").get(getRole);
router.route("/updateEmploye/:id").put(updateEmploye);
router.route("/login").post(login);
// router.route("/getpurchaseOrder/:fields").get(getPurchaseOrder);
router.route("/getAllCompanyRoles/:id").get(GetRolesByCompany);

// router.route("/testing").post(async (req, res) => {
//   const { multiple } = req.body;

//   const data = await User.find({
//     _id: multiple,
//   });

//   console.log(data);
// });

export default router;
