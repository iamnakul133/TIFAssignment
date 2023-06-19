const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Thisismysecretkey";

const currentUser = async (token) => {
  try {
    const verify = jwt.verify(token, JWT_SECRET);
    console.log(verify);

    if (verify.type === "user") {
      const user = await User.findOne({ email: verify.email });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      return user;
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Invalid token. Login Again!" });
  }
};

module.exports = currentUser;
