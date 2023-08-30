const path = require("path");
const fs = require("fs/promises");

const { User, schemas } = require("../models/user");
const { cloudinary, ResultError, ctrlWrapper } = require("../helpers");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const getCurrent = async (req, res) => {
  const { _id, name, email, avatarURL, birthday, phone, city } = req.user;

  res.json({ _id, name, email, avatarURL, birthday, phone, city });
};

const updateUserData = async (req, res, next) => {
  const { _id } = req.user;
  const query = req.body;
  let updatedUser = {};

  const { error } = schemas.joyUpdateSchema.validate(query);
  if (error) {
    next(ResultError(400, error.message));
  }

  if (req.body.email) {
      const user = await User.findOne({ email: req.body.email });
      if (user) throw ResultError(409, "Email in use");
    }

  if (req.body) updatedUser = { ...req.body };
  if (req.file) updatedUser.avatarURL = req.file.path;

  console.log(updatedUser);
  const { name, email, avatarURL, birthday, phone, city } =
    await User.findByIdAndUpdate(_id, updatedUser, {
      new: true,
      runValidators: true,
    });

  if (!name || !email) throw ResultError(404, "Not found");

  res.status(201).json({ _id, name, email, avatarURL, birthday, phone, city });
};

const updateUserAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  const userAvatar = await User.findById({ _id });
  userAvatar.public_id !== ""
    ? await cloudinary.uploader
        .destroy(userAvatar.public_id)
        .then((result) => result)
    : (userAvatar.public_id = "");

  let imageURL;
  let publicId;
  try {
    await cloudinary.uploader.upload(resultUpload).then((result) => {
      imageURL = result.url;
      publicId = result.public_id;
      fs.unlink(resultUpload);
    });
    await User.findByIdAndUpdate(_id, {
      avatarURL: imageURL,
      public_id: publicId,
    });
    res.json({
      avatarURL: imageURL,
    });
  } catch (error) {
    if (resultUpload) {
      fs.unlink(resultUpload);
    }
    throw ResultError(403, error.message);
  }
};


module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateUserData: ctrlWrapper(updateUserData),
  updateUserAvatar: ctrlWrapper(updateUserAvatar),
};
