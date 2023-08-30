const fs = require("fs/promises");

const { Notice } = require("../models/notice");
const { ResultError, cloudinary, ctrlWrapper } = require("../helpers");

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

  const result = await Notice.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  if(!result) {
    throw ResultError(404, "Not found");
  }
  res.json(result);
}
  
const getNoticeById = async (req, res, next) => {
  const { noticeId } = req.params;

  const result = await Notice.findById(noticeId).populate({ path: "owner", select: ["email", "phone", "name"] });

  if(!result) {
      throw ResultError(404, "Not found");
  }
  res.json(result);
}
  
const addNotice = async (req, res, next) => {
  const { _id: owner } = req.user;

  if (!req.file) {
    throw ResultError(400, "Image is required");
  }

  const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    folder: "notice-images",
  });

  const imageURL = uploadResult.secure_url;
  const publicId = uploadResult.public_id;

  const result = await Notice.create({
    ...req.body,
    imgUrl: imageURL,
    public_id: publicId,
    owner,
  });

  await fs.unlink(req.file.path);

  if(!result) {
    throw ResultError(404, 'Not added');
  }

  const notices = await Notice.find()
    .sort({ createdAt: -1 })
    .limit(12); 

  notices.unshift(result);

  res.status(201).json(notices);
};
  
const removeNotice = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { noticeId } = req.params;

  const result = await Notice.findOneAndDelete({
    _id: noticeId,
    owner: owner,
  });

  if (result.public_id) {
    await cloudinary.uploader.destroy(result.public_id);
  }

  if(!result) {
    throw ResultError(404, 'Not found');
  }
  res.json({
    message: 'Notice deleted'
  }) 
}

const listFavorites = async (req, res, next) => {
  const userId = req.user.id;
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;

  const notices = await Notice.find({ favorite: userId })
    .sort({ createdAt: -1 })    
    .skip(skip)
    .limit(limit);

  if(!notices) {
    throw ResultError(404, 'Not found');
  }    
  res.json(notices);
}

const updateFavorites = async (req, res, next) => {
  const userId = req.user.id;
  const { noticeId } = req.params;

  const notice = await Notice.findById(noticeId);

  if (!notice) {
    throw ResultError(404).json({ message: 'Notice not found' });
  }

  const isUserFavorite = notice.favorite.includes(userId);

  if (isUserFavorite) {
    notice.favorite.pull(userId);
  } else {
    notice.favorite.push(userId);
  }

  await notice.save();

  res.json(notice);
}

const listMyNotices = async (req, res, next) => {
  const ownerId = req.user.id;
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  
  const result = await Notice.find({ owner: ownerId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  if(!result) {
    throw ResultError(404, 'Not found');
  }
  res.json(result);   
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