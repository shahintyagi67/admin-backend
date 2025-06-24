// import mongoose from "mongoose";

// const connectDB = async (): Promise<void> => {
//   try {
//     const mongoURI = process.env.MONGO_URI as string;

//     if (!mongoURI) {
//       throw new Error("MONGO_URI is not defined in environment variables.");
//     }

//     await mongoose.connect(mongoURI);
//     console.log("✅ MongoDB connected");
//   } catch (err) {
//     console.error("❌ MongoDB connection failed:", err);
//   }
// };

// export default connectDB;

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGO_URI; 

const connectDB = async () => {
    try {
        if (!url) {
            throw new Error("MONGO_URI is not defined in environment variables.");
        }

        await mongoose.connect(url);
        console.log("✅ Database is connected");
    } catch (err) {
        console.error("❌ Error connecting to the database:", err);
        process.exit(1);
    }
};

export default connectDB;
