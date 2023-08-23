const path = require("path");
const fs = require("fs/promises");

const { User } = require("../../models/user");
const { cloudinary, ResultError } = require("../../helpers");

const avatarDir = path.join(__dirname, "../../", "public", "avatars");

const updateUserAvatar = async (req, res, next) => {
  const { path: tempUpload, originalname } = req.file;
  const { _id } = req.user;
  const userAvatar = await User.findById({ _id });
  userAvatar.public_id !== ""
    ? await cloudinary.uploader
        .destroy(userAvatar.public_id)
        .then((result) => result)
    : (userAvatar.public_id = "");

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

module.exports = updateUserAvatar;
