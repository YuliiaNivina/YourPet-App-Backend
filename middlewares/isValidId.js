const { isValidObjectId } = require("mongoose");
const { ResultError } = require("../helpers");

const isValidId = (req, res, next) => {
  const { _id } = req.params;
  if (!isValidObjectId(_id)) {

    next(ResultError(404, "Invalid id"));
  }
  next();
};

module.exports = isValidId;
