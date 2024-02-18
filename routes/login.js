const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = user;
    res.redirect("/dashboard");
  } else {
    res.redirect("/login?error=invalid");
  }
});

module.exports = router;
