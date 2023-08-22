const { CLOUD_NAME_CLOUDINARY, API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY } =
  process.env;

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: CLOUD_NAME_CLOUDINARY,
  api_key: API_KEY_CLOUDINARY,
  api_secret: API_SECRET_CLOUDINARY,
  secure: true,
});

cloudinary.api
  .create_upload_preset({
    name: "PetCare",
    tags: "Dogs, cat, parrots",
    folder: "pets",

    transformation: [
      { aspect_ratio: "4:3", crop: "fill" },
      { width: "auto", crop: "scale" },
      { dpr: "auto" },
      { fetch_format: "auto" },
    ],
  })
  .then((uploadResult) => uploadResult)
  .catch((error) => error);

module.exports = cloudinary;
