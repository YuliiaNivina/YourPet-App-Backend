const { isValidObjectId } = require("mongoose");
const { ResultError } = require("../helpers");

const isValidIdNotice = (req, res, next) => {
  const { noticeId } = req.params;
  if (!isValidObjectId(noticeId)) {

   return next(ResultError(404, "Invalid noticeId"));
  }
  next();
};

module.exports = isValidIdNotice;
