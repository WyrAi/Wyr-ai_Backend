import mongoose from "mongoose";

const packingSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Companydetails",
  },

  factoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Companydetails",
  },
  qcHeadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  qcId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Companydetails",
  },
  totalCarton: {
    type: Number,
    required: true,
  },
  invoicenumber: {
    type: Number,
    required: false,
  },
  slotOfInspection: [
    {
      date: Date,
      time: String,
    },
  ],
  packingListFiles: {
    type: String,
  },

  PurchaseOrder: [
    {
      po_Number: {
        type: String,
        required: true,
      },
      products: [
        {
          images: [
            {
              type: String,
            },
          ],
          branch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
          },
          from: {
            type: String,
            required: true,
          },
          quantityPerBox: {
            type: Number,
            required: true,
          },
          styleId: {
            type: String,
            required: true,
          },
          styleName: {
            type: String,
            required: true,
          },
          to: {
            type: String,
            required: true,
          },
          totalBox: {
            type: Number,
            required: true,
          },
          totalQuantity: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
});

const Packing = mongoose.model("Packing", packingSchema);

export default Packing;
