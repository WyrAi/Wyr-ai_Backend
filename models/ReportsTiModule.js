import mongoose from "mongoose";

const ReportTimeSchema = mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Time: {
      type: String,
      // default: Date.now,
    },
    Comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ReportTime = mongoose.model("ReportTime", ReportTimeSchema);

export default ReportTime;
