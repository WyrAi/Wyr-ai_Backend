import mongoose from "mongoose";

const companydetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  documentimage: [
    {
      type: String, // add required after getting storage
    },
  ],
  companyimage: {
    type: String, // add required after getting storage
  },
  companyRole: {
    type: String,
    required: true,
  },
  Branches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
  ],
  customRoles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  companyRelations: [
    {
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Companydetails",
      },
      relationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Relationship",
      },
    },
  ],
});

const Companydetails = mongoose.model("Companydetails", companydetailsSchema);

export default Companydetails;
