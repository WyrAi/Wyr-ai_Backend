import JWT from "jsonwebtoken";

const TokenGernate = async (UserCheck) => {
  const token = await JWT.sign({ _id: UserCheck._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};
const ResetTokenGernate = async (UserCheck) => {
  const token = JWT.sign({ _id: UserCheck._id }, process.env.JWT_SECRET, {
    expiresIn: "30",
  });
  return token;
};

export { TokenGernate, ResetTokenGernate };
