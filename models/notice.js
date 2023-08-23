const { Schema, model } = require("mongoose");
const Joi = require("joi");

const MongooseError = require("../helpers/MongooseError");

const noticesSchema = Schema({ 
    name: {
        type: String,
        required: [true, "Pet's name is required"],
    },
    title: {
        type: String,
        required: [true],
    },
    sex: {
        type: String,
        enum: ["female", "male"],
        required: [true],
    },
    birthday: {
        type: String,
        required: [true],
    },
    petType: {
        type: String,
        required: [true],
    },
    avatar: {
        type: String,
    },
    location: {
        type: String,
        required: [true],
    },
    price: {
        type: Number,
        default: null,
    },
    comments: {
        type: String,
        required: [true],
    },
    category: {
        type: String,
        enum: ["sell", "lost_found", "in_good_hands"],
        required: [true],
    },
    favorite: [{ 
        type: Schema.Types.ObjectId, 
        ref: "user",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, { versionKey: false, timestamps: true });

noticesSchema.post("save", MongooseError);

const addSchema = Joi.object({
    name: Joi.string().min(2).max(16).empty(""),
    title: Joi.string().required().min(2).max(48),
    sex: Joi.string()
      .lowercase()
      .valid("male", "female")
      .required(),
    birthday: Joi.string().empty(""),
    petType: Joi.string().empty(""),
    avatar: Joi.string().empty(""),
    location: Joi.string().empty(""),
    price: Joi.number().empty(""),
    comments: Joi.string().required().min(8).max(120), 
    category: Joi.string().valid("sell", "lost_found", "in_good_hands"),
});

const schemas = {
    addSchema,
};

const Notice = model("notice", noticesSchema);

module.exports = {
    Notice,
    schemas,
} 
  
module.exports = { Notice, schemas };
