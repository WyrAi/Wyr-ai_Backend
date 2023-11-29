import mongoose from "mongoose";
const purchaseOrderSchema = new mongoose.Schema({
  purchaseDoc: {
    type: String,
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Companydetails",
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Companydetails",
  },
  shipTo: {
    name: { type: String, required: true },
    completeAddress: { type: String, required: true },
    shipVia: { type: String, required: true },
    shippingDate: { type: String, required: true },
  },
  assignedPeople: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  products: [
    {
      styleId: { type: String, required: true },
      styleName: { type: String, required: true },
      quantity: { type: Number, required: true },
      color: { type: String, required: true },
      weight: { type: Number, required: true },
      length: { type: Number, required: true },
      height: { type: Number, required: true },
      width: { type: Number, required: true },
      aql: { type: Number, required: true },
      images: [{ type: String }],
      weightTolerance: {
        type: Number,
        required: true,
        min: -100,
        max: 100,
      },
      lengthTolerance: {
        type: Number,
        required: true,
        min: -100,
        max: 100,
      },
      widthTolerance: {
        type: Number,
        required: true,
        min: -100,
        max: 100,
      },
      heightTolerance: {
        type: Number,
        required: true,
        min: -100,
        max: 100,
      },
      comments: [
        {
          id: Number,
          comment: String,
        },
      ],
    },
  ],
  status: {
    type: String,
    default: "Pending Approval",
    enum: ["Drafts", "Published", "Pending Approval", "Factory Approved"],
  },
  poNumber: {
    type: String,
    required: true,
  },
});

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);

export default PurchaseOrder;
