import mongoose, { Mongoose } from 'mongoose';


const MONGODB_URI = process.env.NEXT_PUBLIC_DB_URL;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the NEXT_PUBLIC_DB_URL environment variable inside .env.local'
  );
}


interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}


declare global {
  var mongoose: MongooseCache;
}


let cached: MongooseCache = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Asynchronously connects to the MongoDB database and caches the connection.
 * @returns {Promise<Mongoose>} A promise that resolves to the Mongoose connection instance.
 */
async function dbConnect(): Promise<Mongoose> {

  if (cached.conn) {
    return cached.conn;
  }


  if (!cached.promise) {
    const opts = {
      bufferCommands: false, 
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
    
      return mongooseInstance;
    });
  }

  try {
   
    cached.conn = await cached.promise;
  } catch (e) {
   
    cached.promise = null;
    throw e;
  }
  
  
  return cached.conn;
}

export default dbConnect;
