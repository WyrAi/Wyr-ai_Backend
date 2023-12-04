import mongoose from "mongoose";

const InformationSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  comment: [
    {
      type: String,
      required: true,
    },
  ],
});

export const Information = mongoose.model("Information", InformationSchema);
