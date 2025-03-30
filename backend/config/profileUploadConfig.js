const multer = require("multer");
const path = require("path");
const fs = require("fs")


let dir="public/uploads"

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); // Creates directory if not exists
    console.log("Directory created successfully.");
  }
// Configure storage for uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, dir); // Store images in 'public/uploads'
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
