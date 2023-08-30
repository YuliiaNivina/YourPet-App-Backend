const express = require("express");

const ctrl = require("../../controllers/notices");

const {authenticate, upload, validateBody, isValidIdNotice} = require("../../middlewares");

const {schemas} = require("../../models/notice");

const router = express.Router();

router.get("/", ctrl.listNotices);

router.get("/favorites", authenticate, ctrl.listFavorites);

router.get("/self", authenticate, ctrl.listMyNotices);

router.get("/:noticeId", ctrl.getNoticeById);

router.post("/", authenticate, upload.single('imgUrl'), validateBody(schemas.addSchema), ctrl.addNotice);

router.patch("/:noticeId/favorites", authenticate, isValidIdNotice, ctrl.updateFavorites);

router.delete("/:noticeId", authenticate, isValidIdNotice, ctrl.removeNotice);

module.exports = router;