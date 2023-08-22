const { Schema, model } = require("mongoose");
const Joi = require("joi");

const MongooseError = require("../helpers/MongooseError");

const nameRegexp = /^[a-zа-яё]/i;
const emailRegexp = /.+@.+\..+/i;
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
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: emailRegexp,
    },
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

const joiUserShema = Joi.object({
  avatarURL: Joi.string().uri().required(),
  name: Joi.string().pattern(nameRegexp),
  email: Joi.string().pattern(emailRegexp).required(),
  data: Joi.date().default(new Date("00.00.0000")).required(),
  phone: Joi.string().pattern(phoneRegexp),
  city: Joi.string(),
});

const User = model("user", userSchema);

module.exports = { User, joiUserShema };
