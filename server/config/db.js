import mongoose from 'mongoose';

let memoryServer = null;
let connectionPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI;

  if (uri && !uri.includes('<username>') && !uri.includes('example.mongodb.net')) {
    connectionPromise = mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((conn) => {
        console.log(`[DB] Connected to MongoDB Atlas: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });

    return connectionPromise;
  }

  if (process.env.NETLIFY === 'true') {
    throw new Error('MONGODB_URI is required in the Netlify environment.');
  }

  try {
    console.log('[DB] No MongoDB Atlas URI provided. Initializing local in-memory database engine for seamless development...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`[DB] Connected to Local In-Memory MongoDB engine: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[DB] Error connecting to MongoDB: ${error.message}`);
    console.error('[DB] Fatal error initializing local database:', error);
    throw error;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
