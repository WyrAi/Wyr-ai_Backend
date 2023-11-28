import mongoose from "mongoose";
// import crypto from "crypto";
const RelationshipSchema = new mongoose.Schema(
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
      default: "Unregistered",
    },
    HashKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// RelationshipSchema.pre("save", function (next) {

//   console.log(hash);
//   this.HashKey = hash;

//   next();
// });

const Relationship = mongoose.model("Relationship", RelationshipSchema);

export default Relationship;
