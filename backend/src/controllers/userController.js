const User = require("../modals/User");

// Upload KYC
const uploadKYC = async (req, res) => {
  if (!req.file) 
    return res.status(400).json({ message: "No file uploaded" });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { 
      kycStatus: "pending", 
      kycDocument: req.file.path 
    },
    { new: true }
  );

  res.status(200).json({ 
    message: "KYC uploaded successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      kycStatus: user.kycStatus
    }
  });
};

module.exports = { uploadKYC };
