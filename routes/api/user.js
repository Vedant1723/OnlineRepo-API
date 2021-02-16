const express = require("express");
const User = require("../../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

router.get("/", (req, res) => {
  res.json({ msg: "User Route is Working!" });
});

//@POST Route
//@DESC User Sign up
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    var user = await User.findOne({ email });
    if (user) {
      return res.json({ msg: "User Already Exists" });
    }
    user = new User({
      name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      {
        expiresIn: 3600000,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ msg: "User Created", user: user, token: token });
      }
    );
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
