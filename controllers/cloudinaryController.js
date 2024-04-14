const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const unlink = (path) => {
  fs.unlink(path, (err) => {
    if (err) console.log(err);
  });
};

const cloudinaryController = {
  upload: async function (path) {
    const response = await cloudinary.uploader.upload(
      path,
      { folder: "images" },
      (error) => {
        if (error) {
          console.error(error);
        }
      }
    );
    unlink(path);
    return response;
  },
};

module.exports = cloudinaryController;
