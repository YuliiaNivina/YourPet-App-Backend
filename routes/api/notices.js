const express = require("express");

const ctrl = require("../../controllers/notices");

const {authenticate, validateBody, isValidId} = require("../../middlewares");

const {schemas} = require("../../models/notice");

const router = express.Router();

router.get("/", ctrl.listNotices);

router.get("/:noticeId", ctrl.getNoticeById);

router.get("/favorites", authenticate, ctrl.listFavorites);

router.get("/self", authenticate, ctrl.listMyNotices);

router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.addNotice)

router.patch("/:noticeId/favorites", authenticate, isValidId, ctrl.updateFavorites);

router.delete("/:noticeId", authenticate, isValidId, ctrl.removeNotice);

module.exports = router;