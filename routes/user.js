const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.get("/signUp", userController.renderSignUpForm);

router.post(
  "/signUp",
  wrapAsync(userController.signUp)
);

router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.logIn
);

router.get("/logout" ,userController.logOut);

module.exports = router;
