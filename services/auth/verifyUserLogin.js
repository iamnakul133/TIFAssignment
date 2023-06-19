const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "This is my secret key";
const salt = 10;

const verifyUserLogin = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found !");
    }
    if (await bcrypt.compare(password, user.password)) {
      // creating a JWT token
      token = jwt.sign(
        { id: user._id, username: user.email, type: "user" },
        JWT_SECRET,
        { expiresIn: "2h" }
      );
      return { status: "ok", data: token };
    }
    console.log("Wrong Password !");
    return { status: "ok", error: "Invalid Password" };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "timed out" };
  }
};

module.exports = verifyUserLogin;
