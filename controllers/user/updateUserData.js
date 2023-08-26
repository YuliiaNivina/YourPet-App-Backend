const { User, schemas } = require("../../models/user");
const { ResultError } = require("../../helpers");

const updateUserData = async (req, res, next) => {
  const { _id } = req.user

  const query = req.query

  const { error } = schemas.joyUpdateSchema.validate(query)
  if (error) {
      next(ResultError(400, error.message))
  }

  const key = Object.keys(query)[0]

  const value = query[key]

  if (value === '') {
      next(ResultError(400, `${key} is required`))
  }

  const actionResult = await User.findByIdAndUpdate(req.user, req.query, {
      new: true,
  })

  if (!actionResult) {
      next(ResultError(404))
  }

  const result = await User.findOne({ _id })

  return res.json({ [key]: result[key] })
}

module.exports = updateUserData
