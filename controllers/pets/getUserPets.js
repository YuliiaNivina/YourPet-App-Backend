const { Pet } = require("../../models/pet");

const { ResultError } = require("../../helpers");

const getUserPets = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Pet.find(
    { owner },
    "name birthday type comments photoURL"
  );

  if (!result) {
    next(ResultError(404));
  }

  res.json(result);
};

module.exports = getUserPets;
