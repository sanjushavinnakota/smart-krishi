// utils/notify.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

async function notifyWinner(farmer, buyer, crop, amount) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: farmer.email,
    subject: `Auction Winner for ${crop.name}`,
    text: `Your crop ${crop.name} was won by ${buyer.name} for ₹${amount}.
Contact buyer at ${buyer.phone} or ${buyer.email}.`
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: buyer.email,
    subject: `You won the auction for ${crop.name}`,
    text: `You won ${crop.name} for ₹${amount}.
Contact farmer ${farmer.name} at ${farmer.phone} or ${farmer.email}.`
  });
}

module.exports = { notifyWinner };
