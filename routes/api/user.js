const express = require("express");

const ctrl = require("../../controllers/user");

const { upload, validateBody, authenticate } = require("../../middlewares");
const {schemas} = require("../../models/user");

const router = new express.Router();

const { ctrlWrapper } = require("../../helpers");

router.get("/current", authenticate, ctrlWrapper(ctrl.getCurrent));

router.patch(
  "/update",
  authenticate,
  validateBody(schemas.joyUpdateSchema),
  ctrlWrapper(ctrl.updateUserData)
);

router.patch(
  "/update/avatar",
  authenticate,
  upload.single("avatarURL"),
  ctrlWrapper(ctrl.updateUserAvatar)
);

module.exports = router;
