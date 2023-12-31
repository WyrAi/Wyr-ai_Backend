import express from "express";
import {
  registerEmployee,
  GetAllEmployeesWithAllBranch,
  getEmployeesFromBuVen,
  UserPasswordSave,
  BranchEmployee,
  registerEmployeeDelete,
  UserPasswordReset,
  getAllPurmishReciver,
} from "../controller/user.js";
import { roles, roleDelete } from "../controller/role.js";
import {
  branch,
  getAllBranchesByCompany,
  BranchDelete,
} from "../controller/branch.js";
import { message } from "../controller/whatsapp.js";
import {
  purchaseOrders,
  purchaseOrderGet,
  PuracheseOrderDraft,
  purchesOrderVerifiedPeople,
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
  UserInformationDelete,
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
  deleteRelation,
} from "../controller/relationShipController.js";

import {
  QcAssignmentRolePeoples,
  PoGetFromUser,
  UserBranchesGet,
  PLCreate,
  PlDisplay,
} from "../controller/packingListController.js";

import {
  GetEmployeesofBranch,
  getPlData,
  updatePlData,
} from "../controller/QcController.js";

import {
  AllInformationGet,
  InformationAdd,
  InformationCommentAdd,
  InformationDelete,
  InformationComentDelete,
  InformationComentUpdate,
} from "../controller/informationController.js";

//import dashboard controller methods.

import {
  getPoStatus,
  getlatestaddeduser,
  getusercount,
} from "../controller/dashboardController.js";

import {
  Notification1,
  deleteSocketUser,
  getNotification,
  getUserByUsername,
  getemailsofempolyes,
  getusername,
  updateSeenStatus,
} from "../controller/notificationUser.js";

// import User from "../models/users.js";
import formidable from "express-formidable";
import {
  CreateDataSet,
  ReportEmailSend,
  VideoCheck,
  createVideoLink,
} from "../controller/videLinkController.js";
import multer from "multer";
import logs, { getLogFile } from "../controller/logsController.cjs";
import {
  ReportImageCreate,
  ReportTimeCreate,
  // imageRemove,
} from "../controller/ReportTimeController.js";

const { logsCreate } = logs;
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

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
router.route("/registerEmployee").post(TokenVerify, registerEmployee);
router.route("/UserInformationDelete").post(TokenVerify, UserInformationDelete);
router.route("/registerEmployeeDelete").delete(registerEmployeeDelete);
router.route("/UserPasswordReset").post(UserPasswordReset);

router.route("/listAllReciverPurmished").post(getAllPurmishReciver);

//-------------------------//

//Branch Api
router.route("/branch").post(Authenticate, branch);
router.route("/getAllBranches/:id").get(Authenticate, getAllBranchesByCompany);
router.route("/BranchDelete/:id").delete(BranchDelete);
//------------------------------//

//Role APi
router.route("/roles").post(Authenticate, roles);
router.route("/roleDelete/:roleId/:companyId").delete(Authenticate, roleDelete);
//------------------------------//

//Relationship Api
router.route("/companyRelationShip").post(companyRelationShip);
router.route("/companyRelationShip/:id").get(displayRelations);
router.route("/rejectedRelationship/:id").put(RejectedRelationShip);
router.route("/approvedRelationship/:id").put(ApprovedRelationShip);
router.route("/deleteRelation/:relationId").delete(deleteRelation);
//----------------------------//

//Purcahse Order Api
router.route("/getAllCompanyByRole/:id").get(getAllCompanyByRole);
router
  .route("/getAllEmployess/:buyer_id/:vender_id")
  .get(getEmployeesFromBuVen);
router
  .route("/purchaseOrder")
  .post(formidable({ multiples: true }), purchaseOrders);
router.route("/purchaseOrder/:id").get(purchaseOrderGet);
router.route("/PuracheseOrderDraft/:id").post(PuracheseOrderDraft);
router.route("/purchesOrderpeopleList").post(purchesOrderVerifiedPeople);
//--------------------------------//

//Packing List
router.route("/qcAssignmentRolePeoples/:id").get(QcAssignmentRolePeoples);
router.route("/PoGetFromUser/:id/:buyerId").get(PoGetFromUser);
router.route("/UserBranchesGet/:id").get(UserBranchesGet);
router.route("/PLCreate/:id").post(PLCreate);
router.route("/PlDisplay/:id").get(PlDisplay);
//------------------------------//
// ------------------------------//

//Qc
router.route("/GetEmployeesofBranch/:branchId").get(GetEmployeesofBranch);
router.route("/getPlData/:id").get(getPlData);
router.route("/updatePlData/:id").put(updatePlData);

//--------------------------------//

//Informations Api
router.route("/InformationAdd").post(InformationAdd);
router.route("/AllInformationGet").get(AllInformationGet);
router.route("/InformationCommentAdd/:id").put(InformationCommentAdd);
router
  .route("/InformationComentUpdate/:id/:index")
  .put(InformationComentUpdate);
router.route("/InformationDelete/:id").delete(InformationDelete);
router
  .route("/InformationComentDelete/:id/:index")
  .delete(InformationComentDelete);

//-------------------------------//

//VideoLink
router.route("/createVideoLink").post(createVideoLink);
router
  .route("/ReportEmailSend")
  .post(formidable({ multiples: true }), ReportEmailSend);
router.route("/VideoCheck").get(VideoCheck);
router.route("/CreateDataSet").get(CreateDataSet);
// formidable({ multiples: true })
// upload.fields([
//   { name: "image", maxCount: 1 },
//   { name: "documents", maxCount: 8 },
// ]),

//---------------//

router.route("/message").post(message);
router.route("/packinglist").post(Packinglist);
router.route("/deleteEmploye").delete(deleteEmploye);
router.route("/getrole").get(getRole);
router.route("/updateEmploye/:id").put(updateEmploye);
router.route("/login").post(login);
// router.route("/getpurchaseOrder/:fields").get(getPurchaseOrder);
router.route("/getAllCompanyRoles/:id").get(GetRolesByCompany);

//notification route

router.route("/socketuser").post(Notification1);

router.route("/getsocketuser").get(getUserByUsername);
router.route("/deletesocketuser/:username").delete(deleteSocketUser);
router.route("/getuser").get(getusername);
router.route("/getnotification/:email").get(getNotification);
router.route("/updatenotifactionstatus").post(updateSeenStatus);
router.route("/get-emails-employees").get(getemailsofempolyes);

//dashboard routes.
router.route("/postatuslist").get(getPoStatus);
router.route("/usercount").get(getusercount);
router.route("/getrecentaddeduser").get(getlatestaddeduser);
//------------------------//

//logs routes
router.route("/logsCreate").post(logsCreate);
router.route("/getLogFile").get(getLogFile);
//--------------------------//

//New Report Routes
router.route("/ReportTimeCreate").post(ReportTimeCreate);
router.route("/ReportImageCreate").get(ReportImageCreate);
// router.route("/imageRemove").post(imageRemove);
//------------------------//

export default router;
