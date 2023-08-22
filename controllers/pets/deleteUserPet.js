const { Pet } = require("../../models/pet");
const { ResultError, cloudinary } = require("../../helpers");

const deleteUserPet = async (req, res, next) => {
  const deletingImage = await Pet.findById({ _id: req.params.petId });
  const status = await Pet.findByIdAndRemove(req.params.petId);
  if (!status) {
    next(ResultError(404));
  }
  try {
    await cloudinary.uploader
      .destroy(deletingImage.public_id)
      .then((result) => result);
  } catch (error) {
    next(ResultError(404, error.message));
  }

  return res.json({ message: "Successful delete" });
};

module.exports = deleteUserPet;
