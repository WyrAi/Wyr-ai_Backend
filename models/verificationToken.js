import mongoose from "mongoose";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

const verificationTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  expireTime: {
    type: Number,
    required: true,
  },
});

const VerificationToken = mongoose.model(
  "VerificationToken",
  verificationTokenSchema
);
export default VerificationToken;
