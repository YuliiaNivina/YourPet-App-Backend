const getCurrent = async (req, res) => {
  const { _id, name, email, avatarURL, birthday, phone, city } = req.user;

  res.json({ _id, name, email, avatarURL, birthday, phone, city });
};

module.exports = getCurrent;