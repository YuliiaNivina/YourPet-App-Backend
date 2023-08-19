const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/pets");
const {authenticate, validateBody, isValidId} = require("../../middlewares");
