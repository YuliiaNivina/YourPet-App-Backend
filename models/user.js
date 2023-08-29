const { Schema, model } = require("mongoose");
const Joi = require("joi");

const MongooseError = require("../helpers/MongooseError");

const nameRegexp = /^[a-zа-яё]{2,16}$/i;
const emailRegexp = /.+@.+\..+/i;
const passwordRegexp = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[0-9a-zA-Z]{6,16}/;
const phoneRegexp = /^\+380\d{9}$/;

const userSchema = new Schema(
  {
    avatarURL: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      match: nameRegexp,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: emailRegexp,
    },
    password: {
      type: String,
      match: passwordRegexp,
      required: true,
    },

    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },

    public_id: {
      type: String,
      default: "",
    },
    favoriteNotices: {
      type: Array,
      default: [],
    },
    birthday: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      match: phoneRegexp,
    },
    city: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", MongooseError);

const joiRegisterSchema = Joi.object({
  name: Joi.string().pattern(nameRegexp).required().empty(false).messages({
    "string.base": "The name must be a string",
    "any.required": "The name field is required",
    "string.empty": "The name must not be empty.",
    "string.min": "The name must be not less 2 symbols.",
    "string.max": "The name must be not more 16 symbols.",
    "string.pattern.base": "The name must consist only any letters.",
  }),
  email: Joi.string().pattern(emailRegexp).required().empty(false).messages({
    "string.base": "The email must be a string",
    "any.required": "The email field is required",
    "string.empty": "The email must not be empty.",
    "string.email": "The value to be a valid email address",
  }),
  password: Joi.string()
    .pattern(passwordRegexp)
    .required()
    .empty(false)
    .messages({
      "string.base": "The password must be a string",
      "any.required": "The password field is required",
      "string.empty": "The password must not be empty.",
      "string.min": "The password must be not less 6 symbols.",
      "string.max": "The name must be not more 16 symbols.",
      "string.pattern.base":
        "The password must consist of 6 English letters at least 1 uppercase letter, 1 lowercase letter and 1 number.",
    }),
});

const joiLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().empty(false).messages({
    "string.base": "The email must be a string",
    "any.required": "The email field is required",
    "string.empty": "The email must not be empty.",
    "string.email": "The value to be a valid email address",
  }),
  password: Joi.string()
    .pattern(passwordRegexp)
    .required()
    .empty(false)
    .messages({
      "string.base": "The password must be a string",
      "any.required": "The password field is required",
      "string.empty": "The password must not be empty.",
      "string.min": "The password must be not less 6 symbols.",
      "string.max": "The name must be not more 16 symbols.",
      "string.pattern.base":
        "The password must consist of 6 English letters at least 1 uppercase letter, 1 lowercase letter and 1 number.",
    }),
});

const joiRefreshSchema = Joi.object({
  refreshToken: Joi.string().empty(false).required(),
});

const joyUpdateSchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string(),
  birthday: Joi.string(),
  city: Joi.string(),
  phone: Joi.string().min(13).max(13),
});

const schemas = {
  joiRegisterSchema,
  joiLoginSchema,
  joiRefreshSchema,
  joyUpdateSchema,
};

const User = model("user", userSchema);

module.exports = { User, schemas };
