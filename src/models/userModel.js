const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username field is required"],
    unique: [true, "Username already registered"],
  },
  email: {
    type: String,
    required: [true, "Email field is required"],
    unique: [true, "Email already registered"],
    validate: {
      validator: validator.isEmail,
      message: "Please enter a valid email address",
    },
  },
  password: { type: String, required: [true, "Password field is required"] },
  userPasswordResetToken: { type: String, default: null },
  userPasswordResetExpire: { type: Date, default: null },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
