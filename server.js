const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/netflix-clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Schema
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    watchlist: { type: Array, default: [] }
});

const User = mongoose.model('User', UserSchema);

// Authentication Middleware
const authenticate = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, 'netflix_secret_key');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Routes

// Register User
app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, 'netflix_secret_key', { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, 'netflix_secret_key', { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get User Data
app.get('/api/auth/user', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Movie API Proxy
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY';
app.get('/api/movies/:type', async (req, res) => {
    try {
        const { type } = req.params;
        let url = '';
        
        switch(type) {
            case 'popular':
                url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
                break;
            case 'trending':
                url = `https://api.themoviedb.org/3/trending/all/week?api_key=${TMDB_API_KEY}`;
                break;
            case 'top_rated':
                url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
                break;
            default:
                return res.status(400).json({ message: 'Invalid movie type' });
        }

        const response = await axios.get(url);
        res.json(response.data.results);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));