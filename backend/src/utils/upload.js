const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads/kyc folder exists
const uploadDir = path.join(__dirname, "../uploads/kyc");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(
      null,
      `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`
    )
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Only images or PDF allowed"));
};

module.exports = multer({ storage, fileFilter });
