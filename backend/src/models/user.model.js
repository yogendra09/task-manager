const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
    unique: true,
  },
  password: {
    select:false,
    type: String,
    required: [true, 'Please enter your password'],
  },
});


userSchema.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }
  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

userSchema.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.JWT_EXPIRE || "1d",
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;