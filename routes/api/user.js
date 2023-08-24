const express = require("express");

const ctrl = require("../../controllers/user");

const { upload, validateBody } = require("../../middlewares");
const {schemas} = require("../../models/user");

const router = new express.Router();

const { ctrlWrapper } = require("../../helpers");

router.get("/current", ctrl.authentification, ctrlWrapper(ctrl.getCurrent));

router.patch(
  "/update",
  ctrl.authentification,
  validateBody(schemas.joyUpdateSchema),
  ctrlWrapper(ctrl.updateUserData)
);

router.patch(
  "/update/avatar",
  ctrl.authentification,
  upload.single("avatarURL"),
  ctrlWrapper(ctrl.updateUserAvatar)
);

module.exports = router;
