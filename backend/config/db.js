// import mongoose from 'mongoose';

// /**
//  * Connects to MongoDB using the URI supplied in environment variables.
//  * Exits the process if the connection fails, since the API is unusable without a database.
//  */
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`MongoDB connection error: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;
import dns from 'dns';
import mongoose from 'mongoose';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in backend/.env');
    }

    if (mongoUri.includes('<db_password>') || mongoUri.includes('[YOUR_PASSWORD]')) {
      throw new Error(
        'Replace the password placeholder in backend/.env with your MongoDB Atlas database password'
      );
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export default connectDB;