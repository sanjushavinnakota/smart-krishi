// middleware/upload.js
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure uploads/crops folder exists
const uploadDir = path.join(__dirname, "../uploads/crops");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
