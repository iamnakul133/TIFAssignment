const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
router.post("/signin", authController.SignIn);
router.get("/me", authController.me);
router.post("/signup", authController.Signup);

module.exports = router;
