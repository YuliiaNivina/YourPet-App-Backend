const express = require("express");

const ctrl = require("../../controllers/notices");

const {authenticate, validateBody, isValidId} = require("../../middlewares");

const {schemas} = require("../../models/notice");

const router = express.Router();

router.get("/", ctrl.listNotices);

router.get("/:noticeId", authenticate, isValidId, ctrl.getNoticeById);

router.patch("/favorites/:noticeId", authenticate, isValidId, ctrl.updateFavorites);

router.get("/favorites", authenticate, ctrl.listFavorites);

router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.addNotice)

router.get("/self", authenticate, ctrl.listMyNotices);

router.patch("/favorites/:noticeId", authenticate, isValidId, ctrl.updateFavorites);

router.delete("/:noticeId", authenticate, isValidId, ctrl.removeNotice);

module.exports = router;