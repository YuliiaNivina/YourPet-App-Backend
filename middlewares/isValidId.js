const { isValidObjectId } = require("mongoose");
const { ResultError } = require("../helpers");

const isValidId = (req, res, next) => {
  const { noticeId } = req.params;
  if (!isValidObjectId(noticeId)) {
    next(ResultError(404, "Invalid id"));
  }
  next();
};

module.exports = isValidId;
