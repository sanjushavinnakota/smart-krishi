const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const { getCrops, getCropById } = require("../controllers/buyerController");

router.get("/", protect, authorizeRoles("buyer","farmer"), getCrops);
router.get("/:id", protect, authorizeRoles("buyer","farmer"), getCropById);

module.exports = router;
