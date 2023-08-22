const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");

const MongooseError = require("../helpers/MongooseError");

const DATE_REGEX =
  /^(?:19[0-9][0-9]|20[0-9][0-9])-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])$/;

const petSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Pet name is required"],
    },
    birthday: {
      type: String,
      required: [true, "Pet birthday is required"],
    },
    type: {
      type: String,
      required: [true, "Pet type is required"],
    },
    comments: {
      type: String,
      required: [true, "Comments is required"],
    },
    photoURL: {
      type: String,
      required: [true, "Pet photo is required"],
    },
    photoId: {
      type: String,
      default: "",
    },
    owner: {
      type: Types.ObjectId,
      ref: "Users",
      required: [true, "Pet must have an owner"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

petSchema.post("save", MongooseError);

const addPetSchema = Joi.object({
  name: Joi.string().min(3).required().empty(false).messages({
    "string.base": "The name must be a string",
    "any.required": "The name field is required",
    "string.empty": "The name must not be empty",
    "string.min": "The name must be not less 3 symbols",
  }),
  birthday: Joi.string().regex(DATE_REGEX).required().empty(false).messages({
    "string.base": "The birthday must be a string",
    "any.required": "The birthday field is required",
    "string.empty": "The birthday must not be empty",
    "string.pattern.base": "The birthday must be in format YYYY-MM-DD",
  }),
  type: Joi.string().min(3).required().empty(false).messages({
    "string.base": "The type must be a string",
    "any.required": "The type field is required",
    "string.empty": "The type must not be empty",
    "string.min": "The type must be not less 3 symbols",
  }),
  comments: Joi.string().min(3).required().empty(false).messages({
    "string.base": "The comments must be a string",
    "any.required": "The comments field is required",
    "string.empty": "The comments must not be empty",
    "string.min": "The comments must be not less 3 symbols",
  }),
  photoURL: Joi.string().uri().required().messages({
    "any.required": "The photo field is required",
  }),
  photoId: Joi.string(),
});
const schemasPet = { addPetSchema };

const Pet = model("pet", petSchema);

module.exports = {
  Pet,
  schemasPet,
};
