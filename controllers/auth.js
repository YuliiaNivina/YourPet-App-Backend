const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");
const { ResultError, ctrlWrapper } = require("../helpers");

// const {SECRET_KEY} = process.env;
const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

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

  // const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
    expiresIn: "10m",
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "10d",
  });
  // await User.findByIdAndUpdate(newUser._id, { token });
  await User.findByIdAndUpdate(newUser._id, { accessToken, refreshToken });

  // res.status(201).json({
  //   token,
  //   user: {
  //     name: newUser.name,
  //     email: newUser.email,
  //   },
  // });
  res.status(201).json({
    accessToken,
    refreshToken,
    user: {
      name: user.name,
      email: user.email,
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

  // const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
    expiresIn: "10m",
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "10d",
  });
  // await User.findByIdAndUpdate(user._id, { token });
  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  // res.status(201).json({
  //   token,
  //   user: {
  //     name: user.name,
  //     email: user.email,
  //   },
  // });
  res.status(201).json({
    accessToken,
    refreshToken,
    user: {
      name: user.name,
      email: user.email,
    },
  });
};

const refresh = async (req, res) => {
  const { refreshToken: token } = req.body;
  try {
    const { id } = jwt.verify(token, REFRESH_SECRET_KEY);
    const isExist = await User.findOne({ refreshToken: token });

    if (!isExist) {
      throw ResultError(403, "Token is not valid");
    }

    const payload = {
      id,
    };

    const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
      expiresIn: "10m",
    });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
      expiresIn: "10d",
    });

    res.status(201).json({
      accessToken,
      refreshToken,
    });
  } catch {
    throw ResultError(403, "Token is not valid");
  }
};

const logout = async (req, res) => {
  const { _id } = req.user;
  // await User.findByIdAndUpdate(_id, { token: "" });
  await User.findByIdAndUpdate(_id, { accessToken: "", refreshToken: "" });

  res.status(204).send();
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  refresh: ctrlWrapper(refresh),
  logout: ctrlWrapper(logout),
};
