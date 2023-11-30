import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
  },
  cpassword: {
    type: String,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Companydetails",
  },
  profileImage: {
    type: String,
  },
  officeBranch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
  employeeID: {
    type: String,
  },
  verified: {
    type: Boolean,
  },
  poList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseOrder",
    },
  ],
  draftPoList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseOrder",
    },
  ],
  plList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Packing",
    },
  ],
  draftPlList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Packing",
    },
  ],
});

// UserSchema.set("strictPopulate", false);

const User = mongoose.model("User", UserSchema);
export default User;
