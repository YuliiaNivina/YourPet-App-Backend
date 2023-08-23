const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/auth");
const { validateBody } = require("../../middlewares");
const {schemas} = require("../../models/user");

router.post("/register", validateBody(schemas.joiRegisterSchema), ctrl.register);

router.post("/login", validateBody(schemas.joiLoginSchema), ctrl.login);

module.exports = router;