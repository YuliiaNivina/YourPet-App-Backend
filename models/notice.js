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
    type: {
        type: String,
        required: [true],
    },
    imgUrl: {
        type: String,
    },
    location: {
        type: String,
        required: [true],
    },
    price: {
        type: String,
        default: null,
    },
    comments: {
        type: String,
        required: [true],
    },
    category: {
        type: String,
        enum: ["sell", "lost found", "in good hands"],
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
    name: Joi.string().empty(""),
    title: Joi.string().required(),
    sex: Joi.string()
      .lowercase()
      .valid("male", "female")
      .required(),
    birthday: Joi.string().empty(""),
    type: Joi.string().empty(""),
    imgUrl: Joi.string().empty(""),
    location: Joi.string().empty(""),
    price: Joi.string().empty(""),
    comments: Joi.string().required(), 
    category: Joi.string().valid("sell", "lost found", "in good hands"),
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
