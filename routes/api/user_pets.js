const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/user_pets");
const {authenticate, validateBody, isValidId} = require("../../middlewares");