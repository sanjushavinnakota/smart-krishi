const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const upload = require("../utils/upload");
const { uploadKYC } = require("../controllers/userController");

router.post("/kyc", protect, authorizeRoles("farmer"), upload.single("kyc"), uploadKYC);

module.exports = router;
