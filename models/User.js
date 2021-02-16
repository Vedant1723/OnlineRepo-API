const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is Required!",
  },
  email: {
    type: String,
    required: "Email is Required!",
    unique: true,
  },
  password: {
    type: String,
    required: "Password is Required!",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("User", UserSchema);
