const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/notices");
const {authenticate, validateBody, isValidId} = require("../../middlewares");