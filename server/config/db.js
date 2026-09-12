import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri && !uri.includes('<username>') && !uri.includes('example.mongodb.net')) {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[DB] Connected to MongoDB Atlas: ${conn.connection.host}`);
      return conn;
    } else {
      console.log('[DB] No MongoDB Atlas URI provided. Initializing local in-memory database engine for seamless development...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[DB] Connected to Local In-Memory MongoDB engine: ${conn.connection.host}`);
      return conn;
    }
  } catch (error) {
    console.error(`[DB] Error connecting to MongoDB: ${error.message}`);
    // If Atlas fails (e.g. network IP restriction), fallback gracefully to in-memory instance
    try {
      console.log('[DB] Falling back to In-Memory MongoDB engine...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[DB] Connected to Fallback Local MongoDB engine: ${conn.connection.host}`);
      return conn;
    } catch (fallbackError) {
      console.error('[DB] Fatal error initializing database:', fallbackError);
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
