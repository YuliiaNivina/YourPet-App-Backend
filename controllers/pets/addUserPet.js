const path = require("path");
const fs = require("fs/promises");

const { ResultError, cloudinary } = require("../../helpers");
const { Pet } = require("../../models/pet");

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const addUserPet = async (req, res, next) => {
  const { _id: owner } = req.user;
  if (!req.file) {
    next(ResultError(400, "Image is required"));
  }
  const { path: tempUpload, originalname } = req.file;
  const filename = `${owner}_ownPet_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  await fs.rename(tempUpload, resultUpload);

  let imageURL;
  let publicId;

  try {
    await cloudinary.uploader.upload(resultUpload).then((result) => {
      imageURL = result.url;
      publicId = result.public_id;
      fs.unlink(resultUpload);
    });
    const newPet = await Pet.create({
      ...req.body,
      image: imageURL,
      public_id: publicId,
      owner,
    });

    res.json({
      petId: newPet._id,
      name: newPet.name,
      birthday: newPet.birthday,
      breed: newPet.breed,
      comments: newPet.comments,
      image: newPet.image,
      public_id: newPet.public_id,
    });
  } catch (error) {
    if (resultUpload) {
      fs.unlink(resultUpload);
    }

    next(ResultError(403, error.message));
  }
};

module.exports = addUserPet;
