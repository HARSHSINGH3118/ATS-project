const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "ats_resumes",
      resource_type: "auto",   
      public_id: file.originalname.split(".")[0]
    };
  }
});

const upload = multer({ storage });
module.exports = upload;
