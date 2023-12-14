import PurchaseOrder from "../models/purchaseOrder.js";
import { imageUploadToBase64 } from "../Methods/uploadImages.js";
import User from "../models/users.js";

const purchaseOrders = async (req, res) => {
  try {
    const bodySizeInBytes = JSON.stringify(req.body).length;
    console.log("Request body size:", bodySizeInBytes, "bytes");

    const {
      buyer,
      vendor,
      shiptoName,
      shiptoAdd,
      shipVia,
      shipDate,
      assignedPeople,
      products,
      purchaseDoc,
      status,
      poNumber,
    } = req.body;
    if (
      !buyer ||
      !vendor ||
      !shiptoName ||
      !shiptoAdd ||
      !shipVia ||
      !shipDate ||
      !assignedPeople ||
      !products ||
      !poNumber ||
      !status
    ) {
      return res.status(422).json({
        status: 422,
        error: "Please provide all the necessary fields",
      });
    }

    const PuracheseOrderImage = await imageUploadToBase64(purchaseDoc);

    let NewPurchaseOrder = new PurchaseOrder({
      purchaseDoc: PuracheseOrderImage,
      buyer,
      vendor,
      shipTo: {
        name: shiptoName,
        completeAddress: shiptoAdd,
        shipVia,
        shippingDate: shipDate,
      },
      assignedPeople,
      status,
      poNumber,
    });

    const Error = [];

    for (let i = 0; i < products.length; i++) {
      const {
        styleId,
        styleName,
        quantity,
        color,
        weight,
        weightTolerance,
        length,
        lengthTolerance,
        height,
        width,
        aql,
        images,
        widthTolerance,
        heightTolerance,
        comments,
      } = products[i];

      if (
        !styleId ||
        !styleName ||
        !quantity ||
        !color ||
        !weight ||
        !weightTolerance ||
        !length ||
        !lengthTolerance ||
        !height ||
        !width ||
        !aql ||
        !images ||
        !widthTolerance ||
        !heightTolerance
      ) {
        Error.push(`Product ${i + 1} fields are required`);
      }

      let SetData = [];

      for (let j = 0; j < images.length; j++) {
        let data = await imageUploadToBase64(images[j]);
      }

      NewPurchaseOrder.products.push({
        styleId,
        styleName,
        quantity,
        color,
        weight,
        length,
        height,
        width,
        aql,
        weightTolerance,
        lengthTolerance,
        widthTolerance,
        heightTolerance,
        comments,
      });
    }

    if (Error.length > 0) {
      return res.status(400).json({ status: 422, Error });
    }
    console.log(Error);

    await NewPurchaseOrder.save();

    res
      .status(200)
      .json({ message: "New Purachese Order Created", NewPurchaseOrder });

    await User.updateMany(
      {
        _id: { $in: assignedPeople },
      },
      {
        $push: {
          poList: NewPurchaseOrder._id,
        },
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error", error });
  }
};

//Draft Po Api

const PuracheseOrderDraft = async (req, res) => {
  console.log("req.body", req.body);
  try {
    const {
      buyer,
      vendor,
      shiptoName,
      shiptoAdd,
      shipVia,
      shipDate,
      assignedPeople,
      products,
      purchaseDoc,
      status,
      poNumber,
    } = req.body;
    const { id } = req.params;
    console.log(req.body);

    const PuracheseOrderImage = (await imageUploadToBase64(purchaseDoc)) || "";

    let NewPurchaseOrder = new PurchaseOrder({
      purchaseDoc: PuracheseOrderImage,
      buyer,
      vendor,
      shipTo: {
        name: shiptoName,
        completeAddress: shiptoAdd,
        shipVia,
        shippingDate: shipDate,
      },
      assignedPeople,
      status,
      poNumber,
    });

    console.log(NewPurchaseOrder);

    const Error = [];

    for (let i = 0; i < products.length; i++) {
      const {
        styleId,
        styleName,
        quantity,
        color,
        weight,
        weightTolerance,
        length,
        lengthTolerance,
        height,
        width,
        aql,
        images,
        widthTolerance,
        heightTolerance,
        comments,
      } = products[i];

      const productImages = (await imageUploadToBase64(images)) || "";

      NewPurchaseOrder.products.push({
        styleId,
        styleName,
        quantity,
        color,
        weight,
        length,
        height,
        width,
        aql,
        weightTolerance,
        lengthTolerance,
        widthTolerance,
        heightTolerance,
        comments,
        images: productImages,
      });
    }

    if (Error.length > 0) {
      return res.status(400).json({ status: 422, Error });
    }
    console.log(Error);

    await NewPurchaseOrder.save();

    res
      .status(200)
      .json({ message: "New Purachese Order Created", NewPurchaseOrder });

    await User.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $push: {
          draftPoList: NewPurchaseOrder._id,
        },
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error", error });
  }
};

// Purchase Order Display api
const purchaseOrderGet = async (req, res) => {
  try {
    const { id } = req.params;

    const Data = await User.findOne(
      { _id: id },
      {
        poList: 1,
        draftPoList: 1,
        name: 1,
        companyId: 1,
      }
    )
      .populate("companyId", "companyRole")
      .populate({
        path: "poList",
        select: "purchaseDoc status poNumber buyer",
        populate: { path: "buyer", select: "name" },
      })
      .populate({
        path: "draftPoList",
        select: "purchaseDoc status poNumber buyer",
        populate: { path: "buyer", select: "name" },
      });
    let Response = Data;

    if (Data.companyId.companyRole == "Factory") {
      Response = Data.poList.filter(
        (value) =>
          Data.companyId.companyRole == "Factory" && value.status == "Published"
      );
    }
    // console.log(Data);
    if (Data) {
      return res.status(200).json({ message: "Data send", Response });
    }
    return res.status(400).json({ message: "No data found" });
  } catch (error) {
    console.log(error);
  }
};

const PurchaseOrderChange = async (req, res) => {
  try {
    const { id } = req.params; //
  } catch (error) {
    console.log(error);
  }
};

// const getPurchaseOrder = async (req, res) => {
//   try {
//     const { fields } = req.params;
//     let Order = null;
//     if (fields == "All") {
//       Order = await PurchaseOrder.find(
//         {},
//         { _id: 1, purchaseDoc: 1, buyer: 1, status: 1 }
//       );
//     } else {
//       Order = await PurchaseOrder.find(
//         { status: fields },
//         { _id: 1, purchaseDoc: 1, buyer: 1, status: 1 }
//       );
//     }
//     res.status(200).json({ message: "All orders send", Order });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error in fetching branch " });
//   }
// };

export {
  purchaseOrders,
  // getPurchaseOrder,
  purchaseOrderGet,
  PuracheseOrderDraft,
};
