const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS: Cho phép frontend truy cập với session
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://127.0.0.1:5000'],
    credentials: true, // Cần có để gửi cookie qua frontend
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: false, // true nếu dùng HTTPS
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    })
}));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../Frontend')));

// Routes
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware'); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Public/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Public/login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Public/signup.html'));
});

app.get('/userql', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Public/userQL.html'));
});

app.get('/usertk', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Public/userTK.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Public/blog.html'));
});

app.get('/blog-read', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Public/blog-read.html'));
});

app.get('/blog-post', authMiddleware,(req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Public/blog-post.html'));
});

app.get('/document', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Public/standard.html'));
});

app.get('/mon-dai-cuong', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Public/mon-dai-cuong.html'));
});

app.get('/mon-co-so-nganh', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Public/mon-co-so-nganh.html'));
});

app.get('/mon-chinh-tri', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Public/mon-chinh-tri.html'));
});

app.get('/mon-chuyen-nganh', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Public/mon-chuyen-nganh.html'));
});

app.get('/mon-tu-chon', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Public/mon-tu-chon.html'));
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Public/upload1.html'));
});


app.use('/api/auth', authRoutes);

// Route trả thông tin người dùng
app.get('/api/user-info', authMiddleware, (req, res) => {
    res.json({
        username: req.session.user.username,
        email: req.session.user.email
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
