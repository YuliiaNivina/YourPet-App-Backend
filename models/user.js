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
      required: true,
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
    token: String,
    data: {
      type: Date,
      required: true,
      default: "00.00.0000",
    },
    phone: {
      type: String,
      match: phoneRegexp,
      default: "+380000000000",
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
  repeat_password: Joi.ref('password'),
});

const joiLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().pattern(passwordRegexp).required(),
});

const schemas = {
  joiRegisterSchema,
  joiLoginSchema,
};

const User = model("user", userSchema);

module.exports = { User, schemas };
