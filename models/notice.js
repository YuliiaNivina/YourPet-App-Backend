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
    publicId: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        required: [true],
    },
    price: {
        type: String,
        required: function () {
            return this.category === 'sell';
        },
    },
    comments: {
        type: String,
        required: [true],
    },
    category: {
        type: String,
        enum: ["sell", "lost-found", "in-good-hands"],
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
    category: Joi.string().valid("sell", "lost-found", "in-good-hands"),
    sex: Joi.string()
      .lowercase()
      .valid("male", "female")
      .required(),
    birthday: Joi.string()
      .empty("")
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .message('Invalid date format. Use yyyy-mm-dd format.'),
    type: Joi.string().empty(""),
    imgUrl: Joi.string().empty(""),
    location: Joi.string().empty(""),
    price: Joi.when('category', {
        is: 'sell',
        then: Joi.string().required().messages({
            'any.required': "The price field is required for the 'sell' category",
        }),
        otherwise: Joi.string().allow('').optional(),
    }),
    comments: Joi.string().required(), 
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
