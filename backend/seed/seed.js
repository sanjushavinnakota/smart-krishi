const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../src/modals/User");
const Crop = require("../src/modals/Crop");
dotenv.config();
const connectDB = require("../src/config/db");

const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Crop.deleteMany();

    const salt = await bcrypt.genSalt(10);

    const farmer = await User.create({
      name: "Demo Farmer",
      email: "farmer@test.com",
      password: await bcrypt.hash("123456", salt),
      role: "farmer",
      phone: "9876543210",
      location: { district: "Bangalore", state: "Karnataka" },
      kycStatus: "approved"
    });

    const buyer = await User.create({
      name: "Demo Buyer",
      email: "buyer@test.com",
      password: await bcrypt.hash("123456", salt),
      role: "buyer",
      phone: "9876543211",
      location: { district: "Bangalore", state: "Karnataka" }
    });

    const crop1 = await Crop.create({
      farmer: farmer._id,
      name: "Wheat",
      category: "Grain",
      quantity: 100,
      unit: "kg",
      price: 2500,
      auctionMode: true,
      location: { district: "Bangalore", state: "Karnataka" }
    });

    console.log("Seed done");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
