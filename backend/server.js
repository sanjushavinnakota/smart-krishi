const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://smart-krishi-gz3ctkeai-sanjushavinnakotas-projects.vercel.app',
    "https://smart-krishi.netlify.app"
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const buyerRoutes = require('./src/routes/buyerRoutes');
const cropRoutes = require('./src/routes/cropRoutes');
const adminRoutes = require("./src/routes/adminRoutes");
const auctionRoutes = require("./src/routes/auctionRoutes");

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/crop', cropRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auction", auctionRoutes);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "src/uploads"))
);


// Root route
app.get('/', (req, res) => {
  res.send('MSME Marketplace API is running...');
});

// Create HTTP server and attach Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://smart-krishi-gz3ctkeai-sanjushavinnakotas-projects.vercel.app",
      "https://smart-krishi.netlify.app"
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});


// Attach auction socket
const auctionSocket = require("./src/sockets/auctionSocket");
auctionSocket(io);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
