const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const salt = 10;
const JWT_SECRET = "Thisismysecretkey";
const verifyUserLogin = require("../../services/auth/verifyUserLogin");
const currentUser = require("../middleware/getcurrentUser");

exports.Signup = async (req, res, next) => {
  const { password } = req.body;
  // encrypting our password to store in database
  const hashpassword = await bcrypt.hash(password, salt);
  try {
    // checking if the user exists

    const user = await User.findOne({ email: req.body.email });

    if (user) {
      console.log("User already exists");
      res.status(404).send("User already exists !");
    }

    const newUser = await User.create({
      email: req.body.email,
      name: req.body.name,
      password: hashpassword,
    });

    token = jwt.sign(
      { id: newUser._id, email: newUser.email, type: "user" },
      JWT_SECRET
    );
    newUser.save();

    const responseData = {
      status: true,
      content: {
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          created_at: newUser.createdAt,
        },
        meta: {
          access_token: token,
        },
      },
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "User Signup Failed !" });
  }
};

exports.SignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // we made a function to verify our user login
    const response = await verifyUserLogin(email, password);
    if (response.status === "ok") {
      // storing our JWT web token as a cookie in our browser
      const token = jwt.sign(
        {
          email: email,
          type: "user",
        },
        JWT_SECRET
      );
      res.cookie("token", token, {
        maxAge: 1 * 60 * 60 * 1000,
        httpOnly: true,
      }); // maxAge: 1 hours
      console.log(email);
      const user = await User.findOne({ email: email });

      const responseData = {
        status: true,
        content: {
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            created_at: user.createdAt,
          },
          meta: {
            access_token: token,
          },
        },
      };

      res.status(200).json(responseData);
    } else if (response.error === "Invalid Password") {
      console.log("Invalid password");
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "User Login Failed !" });
  }
};

exports.me = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Login again" });
    }

    const currUser = await currentUser(req.cookies.token);

    const responseData = {
      status: true,
      content: {
        data: {
          _id: currUser._id,
          name: currUser.name,
          email: currUser.email,
          created_at: currUser.createdAt,
        },
        meta: {
          access_token: token,
        },
      },
    };

    res.status(200).json(responseData);
    console.log(responseData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "You need to login Again!" });
  }
};
