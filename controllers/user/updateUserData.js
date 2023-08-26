const { User } = require("../../models/user");
const { ResultError } = require("../../helpers");

const updateUserData = async (req, res, next) => {
  const { userId } = req.params;
  const result = await User.findByIdAndUpdate(userId, req.body, { new: true });
  if (!result) {
    throw ResultError(404, "Not found");
  }
  res.status(200).json(result);
};

module.exports = updateUserData;
