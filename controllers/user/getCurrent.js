const { User } = require("../../models/user");

const getCurrent = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findOne({ _id });

  res.json({
    name: user.name,
    birthday: user.birthday,
    email: user.email,
    phone: user.phone,
    city: user.city,
    avatarURL: user.avatarURL,
  });
};

module.exports = getCurrent;
