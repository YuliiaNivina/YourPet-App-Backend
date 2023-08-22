const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");
const { ResultError, ctrlWrapper } = require("../helpers");

const {SECRET_KEY} = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw ResultError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
  });

  const payload = {
    id: newUser._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(newUser._id, { token });

  res.status(201).json({
    token,
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  });
};

const login = async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) {
      throw ResultError(401, "Email or password is wrong");
    }
  
    const passwordCompare = await bcrypt.compare(password, user.password);
  
    if (!passwordCompare) {
      throw ResultError(401, "Email or password is wrong");
    }
  
    const payload = {
      id: user._id,
    };
  
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
  
    res.status(201).json({
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  };

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
};
