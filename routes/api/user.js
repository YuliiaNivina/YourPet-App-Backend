const express = require("express");

const ctrl = require("../../controllers/user");

const { upload } = require("../../middlewares");

const router = new express.Router();

const { ctrlWrapper } = require("../../helpers");

router.get("/current", ctrl.authentification, ctrlWrapper(ctrl.getCurrent));

router.patch(
  "/update",
  ctrl.authentification,
  ctrlWrapper(ctrl.updateUserData)
);

router.patch(
  "/update/avatar",
  ctrl.authentification,
  upload.single("avatarURL"),
  ctrlWrapper(ctrl.updateUserAvatar)
);

module.exports = router;
