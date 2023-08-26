const { User, schemas } = require("../../models/user");
const { ResultError } = require("../../helpers");

const updateUserData = async (req, res, next) => {
  const { _id } = req.user;

  const query = req.query;

  const { error } = schemas.joyUpdateSchema.validate(query);
  if (error) {
    next(ResultError(400, error.message));
  }

  const { name, email, avatarURL, birthday, phone, city } =
    await User.findByIdAndUpdate(_id, req.user, req.query, {
      new: true,
      runValidators: true,
    });

  if (!name || !email) {
    next(ResultError(404));
  }

  res.status(201).json({ _id, name, email, avatarURL, birthday, phone, city });
};

module.exports = updateUserData;
