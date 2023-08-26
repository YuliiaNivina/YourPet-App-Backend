const { Notice } = require("../models/notice");
const { ResultError, ctrlWrapper } = require("../helpers");

const listNotices = async (req, res, next) => {
  const { category, search, page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  const query = {};
  
  if (category) {
    query.category = category;
  }

  if (search) {
    query.title = { $regex: search, $options: 'i' }; 
  }

  const result = await Notice.find(query, { skip, limit }).populate('owner');
  if(!result) {
    throw ResultError(404, "Not found")
  }
  res.json(result);
}
  
const getNoticeById = async (req, res, next) => {
  const { noticeId } = req.params;
  const result = await Notice.findById(noticeId).populate({ path: "owner", select: ["email", "phone", "name"] });
  if(!result) {
      throw ResultError(404, "Not found")
  }
  res.json(result)
}
  
const addNotice = async (req, res, next) => {
  const { _id: owner } = req.user
  const result = await Notice.create({...req.body, owner})
  res.status(201).json(result)
}
  
const removeNotice = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { noticeId } = req.params;

  const result = await Notice.findOneAndDelete({
    _id: noticeId,
    owner: owner,
  });

  if(!result) {
    throw ResultError(404, 'Not found')
  }
  res.json({
    message: 'Notice deleted'
  }) 
}

const listFavorites = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await Notice.findById(userId).populate('favorite');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.favoriteNotices);
  } catch (error) {
    next(error);
  }
}

const updateFavorites = async (req, res, next) => {
  const { id } = req.user;  console.log(req.user)
  const { noticeId } = req.params

  const notice = await Notice.findById(noticeId);

  if (!notice) {
    throw ResultError(404).json({ message: 'Notice not found' });
  }

  const isUserFavorite = notice.favorite.includes(id);

  if (isUserFavorite) {
    notice.favorite = notice.favorite.pull(id);
  } else {
    notice.favorite.push(id);
  }

  await notice.save();

  res.json(notice);
}

const listMyNotices = async (req, res, next) => {
  const ownerId = req.user.id;
   try {
   const notices = await Notice.find({ owner: ownerId });
    res.json(notices);
   } catch (error) { console.log(error)
     next(error);
   }
      
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