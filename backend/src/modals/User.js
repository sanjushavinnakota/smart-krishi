const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["farmer","buyer","admin"], default: "buyer" },
  phone: { type: String },
  location: { district: String, state: String },
  language: { type: String, default: "en" },
  kycStatus: {
    type: String,
    enum: ["pending", "verified", "not_uploaded"],
    default: "not_uploaded"
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
