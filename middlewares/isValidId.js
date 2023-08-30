const { isValidObjectId } = require("mongoose");
const { ResultError } = require("../helpers");

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {

   return next(ResultError(404, "Invalid id"));
  }
  next();
};

module.exports = isValidId;
