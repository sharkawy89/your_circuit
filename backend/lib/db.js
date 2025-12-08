const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const path = require('path');


// Load .env if present (useful locally)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const uri =  "mongodb+srv://adhamsharkawy185_db_user:BrfdIGj0DEDmCCrq@next-circuit.ncjq9gj.mongodb.net/?appName=Next-circuit";

if (!uri) {
  console.error('❌ MONGODB_URI is not set. Please configure it in environment variables.');
  // Don't exit here; allow calling code to handle absence in some environments
}

// Create a MongoClient with Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let isConnected = false;

/**
 * Connect to MongoDB with retry logic and also initialize mongoose (for models)
 * @param {number} retries - Number of retry attempts (default: 5)
 */
const connectWithRetry = async (retries = 5) => {
  if (!uri) {
    throw new Error('MONGODB_URI is not configured');
  }

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`📡 Connecting to MongoDB (attempt ${i + 1}/${retries})...`);
      // connect native driver
      await client.connect();
      // verify connection
      await client.db('admin').command({ ping: 1 });

      // also connect mongoose (models expect mongoose)
      await mongoose.connect(uri, {
        dbName: process.env.MONGODB_DB || undefined,
        serverSelectionTimeoutMS: 5000,
      });

      console.log('✅ MongoDB connected successfully (native driver + mongoose)');
      isConnected = true;
      return client;
    } catch (err) {
      console.error(`❌ MongoDB connection attempt ${i + 1}/${retries} failed:`, err?.message || err);

      if (i === retries - 1) {
        console.error('📌 MongoDB connection failed after all retries.');
        console.error('📌 Ensure:');
        console.error('   1. Your IP is whitelisted in MongoDB Atlas Network Access');
        console.error('   2. Database user credentials are correct in MONGODB_URI');
        console.error('   3. MONGODB_URI format is correct: mongodb+srv://username:password@cluster.mongodb.net/?appName=...');
        throw err;
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
};

/**
 * Get the MongoDB client
 */
const getClient = () => {
  if (!isConnected) {
    throw new Error('MongoDB client is not connected. Call connectWithRetry() first.');
  }
  return client;
};

/**
 * Disconnect from MongoDB
 */
const disconnect = async () => {
  if (isConnected) {
    await client.close();
    await mongoose.disconnect();
    isConnected = false;
    console.log('📌 MongoDB disconnected');
  }
};

/**
 * Get a specific database
 * @param {string} dbName - Database name
 */
const getDatabase = (dbName = process.env.MONGODB_DB || 'next-circuit') => {
  if (!isConnected) {
    throw new Error('MongoDB client is not connected.');
  }
  return client.db(dbName);
};

/**
 * Get a specific collection from a database
 * @param {string} dbName - Database name
 * @param {string} collectionName - Collection name
 */
const getCollection = (dbName, collectionName) => {
  return getDatabase(dbName).collection(collectionName);
};

module.exports = {
  client,
  connectWithRetry,
  getClient,
  disconnect,
  getDatabase,
  getCollection,
  isConnected: () => isConnected,
  mongoose,
};
