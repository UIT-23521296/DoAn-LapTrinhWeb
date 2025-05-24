const express = require('express');
const mongoose= require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors')

require('dotenv').config();
console.log("MONGO_URI =", process.env.MONGO_URI);

const app = express();

//Middleware
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],  // hoặc chỉ origin cần thiết
    credentials: true,
}));

app.use(express.json()); //Parse JSON

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => console.error('Error connecting to MongoDB: ', err));

// Session config
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 giờ
    httpOnly: true,
    secure: false, // true nếu dùng HTTPS
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  })
}));

//Đăng ký routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));