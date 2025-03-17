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
const register = require('./src/routes/registerRoute')
const login = require('./src/routes/loginRoute')
const home = require('./src/routes/homeRoute')
const newSong = require('./src/routes/newSongRoute')
const song = require('./src/routes/songRoute')
const playing = require('./src/routes/playingRoute')
const incrementPlays = require('./src/routes/incrementPlaysRoute')
const latest = require('./src/routes/newRoute')

// Mongoose Config Module
const {connectDB, disconnectDB} = require('./src/config/mongooseConfig');

// register page
app.use('/register', register);
// login page
app.use('/login', login);
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
// query
app.use('/new', latest)

/**
 * start server
 */
const PORT = process.env.PORT || 3000
const IP = process.env.IP || '0.0.0.0'
const server = app.listen(PORT, async () => {
    console.log(`Server listening on localhost:3000`);
    await connectDB(process.env.MONGODB_CONNECTION_STRING);
});

server.on('close', async () => {
    await disconnectDB();
});

