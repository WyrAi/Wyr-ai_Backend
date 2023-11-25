import JWT from "jsonwebtoken";

const TokenGernate = async (UserCheck) => {
  const token = await JWT.sign({ _id: UserCheck._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

export { TokenGernate };
