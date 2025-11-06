const Crop = require("../modals/Crop");

// Get all available crops (with filters)
const getCrops = async (req, res) => {
  const { category, minPrice, maxPrice, auctionMode, district, state } = req.query;
  let filter = { status: "available" };

  if(category) filter.category = category;
  if(auctionMode) filter.auctionMode = auctionMode === "true";
  if(district) filter["location.district"] = district;
  if(state) filter["location.state"] = state;
  if(minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if(maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

  const crops = await Crop.find(filter).populate("farmer", "name email phone location");
  res.status(200).json({ crops });
};

// Get single crop by ID
const getCropById = async (req, res) => {
  const crop = await Crop.findById(req.params.id).populate("farmer", "name email phone location");
  if(!crop) return res.status(404).json({ message: "Crop not found" });
  res.status(200).json({ crop });
};

module.exports = { getCrops, getCropById };
