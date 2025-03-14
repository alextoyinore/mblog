/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict';

/**
 * node modules
 */

const mongoose = require('mongoose');

/**
 * Client optioons object containing server API condiguration
 * @type {ClientOpttions}
 */
const clientOptions = {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    },
    dbName: 'mblog'
}

/**
 * Connects to the MongoDB database using the provided connection string
 * 
 * @param {string} connectionStr - The MongoDB connection string
 * @return {Promise<void>} - A promise that resolves when the connection is successfully established
 * @throws {Error} - If there's an error during the connection process
 */
const connectDB = async (connectionStr) => {
    try{
        await mongoose.connect(connectionStr, clientOptions);
        console.log('Connected to mongodb!');
        
    }catch (error){
        console.error('Error occured while attempting to connect to mongodb', error.message);
        throw error;
    }
}

/**
 * Disconnects from the MongoDB database using Mongoose
 * @async
 * @function disconnectDB
 * @throws {Error} - If an error occurs during disconnection
 * @returns {Promise<void>} - A promise that resolves once the disconnection is completed
 */
const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from mongodb!');
        
    }catch (error) {
        console.error('Error disconnecting from mongodb', error.message);
        throw error;
    }
}

module.exports = {
    connectDB,
    disconnectDB
}

