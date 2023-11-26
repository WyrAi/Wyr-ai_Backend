import JWT from "jsonwebtoken";

const TokenGernate = async (UserCheck) => {
  const token = JWT.sign({ _id: UserCheck._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};
const ResetTokenGernate = async (UserCheck) => {
  const token = JWT.sign(UserCheck, process.env.RESET_SECERT, {
    expiresIn: "30m",
  });
  return token;
};

export { TokenGernate, ResetTokenGernate };
