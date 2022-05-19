const bcryptjs = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Users } = require("../db/usersModel");

const register = async (body) => {
  const { email, password, subscription } = body;
  const newUser = await Users.create({
    email,
    password: await bcryptjs.hash(password, +process.env.BCRYPTJS_SALT),
    subscription,
  });
  return newUser;
};

const login = async (body) => {
  const { email, password } = body;
  let user = await Users.findOne({ email });

  const isPassCorrect = await bcryptjs.compare(password, user.password);
  if (isPassCorrect) {
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    user = await Users.findOneAndUpdate({ email }, { token }, { new: true });
    return user;
  }
};

const logout = async (token) => {
  const user = await Users.findOne({ token }, { token: null }, { new: true });
  return user;
};

const currentUser = async (token) => {
  const user = await Users.findOne(
    { token },
    { email: 1, subscription: 1, _id: 0 }
  );
  return user;
};

module.exports = {
  register,
  login,
  logout,
  currentUser,
};
