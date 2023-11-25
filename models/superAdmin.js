import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const superAdminSchema = new mongoose.Schema({
  role: {
    type: String,
    // required: true
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],

  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Companydetails",
  },
});

superAdminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(12);
            this.password = await bcrypt.hash(this.password, salt);
            this.cpassword = await bcrypt.hash(this.cpassword, salt);
        } catch (error) {
            console.error(error);
        }
    }
    next();
});

// // generating token
// superAdminSchema.methods.generateAuthToken = async function(){
//     try {
//         let token =  jwt.sign({_id: this._id}, process.env.SECRET_KEY);
//         this.tokens = this.tokens.concat({token:token});
//         await this.save();
//         return token;

//     } catch (err) {
//         console.log(err);
//     }
// }

superAdminSchema.methods.comparePassword= async function(password){
    const result = await bcrypt.compareSync(password, this.password);
    return result;
}

const superAdmin = mongoose.model("superAdmin", superAdminSchema);
export default superAdmin;
