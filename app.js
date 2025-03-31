/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict';

/**
 * node modules
 */
const express = require('express');
require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');

/**
 * Initialize express
 */
const app = express();

/**
 * set view engine
 */
app.set('view engine', 'ejs');

/**
 * set public directory
 */
app.use(express.static(`${__dirname}/public`));

/**
 * parse urlendoded body
 */
app.use(express.urlencoded({extended: true}));

/**
 * parse json body
 */
app.use(express.json({ limit: '10mb' }));

/**
 * instance of session storage
 */
const store = new MongoStore({
    mongoUrl: process.env.MONGODB_CONNECTION_STRING,
    collectionName: 'sessions',
    dbName: 'mblog'
});

/**
 * initial express session
 */
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
        maxAge: Number(process.env.SESSION_MAX_AGE)
    }
}));

/**
 * custom route modules
 */
const register = require('./src/routes/register.route')
const login = require('./src/routes/login.route')
const home = require('./src/routes/home.route')
const newSong = require('./src/routes/newsong.route')
const song = require('./src/routes/song.route')
const playing = require('./src/routes/about.route')
const incrementPlays = require('./src/routes/increment.plays.route')
const latest = require('./src/routes/newarrivals.route')
const logout = require('./src/routes/logout.route')
const search = require('./src/routes/search.route')
const genre = require('./src/routes/genre.route')
const genres = require('./src/routes/genres.route')
const artists = require('./src/routes/artists.route')
const artist = require('./src/routes/artist.route')
const profile = require('./src/routes/profile.route')
const play = require('./src/routes/play.route')
const favourite = require('./src/routes/favourite.route')
const playlist = require('./src/routes/playlist.route')

/**
 * Places route
 */
const about = require('./src/routes/about.route')
const contact = require('./src/routes/contact.route')
const terms = require('./src/routes/terms.route')
const privacy = require('./src/routes/privacy.route')
const welcome = require('./src/routes/welcome.route')
const faqs = require('./src/routes/faqs.route')

// Mongoose Config Module
const {connectDB, disconnectDB} = require('./src/config/mongoose.config');

// register page
app.use('/register', register);
// login page
app.use('/login', login);
// logout
app.use('/logout', logout);
// home page
app.use('/', home);
// new song page
app.use('/publish', newSong);
// song page
app.use('/song', song)
// now playing page
app.use('/playing', playing)
// increment totalPlays
app.use('/incrementPlays', incrementPlays)
// latest
app.use('/new', latest)
// search
app.use('/search', search)
// genre
app.use('/genre', genre)
// genres
app.use('/genres', genres)
// artists
app.use('/artists', artists)
// artist
app.use('/artist', artist)
// profile
app.use('/profile', profile)
// play
app.use('/play', play)
// favourite
app.use('/liked', favourite)
//playlist
app.use('/playlist', playlist)

/**
 * Places
 */

// about
app.use('/about', about)
// privacy
app.use('/privacy', privacy)
// contact
app.use('/contact', contact)
// terms
app.use('/terms', terms)
// welcome
app.use('/welcome', welcome)
// faqs
app.use('/faqs', faqs)

/**
 * start server
 */
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, async () => {
    console.log(`Server listening on localhost:3000`);
    await connectDB(process.env.MONGODB_CONNECTION_STRING);
});

server.on('close', async () => {
    await disconnectDB();
});

