const path = require("path");
const fs = require("fs/promises");

const { User, schemas } = require("../models/user");
const { cloudinary, ResultError, ctrlWrapper } = require("../helpers");

const avatarDir = path.join(__dirname, "../../", "public", "avatars");

const getCurrent = async (req, res) => {
  const { _id, name, email, avatarURL, birthday, phone, city } = req.user;

  res.json({ _id, name, email, avatarURL, birthday, phone, city });
};

const updateUserData = async (req, res, next) => {
  const { _id } = req.user;

  const query = req.body;

  const { error } = schemas.joyUpdateSchema.validate(query);
  if (error) {
    next(ResultError(400, error.message));
  }

  const { name, email, avatarURL, birthday, phone, city } =
    await User.findByIdAndUpdate(_id, req.user, req.body, {
      new: true,
      runValidators: true,
    });

  if (!name || !email) {
    next(ResultError(404));
  }

  res.status(201).json({ _id, name, email, avatarURL, birthday, phone, city });
};

const updateUserAvatar = async (req, res, next) => {
  const { path: tempUpload, originalname } = req.file;
  const { _id } = req.user;
  const userAvatar = await User.findById({ _id });

  await cloudinary.uploader
    .destroy(userAvatar.public_id)
    .then((result) => result);

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, filename);

  await fs.rename(tempUpload, resultUpload);

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
    next(ResultError(403, error.message));
  }
};

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateUserData: ctrlWrapper(updateUserData),
  updateUserAvatar: ctrlWrapper(updateUserAvatar),
};
