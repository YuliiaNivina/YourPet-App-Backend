const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/auth");
const {authenticate, validateBody} = require("../../middlewares");
