const { isValidObjectId } = require("mongoose");
const { ResultError } = require("../helpers");

const isValidId = (req, res, next) => {
  const { petId } = req.params;
  if (!isValidObjectId(petId)) {

   return next(ResultError(404, "Invalid id"));
  }
  next();
};

module.exports = isValidId;
