const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mosque_finance';
  const useMemory = process.env.USE_MEMORY_DB === 'true';

  if (useMemory) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
    console.log('In-memory MongoDB connected (development)');
    return;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    console.log('MongoDB connected:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      throw err;
    }
    console.warn('Local MongoDB unavailable — starting in-memory database for development.');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
    console.log('In-memory MongoDB connected (data resets when server stops)');
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
