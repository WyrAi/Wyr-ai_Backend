import Companydetails from "../models/companydetails.js";
import User from "../models/users.js";
import Packing from "../models/packinglist.js";
import { imageUploadToBase64 } from "../Methods/uploadImages.js";

//Qc Assignment Role Persons get api
export const QcAssignmentRolePeoples = async (req, res) => {
  try {
    const { id } = req.params; // get the company id
    const Response = await User.find(
      { companyId: id },
      {
        _id: 1,
        role: 1,
        name: 1,
        email: 1,
        companyId: 1,
        employeeID: 1,
      }
    ).populate("role", "name SelectAccess.qaAssignment");

    let Data = Response.filter(
      (value) => value.employeeID && value.role.SelectAccess.qaAssignment.length
    );

    if (Data.length > 0) {
      return res.status(200).json({ message: "Data all send", Data });
    }

    return res.status(400).json({ message: "employee not found" });
  } catch (error) {
    console.log(error);
  }
};

//Po get form user and check the byer is avilable in po
export const PoGetFromUser = async (req, res) => {
  try {
    const { id, buyerId } = req.params; // get the user id and selective buyer id

    if (id) {
      const Response = await User.find(
        { _id: id },
        {
          poList: 1,
        }
      ).populate({
        path: "poList",
        select:
          "buyer poNumber products.styleId products.styleName products.images",
        match: { buyer: buyerId },
        populate: {
          path: "buyer",
          select: "name",
        },
      });

      return res.status(200).json({ message: "Data all send", Response });
    }
  } catch (error) {
    console.log(error);
  }
};

//User Branches Get
export const UserBranchesGet = async (req, res) => {
  try {
    const { id } = req.params; // get the company Id

    if (id) {
      const Response = await Companydetails.findOne(
        {
          _id: id,
        },
        {
          Branches: 1,
        }
      ).populate({
        path: "Branches",
        select: "branchName country _id",
      });

      return res.status(200).json({ message: "Data all send", Response });
    }
    return res.status(400).json({ message: "company not found" });
  } catch (error) {
    console.log(error);
  }
};

export const PLCreate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      buyerId,
      factoryId,
      qcHeadId,
      qcId,
      totalCarton,
      slotOfInspection,
      addpurchaseOrder,
      packingListFiles,
    } = req.body;
    console.log(req.body);

    if (
      !buyerId ||
      !factoryId ||
      !qcHeadId ||
      !qcId ||
      !totalCarton ||
      !slotOfInspection ||
      !addpurchaseOrder
    )
      return res.status(400).json({ message: "All fields are required" });
    const packingFiles = await imageUploadToBase64(packingListFiles);
    let NewPl = new Packing({
      buyerId,
      factoryId,
      qcHeadId,
      qcId,
      totalCarton,
      slotOfInspection,
      packingListFiles: packingFiles,
    });

    let Error = [];

    for (let i = 0; i < addpurchaseOrder.length; i++) {
      const { poNumber } = addpurchaseOrder[i];
      if (!poNumber) {
        Error.push(`Product ${i + 1} fields are required`);
      } else {
        NewPl.PurchaseOrder.push({
          po_Number: poNumber,
        });

        for (let j = 0; j < addpurchaseOrder[i].products.length; j++) {
          const {
            images,
            branch,
            from,
            quantityPerBox,
            styleId,
            styleName,
            to,
            totalBox,
            totalQuantity,
          } = addpurchaseOrder[i].products[j];

          NewPl.PurchaseOrder[i].products.push({
            images,
            branch,
            from,
            quantityPerBox,
            styleId,
            styleName,
            to,
            totalBox,
            totalQuantity,
          });
        }
      }
    }

    await NewPl.save();
    res.status(200).json({ message: "Packing List Created" });
    const ids = [id, qcHeadId];
    await User.updateMany(
      {
        _id: { $in: ids },
      },
      {
        $push: {
          plList: NewPl._id,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const PlDisplay = async (req, res) => {
  try {
    const { id } = req.params;

    const Data = await User.findOne(
      { _id: id },
      {
        plList: 1,
        draftPlList: 1,
        name: 1,
        companyId: 1,
      }
    )
      .populate("companyId", "companyRole")
      .populate({
        path: "plList",
        select: "purchaseDoc buyerId _id",
        populate: { path: "buyerId", select: "name" },
      })
      .populate({
        path: "draftPlList",
        select: "purchaseDoc buyerId _id",
        populate: { path: "buyerId", select: "name" },
      });
    let Response = Data;

    // if (Data.companyId.companyRole == "Factory") {
    //   Response = Data.poList.filter(
    //     (value) =>
    //       Data.companyId.companyRole == "Factory" && value.status == "Published"
    //   );
    // }
    // console.log(Data);
    if (Data) {
      return res.status(200).json({ message: "Data send", Response });
    }
    return res.status(400).json({ message: "No data found" });
  } catch (error) {
    console.log(error);
  }
};
