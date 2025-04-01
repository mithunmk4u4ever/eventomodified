const fs = require("fs");
const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(__dirname, "../public/uploads/");

    if (req.baseUrl.includes("/api/users")) {
      uploadPath = path.join(uploadPath, "profilepictures/");
    } else if (req.baseUrl.includes("/api/publicEvents")) {
      uploadPath = path.join(uploadPath, "publicevents/");
    } else if (req.baseUrl.includes("/api/privateEvents")) { // ✅ Added Private Events Path
      uploadPath = path.join(uploadPath, "privateevents/");
    }

    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// File filter (optional - allow only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images (JPG, JPEG, PNG) are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
