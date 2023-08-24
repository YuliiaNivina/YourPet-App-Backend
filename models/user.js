const { Schema, model } = require("mongoose");
const Joi = require("joi");

const MongooseError = require("../helpers/MongooseError");

const nameRegexp = /^[a-zа-яё]{2,16}$/i;
const emailRegexp = /.+@.+\..+/i;
const passwordRegexp = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[0-9a-zA-Z]{6,16}/;
const phoneRegexp = /^\+380\d{7}$/;

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

    token: {
      type: String,
      default: null,
    },
    public_id: {
      type: String,
      default: "",
    },
    favoriteNotices: {
      type: Array,
      dafault: [],
    },
    birthday: {
      type: Date,
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
  name: Joi.string().pattern(nameRegexp).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().pattern(passwordRegexp).required(),
  repeat_password: Joi.ref("password"),
});

const joiLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().pattern(passwordRegexp).required(),
});

const joyUpdateSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string(),
  birthday: Joi.string().required(),
  city: Joi.string(),
  phone: Joi.string().pattern(phoneRegexp),
});

const schemas = {
  joiRegisterSchema,
  joiLoginSchema,
  joyUpdateSchema,
};

const User = model("user", userSchema);

module.exports = { User, schemas };
