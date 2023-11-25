import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  pincode: {
    type: Number,
    required: true,
    trim: true,
  },
  coordinates: {
    type: String,
    // required: true,
    trim: true,
  },
  employee: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
});

const Branch = mongoose.model("Branch", BranchSchema);

export default Branch;
