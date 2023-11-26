import mongoose from "mongoose";

const RelationshipSchema = mongoose.Schema(
  {
    SenderRelationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Companydetails",
      required: true,
    },
    ReceiverRelationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Companydetails",
      required: true,
    },
    Status: {
      type: String,
      required: true,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Relationship = mongoose.model("Relationship", RelationshipSchema);

export default Relationship;
