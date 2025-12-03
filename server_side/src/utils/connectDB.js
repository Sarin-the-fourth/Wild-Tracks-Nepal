import { mongoose } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

//connection
const connectdb = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    if (db) {
      console.log("MongoDB connected");
    }
  } catch (err) {
    console.log("Mongo Error", err);
  }
};

export default connectdb;
