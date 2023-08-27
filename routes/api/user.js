const express = require("express");

const ctrl = require("../../controllers/user");

const { upload, validateBody, authenticate } = require("../../middlewares");
const {schemas} = require("../../models/user");

const router = new express.Router();

router.get("/current", authenticate, ctrl.getCurrent);

router.patch("/update", authenticate, validateBody(schemas.joyUpdateSchema), ctrl.updateUserData);

router.patch("/update/avatar", authenticate, upload.single("avatarURL"), ctrl.updateUserAvatar);

module.exports = router;
