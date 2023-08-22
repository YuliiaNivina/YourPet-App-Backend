const jwt = require("jsonwebtoken");
const { User } = require("../../models/user");
const { ResultError } = require("../../helpers");
const { SECRET_KEY } = process.env;

const authentification = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token) {
    next(ResultError(401));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token) {
      next(ResultError(401));
    }
    req.user = user;
    next();
  } catch {
    next(ResultError(400));
  }
};

module.exports = authentification;
