const express = require("express");
const router = express.Router();
const {
  protect,
  authorizeRoles,
} = require("../middlewares/authMiddleware");
const {
  createCrop,
  getMyCrops,
  updateCrop,
  deleteCrop,
  getAllCrops,
  finalizeAuction,
} = require("../controllers/cropController");
const { getCropById } = require("../controllers/buyerController");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload folder exists
const uploadDir = path.join(__dirname, "../uploads/crops");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb("Only images allowed");
};

const upload = multer({ storage, fileFilter });

// Routes
router.post(
  "/",
  protect,
  authorizeRoles("farmer"),
  upload.array("images", 5),
  createCrop
);

router.get("/my", protect, authorizeRoles("farmer"), getMyCrops);
// routes/cropRoutes.js
router.patch(
  "/:id",
  protect,
  authorizeRoles("farmer"),
  upload.array("images", 5), // ← must be here for image uploads
  updateCrop
);

router.delete("/:id", protect, authorizeRoles("farmer"), deleteCrop);
router.get("/", getAllCrops);
router.get("/:id", getCropById);
router.post("/:id/finalize", protect, authorizeRoles("farmer"), finalizeAuction);

module.exports = router;
