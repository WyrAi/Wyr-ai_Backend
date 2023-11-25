import { isValidObjectId } from "mongoose";
import { sendError } from "../utils/helper.js";
import User from "../model/user.js";
import ResetPasswordToken from "../model/resetpassword.js";

export const isResetTokenValid = async(req,res, next )=>{

    const {token, id} = req.query;
    if(!token || !id) return sendError(res, "Invalid request!!!");

    if(!isValidObjectId(id)) return sendError(res, "Invalid User!!")

    const user = await User.findById(id)
    if(!user) return sendError(res, "user not found");

    const resetPasswordToken = await ResetPasswordToken.findOne({owner: user._id})
    if(!resetPasswordToken) return sendError(res, "Reset token not found!");

   const isValid = await resetPasswordToken.compareToken(token);
    if(!isValid) return sendError(res, "Reset token is not valid")


    req.user = user
    next()
}
