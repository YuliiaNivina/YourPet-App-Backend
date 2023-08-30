const path = require("path");
const fs = require("fs/promises");

const { ResultError, cloudinary, ctrlWrapper } = require("../helpers");
const { Pet } = require("../models/pet");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const getUserPets = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Pet.find(
    { owner },
    "name birthday type comments photoURL"
  );

  if (!result) {
    throw ResultError(404, "Not found");
  }

  res.status(200).json(result)
};

const addUserPet = async (req, res) => {
  const { _id: owner } = req.user;
  console.log(owner);

  if (!req.body || !req.file) {
    throw ResultError(400, "Missing any field");
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
      photoURL: imageURL,
      public_id: publicId,
      owner,
    });

    res.status(201).json({
      petId: newPet._id,
      name: newPet.name,
      birthday: newPet.birthday,
      type: newPet.type,
      comments: newPet.comments,
      photoURL: newPet.photoURL,
      photoId: newPet.public_id,
    });
  } catch (error) {
    if (resultUpload) {
      fs.unlink(resultUpload);
    }

    throw ResultError(403, error.message);
  }
};

const deleteUserPet = async (req, res, next) => {
  const { petId } = req.params;
  const { _id: owner } = req.user.id;
  const deletingImage = await Pet.findById( {_id: req.params.petId} );
  const status = await Pet.findByIdAndRemove(req.params.petId, owner);
  if (!status) {
    throw ResultError(404);
  }
  try {
    await cloudinary.uploader
      .destroy(deletingImage.public_id)
      .then((result) => result);
  } catch (error) {
    next(ResultError(404, error.message));
  }

  res.json({ message: "Successful delete" });
};

module.exports = {
  getUserPets: ctrlWrapper(getUserPets),
  addUserPet: ctrlWrapper(addUserPet),
  deleteUserPet: ctrlWrapper(deleteUserPet),
};
