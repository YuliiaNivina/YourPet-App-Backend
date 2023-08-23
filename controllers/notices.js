const { Notice } = require("../models/notice");
const { ResultError, ctrlWrapper } = require("../helpers");

const listNotices = async (req, res, next) => {
    const { _id: notice } = req.user
    const { page = 1, limit = 12 } = req.query
    const skip = (page - 1) * limit
    const query = { notice }

    const result = await Notice.find(query, '-createdAt -updatedAt', { skip, limit }).populate('owner', 'email')
    res.json(result)
}
  
const getNoticeById = async (req, res, next) => {
    const { noticeId } = req.params 
    const result = await Notice.findById(noticeId)
    if(!result) {
        throw ResultError(404, 'Not found')
    }
    res.json(result)
}
  
const addNotice = async (req, res, next) => {
    const { _id: owner } = req.user
    const result = await Notice.create({...req.body, owner})
    res.status(201).json(result)
}
  
const removeNotice = async (req, res, next) => {
    const { noticeId } = req.params
    const result = await Notice.findByIdAndRemove(noticeId)
    if(!result) {
      throw ResultError(404, 'Not found')
    }
    res.json({
      message: 'Notice deleted'
    }) 
}

const listFavorites = async (req, res, next) => {
    const { _id: owner } = req.user
    const { page = 1, limit = 12, favorite = "favorite" } = req.query
    const skip = (page - 1) * limit
    const query = { owner }

    if (favorite) {
        query.favorite = favorite === 'true';
    }

    const result = await Notice.find(query, '-createdAt -updatedAt', { skip, limit }).populate('owner', 'email')
    res.json(result)
}

const updateFavorites = async (req, res, next) => {
    const { noticeId } = req.params

    const result = await Notice.findByIdAndUpdate(noticeId, req.body, {new: true})
    if(!result) {
      throw ResultError(404, 'Not found')
    }
    res.json(result)
}

const listMyNotices = async (req, res, next) => {
    const { _id: owner } = req.user
    const { page = 1, limit = 12 } = req.query
    const skip = (page - 1) * limit
    const query = { owner }

    const result = await Notice.find(query, '-createdAt -updatedAt', { skip, limit }).populate('owner', 'email')
    res.json(result)
}
  
  module.exports = {
    listNotices: ctrlWrapper(listNotices),
    getNoticeById: ctrlWrapper(getNoticeById),
    addNotice: ctrlWrapper(addNotice),
    removeNotice: ctrlWrapper(removeNotice),
    listFavorites: ctrlWrapper(listFavorites),
    updateFavorites: ctrlWrapper(updateFavorites),
    listMyNotices: ctrlWrapper(listMyNotices),
  }